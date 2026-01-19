'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

// ============================================================================
// User Purchases Management
// ============================================================================

/**
 * Get user's purchase history with items and vendor info
 */
export async function getUserPurchases(
    page: number = 1,
    pageSize: number = 10,
    status?: string
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const skip = (page - 1) * pageSize

        const whereClause: any = {
            userId: session.user.id
        }

        if (status && status !== 'all') {
            whereClause.status = status
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    thumbnail: true,
                                    price: true,
                                    vendor: {
                                        select: {
                                            id: true,
                                            name: true,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    payment: {
                        select: {
                            status: true,
                            provider: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.order.count({ where: whereClause })
        ])

        // Get reviews for these orders to check which items have been reviewed
        const productIds = orders.flatMap(order =>
            order.items.map(item => item.productId)
        )

        const userReviews = await prisma.review.findMany({
            where: {
                userId: session.user.id,
                productId: { in: productIds }
            },
            select: {
                productId: true
            }
        })

        const reviewedProductIds = new Set(userReviews.map(r => r.productId))

        // Transform orders with review status
        const purchasesWithReviewStatus = orders.map(order => ({
            id: order.id,
            orderNumber: order.id.slice(-8).toUpperCase(),
            date: order.createdAt.toISOString(),
            status: order.status,
            total: order.totalAmount,
            currency: order.currency,
            vendor: order.vendor,
            payment: order.payment,
            items: order.items.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.product.name,
                image: item.product.thumbnail || '/placeholder-product.jpg',
                price: item.price,
                quantity: item.quantity,
                vendor: item.product.vendor,
                hasReview: reviewedProductIds.has(item.productId)
            }))
        }))

        return {
            success: true,
            data: {
                purchases: purchasesWithReviewStatus,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        }
    } catch (error) {
        console.error('Error fetching user purchases:', error)
        return { success: false, error: 'Failed to fetch purchases' }
    }
}

/**
 * Get single order details by ID
 */
export async function getUserPurchaseById(orderId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: session.user.id
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                thumbnail: true,
                                price: true,
                                fileUrl: true,
                                digitalFiles: {
                                    select: {
                                        id: true,
                                        name: true,
                                        url: true,
                                        size: true,
                                        mimeType: true,
                                    }
                                },
                                vendor: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                },
                payment: true,
                dispute: {
                    select: {
                        id: true,
                        status: true,
                        reason: true,
                    }
                }
            }
        })

        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        // Check which products have reviews
        const productIds = order.items.map(item => item.productId)
        const userReviews = await prisma.review.findMany({
            where: {
                userId: session.user.id,
                productId: { in: productIds }
            },
            select: {
                productId: true,
                id: true,
                rating: true,
                comment: true
            }
        })

        const reviewMap = new Map(userReviews.map(r => [r.productId, r]))

        return {
            success: true,
            data: {
                ...order,
                orderNumber: order.id.slice(-8).toUpperCase(),
                items: order.items.map(item => ({
                    ...item,
                    userReview: reviewMap.get(item.productId) || null
                }))
            }
        }
    } catch (error) {
        console.error('Error fetching order details:', error)
        return { success: false, error: 'Failed to fetch order details' }
    }
}

/**
 * Search user purchases by product name, vendor, or order ID
 */
export async function searchUserPurchases(query: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (!query || query.trim().length < 2) {
            return { success: false, error: 'Search query too short' }
        }

        const searchTerm = query.trim()

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id,
                OR: [
                    { id: { contains: searchTerm, mode: 'insensitive' } },
                    { vendor: { name: { contains: searchTerm, mode: 'insensitive' } } },
                    {
                        items: {
                            some: {
                                product: {
                                    name: { contains: searchTerm, mode: 'insensitive' }
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                thumbnail: true,
                                price: true,
                                vendor: {
                                    select: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }
                    }
                },
                vendor: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return {
            success: true,
            data: orders.map(order => ({
                id: order.id,
                orderNumber: order.id.slice(-8).toUpperCase(),
                date: order.createdAt.toISOString(),
                status: order.status,
                total: order.totalAmount,
                currency: order.currency,
                vendor: order.vendor,
                items: order.items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    image: item.product.thumbnail || '/placeholder-product.jpg',
                    price: item.price,
                    quantity: item.quantity,
                    vendor: item.product.vendor
                }))
            }))
        }
    } catch (error) {
        console.error('Error searching purchases:', error)
        return { success: false, error: 'Failed to search purchases' }
    }
}

/**
 * Get user's disputes/cases
 */
export async function getUserCases(page: number = 1, pageSize: number = 10) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const skip = (page - 1) * pageSize

        const [disputes, total] = await Promise.all([
            prisma.dispute.findMany({
                where: {
                    initiatorId: session.user.id
                },
                include: {
                    order: {
                        select: {
                            id: true,
                            totalAmount: true,
                            createdAt: true,
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            thumbnail: true,
                            vendor: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.dispute.count({
                where: { initiatorId: session.user.id }
            })
        ])

        return {
            success: true,
            data: {
                cases: disputes.map(dispute => ({
                    id: dispute.id,
                    status: dispute.status,
                    reason: dispute.reason,
                    disputeReason: dispute.disputeReason,
                    resolution: dispute.resolution,
                    createdAt: dispute.createdAt.toISOString(),
                    order: dispute.order,
                    product: dispute.product
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
        console.error('Error fetching user cases:', error)
        return { success: false, error: 'Failed to fetch cases' }
    }
}

/**
 * Get download links for purchased order files
 */
export async function getOrderDownloadLinks(orderId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Verify the order belongs to the user and is completed/paid
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: session.user.id,
                status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                fileUrl: true,
                                digitalFiles: {
                                    where: { status: 'ACTIVE' },
                                    select: {
                                        id: true,
                                        name: true,
                                        url: true,
                                        size: true,
                                        mimeType: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return { success: false, error: 'Order not found or not eligible for download' }
        }

        const downloadLinks = order.items.flatMap(item => {
            const files = item.product.digitalFiles.map(file => ({
                productId: item.product.id,
                productName: item.product.name,
                fileId: file.id,
                fileName: file.name,
                url: file.url,
                size: file.size,
                mimeType: file.mimeType
            }))

            // If no digital files, use the main file URL
            if (files.length === 0 && item.product.fileUrl) {
                files.push({
                    productId: item.product.id,
                    productName: item.product.name,
                    fileId: 'main',
                    fileName: `${item.product.name} - Main File`,
                    url: item.product.fileUrl,
                    size: 0,
                    mimeType: 'application/octet-stream'
                })
            }

            return files
        })

        return {
            success: true,
            data: downloadLinks
        }
    } catch (error) {
        console.error('Error fetching download links:', error)
        return { success: false, error: 'Failed to fetch download links' }
    }
}
