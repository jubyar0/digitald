'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getDisputes(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [disputes, total] = await Promise.all([
            prisma.dispute.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            id: true,
                            totalAmount: true,
                            currency: true,
                        },
                    },
                    initiator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.dispute.count({ where }),
        ])

        return { data: disputes, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching disputes:', error)
        throw new Error('Failed to fetch disputes')
    }
}

export async function resolveDispute(
    disputeId: string,
    resolution: string,
    refundAmount?: number,
    resolvedByAdmin = true
) {
    try {
        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { order: true },
        })

        if (!dispute) {
            throw new Error('Dispute not found')
        }

        await prisma.$transaction(async (tx: any) => {
            // Update dispute status
            await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: 'RESOLVED',
                    resolution,
                    resolvedByAdmin,
                    refundAmount,
                    refundProcessed: !!refundAmount,
                },
            })

            // If refund is involved
            if (refundAmount && refundAmount > 0) {
                // Logic to process refund (e.g., update wallet balances)
                // This is a simplified example. In a real app, you'd interact with payment gateways or internal wallets.

                // 1. Refund to buyer
                await tx.wallet.upsert({
                    where: { userId: dispute.initiatorId },
                    create: { userId: dispute.initiatorId, balance: refundAmount },
                    update: { balance: { increment: refundAmount } },
                })

                await tx.walletTransaction.create({
                    data: {
                        walletId: (await tx.wallet.findUnique({ where: { userId: dispute.initiatorId } }))!.id,
                        amount: refundAmount,
                        type: 'REFUND',
                        status: 'COMPLETED',
                        reference: `Refund for dispute ${disputeId}`,
                    }
                })

                // 2. Deduct from vendor (if funds were released) or release remaining to vendor
                // For now, we assume funds are held in escrow and we just release the difference to vendor if any.
                // This logic depends heavily on the escrow implementation details.
            }
        })

        revalidatePath('/admin/disputes')
        return { success: true }
    } catch (error) {
        console.error('Error resolving dispute:', error)
        throw new Error('Failed to resolve dispute')
    }
}

// ============================================================================
// Reviews Management
// ============================================================================

export async function getReviews(page = 1, pageSize = 10, rating?: number) {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (rating) {
            where.rating = rating
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.review.count({ where }),
        ])

        return { data: reviews, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        throw new Error('Failed to fetch reviews')
    }
}

export async function deleteReview(reviewId: string) {
    try {
        await prisma.review.delete({
            where: { id: reviewId },
        })

        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error('Error deleting review:', error)
        throw new Error('Failed to delete review')
    }
}

// ============================================================================
// Order Management (Admin Overrides)
// ============================================================================

export async function updateOrderStatus(orderId: string, status: any) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        })

        revalidatePath('/admin/orders')
        return { success: true }
    } catch (error) {
        console.error('Error updating order status:', error)
        throw new Error('Failed to update order status')
    }
}
