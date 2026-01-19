'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'

/**
 * Get vendor's payout balance
 */
export async function getPayoutBalance() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                escrowAccount: {
                    select: {
                        balance: true,
                        availableBalance: true,
                        currency: true,
                    },
                },
            },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        return {
            balance: vendor.escrowAccount?.balance || 0,
            availableBalance: vendor.escrowAccount?.availableBalance || 0,
            currency: vendor.escrowAccount?.currency || 'USD',
        }
    } catch (error) {
        console.error('Error fetching payout balance:', error)
        return null
    }
}

/**
 * Request payout (Vendor only)
 */
export async function requestPayout(data: {
    amount: number
    method: string
    details: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                escrowAccount: {
                    select: {
                        availableBalance: true,
                    },
                },
            },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Check if vendor has enough balance
        const availableBalance = vendor.escrowAccount?.availableBalance || 0
        if (data.amount > availableBalance) {
            return {
                success: false,
                error: 'Insufficient balance',
            }
        }

        // Create withdrawal request
        const withdrawal = await prisma.withdrawal.create({
            data: {
                vendorId: vendor.id,
                amount: data.amount,
                method: data.method,
                details: data.details,
                status: 'PENDING',
            },
        })

        revalidatePath('/seller/finance/payouts')
        return { success: true, withdrawal }
    } catch (error) {
        console.error('Error requesting payout:', error)
        return { success: false, error: 'Failed to request payout' }
    }
}

/**
 * Get payout history
 */
export async function getPayoutHistory() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { vendorId: vendor.id },
            orderBy: { createdAt: 'desc' },
        })

        return withdrawals
    } catch (error) {
        console.error('Error fetching payout history:', error)
        return []
    }
}

/**
 * Get vendor's payout methods
 */
export async function getPayoutMethods() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                payoutMethods: {
                    where: { isActive: true },
                    orderBy: { isDefault: 'desc' },
                },
            },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        return vendor.payoutMethods
    } catch (error) {
        console.error('Error fetching payout methods:', error)
        return []
    }
}

/**
 * Add payout method
 */
export async function addPayoutMethod(data: {
    type: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO'
    label: string
    details: any
    isDefault?: boolean
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await prisma.vendorPayoutMethod.updateMany({
                where: {
                    vendorId: vendor.id,
                    isDefault: true,
                },
                data: { isDefault: false },
            })
        }

        const payoutMethod = await prisma.vendorPayoutMethod.create({
            data: {
                vendorId: vendor.id,
                type: data.type,
                label: data.label,
                details: data.details,
                isDefault: data.isDefault || false,
            },
        })

        revalidatePath('/seller/finance/payouts')
        return { success: true, payoutMethod }
    } catch (error) {
        console.error('Error adding payout method:', error)
        return { success: false, error: 'Failed to add payout method' }
    }
}

/**
 * Delete payout method
 */
export async function deletePayoutMethod(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findUnique({
            where: { id },
            select: { vendorId: true },
        })

        if (!method || method.vendorId !== vendor.id) {
            throw new Error('Unauthorized')
        }

        await prisma.vendorPayoutMethod.delete({
            where: { id },
        })

        revalidatePath('/seller/finance/payouts')
        return { success: true }
    } catch (error) {
        console.error('Error deleting payout method:', error)
        return { success: false, error: 'Failed to delete payout method' }
    }
}
