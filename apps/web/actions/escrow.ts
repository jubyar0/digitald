'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'

// ============================================================================
// Admin Escrow Management Functions
// ============================================================================

/**
 * Get all escrow accounts with vendor info
 */
export async function getEscrowAccounts(page = 1, pageSize = 20) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const skip = (page - 1) * pageSize

        const [accounts, total] = await Promise.all([
            prisma.escrowAccount.findMany({
                skip,
                take: pageSize,
                orderBy: { updatedAt: 'desc' },
                include: {
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            user: {
                                select: { email: true, name: true }
                            }
                        }
                    },
                    _count: {
                        select: { transactions: true }
                    }
                }
            }),
            prisma.escrowAccount.count()
        ])

        return { data: accounts, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching escrow accounts:', error)
        throw new Error('Failed to fetch escrow accounts')
    }
}

/**
 * Get escrow account details with transactions
 */
export async function getEscrowAccountDetails(vendorId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const account = await prisma.escrowAccount.findUnique({
            where: { vendorId },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        user: {
                            select: { email: true, name: true, id: true }
                        }
                    }
                },
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 50
                }
            }
        })

        return account
    } catch (error) {
        console.error('Error fetching escrow account details:', error)
        throw new Error('Failed to fetch escrow account details')
    }
}

/**
 * Get escrow transactions for a vendor
 */
export async function getEscrowTransactions(vendorId: string, page = 1, pageSize = 20) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const account = await prisma.escrowAccount.findUnique({
            where: { vendorId },
            select: { id: true }
        })

        if (!account) {
            return { data: [], total: 0, page, pageSize }
        }

        const skip = (page - 1) * pageSize

        const [transactions, total] = await Promise.all([
            prisma.escrowTransaction.findMany({
                where: { escrowAccountId: account.id },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.escrowTransaction.count({
                where: { escrowAccountId: account.id }
            })
        ])

        return { data: transactions, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching escrow transactions:', error)
        throw new Error('Failed to fetch escrow transactions')
    }
}

/**
 * Adjust escrow balance manually (Admin only)
 */
export async function adjustEscrowBalance(data: {
    vendorId: string
    amount: number
    reason: string
    type: 'ADD' | 'SUBTRACT' | 'HOLD' | 'UNHOLD'
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        // Get or create escrow account
        let account = await prisma.escrowAccount.findUnique({
            where: { vendorId: data.vendorId }
        })

        if (!account) {
            account = await prisma.escrowAccount.create({
                data: {
                    vendorId: data.vendorId,
                    balance: 0,
                    availableBalance: 0,
                    currency: 'USD'
                }
            })
        }

        const amount = Math.abs(data.amount)
        const heldBalance = account.balance - account.availableBalance

        // Validation based on type
        if (data.type === 'SUBTRACT') {
            if (account.balance - amount < 0) return { success: false, error: 'Insufficient total balance' }
            if (account.availableBalance - amount < 0) return { success: false, error: 'Insufficient available balance' }
        } else if (data.type === 'HOLD') {
            if (account.availableBalance - amount < 0) return { success: false, error: 'Insufficient available balance to hold' }
        } else if (data.type === 'UNHOLD') {
            if (heldBalance - amount < 0) return { success: false, error: 'Cannot unhold more than currently held amount' }
        }

        // Determine updates
        let updateData: any = {}
        let transactionType: 'DEPOSIT' | 'RELEASE' | 'HOLD' | 'UNHOLD' = 'DEPOSIT'

        switch (data.type) {
            case 'ADD':
                updateData = {
                    balance: { increment: amount },
                    availableBalance: { increment: amount }
                }
                transactionType = 'DEPOSIT'
                break
            case 'SUBTRACT':
                updateData = {
                    balance: { decrement: amount },
                    availableBalance: { decrement: amount }
                }
                transactionType = 'RELEASE'
                break
            case 'HOLD':
                updateData = {
                    availableBalance: { decrement: amount }
                }
                transactionType = 'HOLD'
                break
            case 'UNHOLD':
                updateData = {
                    availableBalance: { increment: amount }
                }
                transactionType = 'UNHOLD'
                break
        }

        // Update balance and log transaction
        await prisma.$transaction(async (tx) => {
            await tx.escrowAccount.update({
                where: { id: account!.id },
                data: updateData
            })

            await tx.escrowTransaction.create({
                data: {
                    escrowAccountId: account!.id,
                    amount: amount,
                    type: transactionType,
                    status: 'COMPLETED',
                    description: `Manual adjustment (${data.type}): ${data.reason}`
                }
            })
        })

        revalidatePath('/admin/escrow')
        return { success: true }
    } catch (error) {
        console.error('Error adjusting escrow balance:', error)
        return { success: false, error: 'Failed to adjust balance' }
    }
}

/**
 * Get escrow summary stats for admin dashboard
 */
export async function getEscrowStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const [totalAccounts, aggregates, pendingWithdrawals] = await Promise.all([
            prisma.escrowAccount.count(),
            prisma.escrowAccount.aggregate({
                _sum: {
                    balance: true,
                    availableBalance: true
                }
            }),
            prisma.withdrawal.aggregate({
                where: { status: 'PENDING' },
                _sum: { amount: true },
                _count: true
            })
        ])

        return {
            totalAccounts,
            totalBalance: aggregates._sum.balance || 0,
            totalAvailable: aggregates._sum.availableBalance || 0,
            totalHeld: (aggregates._sum.balance || 0) - (aggregates._sum.availableBalance || 0),
            pendingWithdrawalsCount: pendingWithdrawals._count,
            pendingWithdrawalsAmount: pendingWithdrawals._sum.amount || 0
        }
    } catch (error) {
        console.error('Error fetching escrow stats:', error)
        throw new Error('Failed to fetch escrow stats')
    }
}
