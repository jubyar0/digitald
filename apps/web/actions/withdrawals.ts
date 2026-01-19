'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

// ============================================================================
// Types
// ============================================================================

export interface WithdrawalRequest {
    amount: number;
    payoutMethodId: string;
    notes?: string;
}

export interface WithdrawalResult {
    success: boolean;
    withdrawalId?: string;
    error?: string;
}

// ============================================================================
// Vendor Actions
// ============================================================================

/**
 * Get vendor's available balance for withdrawal
 */
export async function getVendorBalance() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            include: {
                escrowAccount: true
            }
        });

        if (!vendor) {
            return { success: false, error: 'Vendor not found' };
        }

        // Get pending withdrawals
        const pendingWithdrawals = await prisma.withdrawal.aggregate({
            where: {
                vendorId: vendor.id,
                status: 'PENDING'
            },
            _sum: { amount: true }
        });

        const totalBalance = vendor.escrowAccount?.balance || 0;
        const pendingAmount = pendingWithdrawals._sum.amount || 0;
        const availableBalance = totalBalance - pendingAmount;

        return {
            success: true,
            totalBalance,
            pendingAmount,
            availableBalance,
            currency: vendor.escrowAccount?.currency || 'USD'
        };
    } catch (error) {
        console.error('Error getting vendor balance:', error);
        return { success: false, error: 'Failed to get balance' };
    }
}

/**
 * Request a withdrawal
 */
export async function requestWithdrawal(
    data: WithdrawalRequest
): Promise<WithdrawalResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            include: {
                escrowAccount: true,
                payoutMethods: {
                    where: { id: data.payoutMethodId, isActive: true }
                }
            }
        });

        if (!vendor) {
            return { success: false, error: 'Vendor not found' };
        }

        if (vendor.payoutMethods.length === 0) {
            return { success: false, error: 'Invalid payout method' };
        }

        const payoutMethod = vendor.payoutMethods[0];

        // Check available balance
        const pendingWithdrawals = await prisma.withdrawal.aggregate({
            where: {
                vendorId: vendor.id,
                status: 'PENDING'
            },
            _sum: { amount: true }
        });

        const totalBalance = vendor.escrowAccount?.balance || 0;
        const pendingAmount = pendingWithdrawals._sum.amount || 0;
        const availableBalance = totalBalance - pendingAmount;

        if (data.amount <= 0) {
            return { success: false, error: 'Amount must be positive' };
        }

        if (data.amount > availableBalance) {
            return { success: false, error: 'Insufficient balance' };
        }

        // Minimum withdrawal check (e.g., $10)
        const minWithdrawal = 10;
        if (data.amount < minWithdrawal) {
            return { success: false, error: `Minimum withdrawal is $${minWithdrawal}` };
        }

        // Create withdrawal request
        const withdrawal = await prisma.withdrawal.create({
            data: {
                vendorId: vendor.id,
                amount: data.amount,
                currency: vendor.escrowAccount?.currency || 'USD',
                status: 'PENDING',
                method: payoutMethod.type,
                details: JSON.stringify({
                    payoutMethodId: payoutMethod.id,
                    payoutMethodLabel: payoutMethod.label,
                    notes: data.notes
                })
            }
        });

        // Create hold transaction in escrow
        if (vendor.escrowAccount) {
            await prisma.escrowTransaction.create({
                data: {
                    escrowAccountId: vendor.escrowAccount.id,
                    amount: data.amount,
                    type: 'HOLD',
                    status: 'COMPLETED',
                    description: `Hold for withdrawal request #${withdrawal.id}`
                }
            });
        }

        revalidatePath('/seller/finance');
        return { success: true, withdrawalId: withdrawal.id };
    } catch (error) {
        console.error('Error requesting withdrawal:', error);
        return { success: false, error: 'Failed to request withdrawal' };
    }
}

/**
 * Get vendor's withdrawal history
 */
export async function getVendorWithdrawals() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return [];
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        });

        if (!vendor) {
            return [];
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { vendorId: vendor.id },
            orderBy: { createdAt: 'desc' },
            include: {
                processor: {
                    select: { name: true, email: true }
                }
            }
        });

        return withdrawals;
    } catch (error) {
        console.error('Error getting withdrawals:', error);
        return [];
    }
}

/**
 * Cancel a pending withdrawal (by vendor)
 */
export async function cancelWithdrawal(withdrawalId: string): Promise<WithdrawalResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            include: { escrowAccount: true }
        });

        if (!vendor) {
            return { success: false, error: 'Vendor not found' };
        }

        const withdrawal = await prisma.withdrawal.findFirst({
            where: {
                id: withdrawalId,
                vendorId: vendor.id,
                status: 'PENDING'
            }
        });

        if (!withdrawal) {
            return { success: false, error: 'Withdrawal not found or not pending' };
        }

        // Update withdrawal status
        await prisma.withdrawal.update({
            where: { id: withdrawalId },
            data: { status: 'CANCELLED' }
        });

        // Release hold in escrow
        if (vendor.escrowAccount) {
            await prisma.escrowTransaction.create({
                data: {
                    escrowAccountId: vendor.escrowAccount.id,
                    amount: withdrawal.amount,
                    type: 'UNHOLD',
                    status: 'COMPLETED',
                    description: `Released hold for cancelled withdrawal #${withdrawalId}`
                }
            });
        }

        revalidatePath('/seller/finance');
        return { success: true };
    } catch (error) {
        console.error('Error cancelling withdrawal:', error);
        return { success: false, error: 'Failed to cancel withdrawal' };
    }
}

// ============================================================================
// Admin Actions
// ============================================================================

/**
 * Get all pending withdrawals (Admin)
 */
export async function getAllPendingWithdrawals() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return [];
        }

        // Check admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return [];
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            include: {
                vendor: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        },
                        payoutMethods: true
                    }
                }
            }
        });

        return withdrawals;
    } catch (error) {
        console.error('Error getting pending withdrawals:', error);
        return [];
    }
}

/**
 * Get all withdrawals with filters (Admin)
 */
export async function getAllWithdrawals(status?: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return [];
        }

        // Check admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return [];
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: status ? { status: status as any } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                vendor: {
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    }
                },
                processor: {
                    select: { name: true, email: true }
                }
            }
        });

        return withdrawals;
    } catch (error) {
        console.error('Error getting withdrawals:', error);
        return [];
    }
}

/**
 * Approve a withdrawal (Admin)
 */
export async function approveWithdrawal(withdrawalId: string): Promise<WithdrawalResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Check admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId },
            include: {
                vendor: {
                    include: {
                        escrowAccount: true,
                        payoutMethods: true
                    }
                }
            }
        });

        if (!withdrawal) {
            return { success: false, error: 'Withdrawal not found' };
        }

        if (withdrawal.status !== 'PENDING') {
            return { success: false, error: 'Withdrawal is not pending' };
        }

        // Get payout method details
        const details = JSON.parse(withdrawal.details || '{}');
        const payoutMethod = withdrawal.vendor.payoutMethods.find(
            pm => pm.id === details.payoutMethodId
        );

        // Process actual payout based on method
        let payoutSuccess = false;
        let payoutReference = '';

        if (payoutMethod?.type === 'STRIPE') {
            // Process Stripe payout (requires Stripe Connect)
            const stripeResult = await processStripePayout(
                withdrawal.amount,
                withdrawal.currency,
                payoutMethod.details as string
            );
            payoutSuccess = stripeResult.success;
            payoutReference = stripeResult.transferId || '';
        } else {
            // For PayPal, Bank Transfer, Crypto - mark as approved for manual processing
            payoutSuccess = true;
            payoutReference = `MANUAL_${Date.now()}`;
        }

        if (!payoutSuccess) {
            return { success: false, error: 'Failed to process payout' };
        }

        // Update withdrawal
        await prisma.withdrawal.update({
            where: { id: withdrawalId },
            data: {
                status: 'COMPLETED',
                processedBy: session.user.id,
                processedAt: new Date(),
                details: JSON.stringify({
                    ...details,
                    payoutReference
                })
            }
        });

        // Update escrow balance
        if (withdrawal.vendor.escrowAccount) {
            await prisma.escrowAccount.update({
                where: { id: withdrawal.vendor.escrowAccount.id },
                data: {
                    balance: { decrement: withdrawal.amount }
                }
            });

            // Create release transaction
            await prisma.escrowTransaction.create({
                data: {
                    escrowAccountId: withdrawal.vendor.escrowAccount.id,
                    amount: withdrawal.amount,
                    type: 'RELEASE',
                    status: 'COMPLETED',
                    description: `Withdrawal #${withdrawalId} approved and processed`
                }
            });
        }

        // Create payout transaction record
        await prisma.transaction.create({
            data: {
                type: 'PAYMENT_OUT',
                amount: withdrawal.amount,
                currency: withdrawal.currency,
                status: 'COMPLETED',
                referenceId: withdrawalId,
                userId: withdrawal.vendor.userId,
                description: `Withdrawal payout via ${withdrawal.method}`
            }
        });

        revalidatePath('/admin/withdrawals');
        return { success: true };
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        return { success: false, error: 'Failed to approve withdrawal' };
    }
}

/**
 * Reject a withdrawal (Admin)
 */
export async function rejectWithdrawal(
    withdrawalId: string,
    reason?: string
): Promise<WithdrawalResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Check admin role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId },
            include: {
                vendor: {
                    include: { escrowAccount: true }
                }
            }
        });

        if (!withdrawal) {
            return { success: false, error: 'Withdrawal not found' };
        }

        if (withdrawal.status !== 'PENDING') {
            return { success: false, error: 'Withdrawal is not pending' };
        }

        const details = JSON.parse(withdrawal.details || '{}');
        await prisma.withdrawal.update({
            where: { id: withdrawalId },
            data: {
                status: 'FAILED',
                processedBy: session.user.id,
                processedAt: new Date(),
                details: JSON.stringify({
                    ...details,
                    rejectionReason: reason
                })
            }
        });

        // Release hold in escrow
        if (withdrawal.vendor.escrowAccount) {
            await prisma.escrowTransaction.create({
                data: {
                    escrowAccountId: withdrawal.vendor.escrowAccount.id,
                    amount: withdrawal.amount,
                    type: 'UNHOLD',
                    status: 'COMPLETED',
                    description: `Hold released for rejected withdrawal #${withdrawalId}`
                }
            });
        }

        revalidatePath('/admin/withdrawals');
        return { success: true };
    } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        return { success: false, error: 'Failed to reject withdrawal' };
    }
}

// ============================================================================
// Payout Processing Helpers
// ============================================================================

interface StripePayoutResult {
    success: boolean;
    transferId?: string;
    error?: string;
}

async function processStripePayout(
    amount: number,
    currency: string,
    connectedAccountDetails: string
): Promise<StripePayoutResult> {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return { success: false, error: 'Stripe not configured' };
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16'
        });

        // Parse connected account ID from details
        let connectedAccountId: string;
        try {
            const details = JSON.parse(connectedAccountDetails);
            connectedAccountId = details.stripeAccountId;
        } catch {
            return { success: false, error: 'Invalid payout method details' };
        }

        if (!connectedAccountId) {
            return { success: false, error: 'Stripe account not linked' };
        }

        // Create transfer to connected account
        const transfer = await stripe.transfers.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            destination: connectedAccountId,
            description: 'Marketplace earnings payout'
        });

        return { success: true, transferId: transfer.id };
    } catch (error: any) {
        console.error('Stripe payout error:', error);
        return { success: false, error: error.message };
    }
}
