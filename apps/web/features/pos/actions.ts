'use server'

import { prisma } from '@/lib/db'
import { getCurrentSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { unstable_cache } from 'next/cache'
import { OrderStatus, PaymentStatus, PaymentGateway } from '@repo/database'

/**
 * Get products for POS
 * Optimized for speed with caching
 */
export async function getPosProducts(query?: string, categoryId?: string) {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    // We use a composite cache key based on vendor, query, and category
    const cacheKey = `pos-products-${session.user.id}-${query || 'all'}-${categoryId || 'all'}`

    return unstable_cache(
        async () => {
            const vendor = await prisma.vendor.findUnique({
                where: { userId: session.user.id },
                select: { id: true }
            })

            if (!vendor) return []

            const where: any = {
                vendorId: vendor.id,
                isActive: true,
                status: 'PUBLISHED'
            }

            if (query) {
                where.OR = [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            }

            if (categoryId && categoryId !== 'all') {
                where.categoryId = categoryId
            }

            return prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    thumbnail: true,
                    categoryId: true,
                    category: {
                        select: { name: true }
                    }
                },
                orderBy: {
                    name: 'asc'
                },
                take: 100 // Limit for performance
            })
        },
        [cacheKey],
        {
            tags: [`pos-products-${session.user.id}`],
            revalidate: 60 // Cache for 1 minute
        }
    )()
}

/**
 * Process a POS Order
 */
export async function processPosOrder(data: {
    items: { productId: string; quantity: number; price: number }[]
    totalAmount: number
    paymentMethod: 'CASH' | 'CARD'
    customerEmail?: string
}) {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id }
    })

    if (!vendor) {
        throw new Error('Vendor not found')
    }

    // Create the order
    const order = await prisma.order.create({
        data: {
            userId: session.user.id, // In POS, the seller is technically the "user" creating the order, or we could use a generic customer
            vendorId: vendor.id,
            totalAmount: data.totalAmount,
            status: OrderStatus.COMPLETED, // POS orders are instant
            items: {
                create: data.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            },
            payment: {
                create: {
                    amount: data.totalAmount,
                    provider: PaymentGateway.BALANCE, // Using BALANCE as a placeholder for POS cash/external card
                    status: PaymentStatus.COMPLETED,
                    metadata: {
                        method: data.paymentMethod,
                        source: 'POS',
                        customerEmail: data.customerEmail
                    }
                }
            }
        }
    })

    revalidatePath('/seller/orders')
    revalidatePath('/seller/analytics')

    return { success: true, orderId: order.id }
}
