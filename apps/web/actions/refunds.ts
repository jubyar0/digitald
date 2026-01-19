'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"
import { RefundReason } from '@repo/database'

export async function requestRefund(data: {
    orderId: string
    orderItemId?: string
    amount: number
    reason: RefundReason
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify order ownership (customer) or permission
        const order = await prisma.order.findUnique({
            where: { id: data.orderId },
            include: { user: true }
        })

        if (!order || order.userId !== session.user.id) {
            throw new Error('Unauthorized')
        }

        await prisma.refund.create({
            data: {
                orderId: data.orderId,
                orderItemId: data.orderItemId,
                amount: data.amount,
                reason: data.reason,
                status: 'PENDING'
            }
        })

        revalidatePath('/orders')
        return { success: true }
    } catch (error) {
        console.error('Error requesting refund:', error)
        return { success: false, error: 'Failed to request refund' }
    }
}

export async function getSellerRefunds() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Get refunds for orders belonging to this vendor
        // Note: This assumes orders are linked to vendors directly or via items.
        // Adjusting query based on typical multi-vendor structure where OrderItem has vendorId or Order has vendorId
        // Assuming Order has vendorId for simplicity based on previous context, or we filter by order items.
        // Let's check schema for Order-Vendor relation. 
        // If not direct, we might need to fetch orders where vendorId matches.

        const refunds = await prisma.refund.findMany({
            where: {
                order: {
                    vendorId: vendor.id
                }
            },
            include: {
                order: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return refunds
    } catch (error) {
        console.error('Error fetching refunds:', error)
        return []
    }
}

export async function updateRefundStatus(refundId: string, status: 'APPROVED' | 'REJECTED' | 'COMPLETED') {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify refund belongs to vendor's order
        const refund = await prisma.refund.findUnique({
            where: { id: refundId },
            include: { order: true }
        })

        if (!refund || refund.order.vendorId !== vendor.id) {
            throw new Error('Unauthorized')
        }

        await prisma.refund.update({
            where: { id: refundId },
            data: { status }
        })

        revalidatePath('/seller/orders/returns')
        return { success: true }
    } catch (error) {
        console.error('Error updating refund status:', error)
        return { success: false, error: 'Failed to update refund status' }
    }
}
