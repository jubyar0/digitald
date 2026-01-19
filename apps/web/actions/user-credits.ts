'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

// ============================================================================
// User Credits & Wallet Management
// ============================================================================

/**
 * Get user's wallet with balance and currency
 */
export async function getUserWallet() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id }
        })

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: session.user.id,
                    balance: 0,
                    pendingBalance: 0,
                    currency: 'USD'
                }
            })
        }

        return {
            success: true,
            data: {
                id: wallet.id,
                balance: wallet.balance,
                pendingBalance: wallet.pendingBalance,
                currency: wallet.currency,
                totalAvailable: wallet.balance
            }
        }
    } catch (error) {
        console.error('Error fetching user wallet:', error)
        return { success: false, error: 'Failed to fetch wallet' }
    }
}

/**
 * Get wallet transaction history with pagination
 */
export async function getWalletTransactions(
    page: number = 1,
    pageSize: number = 10
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id }
        })

        if (!wallet) {
            return {
                success: true,
                data: {
                    transactions: [],
                    pagination: {
                        page,
                        pageSize,
                        total: 0,
                        totalPages: 0
                    }
                }
            }
        }

        const skip = (page - 1) * pageSize

        const [transactions, total] = await Promise.all([
            prisma.walletTransaction.findMany({
                where: { walletId: wallet.id },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.walletTransaction.count({
                where: { walletId: wallet.id }
            })
        ])

        return {
            success: true,
            data: {
                transactions: transactions.map(tx => ({
                    id: tx.id,
                    amount: tx.amount,
                    type: tx.type,
                    status: tx.status,
                    reference: tx.reference,
                    createdAt: tx.createdAt.toISOString()
                })),
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        }
    } catch (error) {
        console.error('Error fetching wallet transactions:', error)
        return { success: false, error: 'Failed to fetch transactions' }
    }
}

/**
 * Redeem a gift card code and add credits to wallet
 */
export async function redeemGiftCard(code: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (!code || code.trim().length < 8) {
            return { success: false, error: 'Invalid gift card code' }
        }

        const normalizedCode = code.trim().toUpperCase()

        // Find the gift card
        const giftCard = await prisma.giftCard.findUnique({
            where: { code: normalizedCode }
        })

        if (!giftCard) {
            return { success: false, error: 'Gift card not found' }
        }

        // Check if card is active
        if (giftCard.status !== 'ACTIVE') {
            if (giftCard.status === 'REDEEMED') {
                return { success: false, error: 'This gift card has already been fully redeemed' }
            }
            if (giftCard.status === 'EXPIRED') {
                return { success: false, error: 'This gift card has expired' }
            }
            if (giftCard.status === 'VOIDED') {
                return { success: false, error: 'This gift card is no longer valid' }
            }
            return { success: false, error: 'Gift card is not valid' }
        }

        // Check expiry
        if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
            // Mark as expired
            await prisma.giftCard.update({
                where: { id: giftCard.id },
                data: { status: 'EXPIRED' }
            })
            return { success: false, error: 'This gift card has expired' }
        }

        // Check remaining balance
        if (giftCard.balance <= 0) {
            await prisma.giftCard.update({
                where: { id: giftCard.id },
                data: { status: 'REDEEMED' }
            })
            return { success: false, error: 'This gift card has no remaining balance' }
        }

        const amountToRedeem = giftCard.balance

        // Get or create user wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id }
        })

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: session.user.id,
                    balance: 0,
                    pendingBalance: 0,
                    currency: 'USD'
                }
            })
        }

        // Perform redemption in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create wallet transaction
            await tx.walletTransaction.create({
                data: {
                    walletId: wallet!.id,
                    amount: amountToRedeem,
                    type: 'GIFT_CARD_REDEMPTION',
                    status: 'COMPLETED',
                    reference: `Gift Card: ${giftCard.code}`
                }
            })

            // Update wallet balance
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet!.id },
                data: {
                    balance: { increment: amountToRedeem }
                }
            })

            // Create redemption record
            await tx.giftCardRedemption.create({
                data: {
                    giftCardId: giftCard.id,
                    userId: session.user!.id as string,
                    amount: amountToRedeem
                }
            })

            // Update gift card
            await tx.giftCard.update({
                where: { id: giftCard.id },
                data: {
                    balance: 0,
                    status: 'REDEEMED'
                }
            })

            return updatedWallet
        })

        revalidatePath('/account/credits')

        return {
            success: true,
            data: {
                amountRedeemed: amountToRedeem,
                currency: giftCard.currency,
                newBalance: result.balance,
                message: `Successfully redeemed ${giftCard.currency} ${amountToRedeem.toFixed(2)}`
            }
        }
    } catch (error) {
        console.error('Error redeeming gift card:', error)
        return { success: false, error: 'Failed to redeem gift card' }
    }
}

/**
 * Get user's gift card redemption history
 */
export async function getRedemptionHistory(
    page: number = 1,
    pageSize: number = 10
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const skip = (page - 1) * pageSize

        const [redemptions, total] = await Promise.all([
            prisma.giftCardRedemption.findMany({
                where: { userId: session.user.id },
                include: {
                    giftCard: {
                        select: {
                            code: true,
                            amount: true,
                            currency: true,
                            vendor: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.giftCardRedemption.count({
                where: { userId: session.user.id }
            })
        ])

        return {
            success: true,
            data: {
                redemptions: redemptions.map(r => ({
                    id: r.id,
                    amount: r.amount,
                    createdAt: r.createdAt.toISOString(),
                    giftCard: {
                        code: r.giftCard.code.slice(0, 4) + '****' + r.giftCard.code.slice(-4),
                        originalAmount: r.giftCard.amount,
                        currency: r.giftCard.currency,
                        vendor: r.giftCard.vendor
                    }
                })),
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        }
    } catch (error) {
        console.error('Error fetching redemption history:', error)
        return { success: false, error: 'Failed to fetch redemption history' }
    }
}

/**
 * Get user credit summary for quick display
 */
export async function getCreditSummary() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: session.user.id },
            include: {
                transactions: {
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        })

        if (!wallet) {
            return {
                success: true,
                data: {
                    balance: 0,
                    currency: 'USD',
                    recentTransactions: [],
                    totalRedeemed: 0
                }
            }
        }

        // Get total amount redeemed via gift cards
        const totalRedeemed = await prisma.giftCardRedemption.aggregate({
            where: { userId: session.user.id },
            _sum: { amount: true }
        })

        return {
            success: true,
            data: {
                balance: wallet.balance,
                currency: wallet.currency,
                recentTransactions: wallet.transactions.map(tx => ({
                    id: tx.id,
                    amount: tx.amount,
                    type: tx.type,
                    createdAt: tx.createdAt.toISOString()
                })),
                totalRedeemed: totalRedeemed._sum.amount || 0
            }
        }
    } catch (error) {
        console.error('Error fetching credit summary:', error)
        return { success: false, error: 'Failed to fetch credit summary' }
    }
}

// ============================================================================
// Gift Card Code Generation (for vendor/admin use)
// ============================================================================

/**
 * Generate a secure gift card code (internal utility)
 */
function generateGiftCardCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding confusing chars
    let code = ''
    const randomBytes = crypto.randomBytes(16)

    for (let i = 0; i < 16; i++) {
        code += chars[randomBytes[i] % chars.length]
        if ((i + 1) % 4 === 0 && i < 15) {
            code += '-'
        }
    }

    return code
}
