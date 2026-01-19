'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

// ============================================================================
// User Reviews Management
// ============================================================================

/**
 * Get reviews written by the current user
 */
export async function getUserReviews(page: number = 1, pageSize: number = 10) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const skip = (page - 1) * pageSize

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { userId: session.user.id },
                include: {
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
            prisma.review.count({ where: { userId: session.user.id } })
        ])

        return {
            success: true,
            data: {
                reviews: reviews.map(review => ({
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt.toISOString(),
                    updatedAt: review.updatedAt.toISOString(),
                    product: review.product
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
        console.error('Error fetching user reviews:', error)
        return { success: false, error: 'Failed to fetch reviews' }
    }
}

/**
 * Create a product review (validates user purchased the product)
 */
export async function createProductReview(
    productId: string,
    rating: number,
    comment?: string
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' }
        }

        // Check if user has purchased this product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId: session.user.id,
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            }
        })

        if (!hasPurchased) {
            return { success: false, error: 'You can only review products you have purchased' }
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId
                }
            }
        })

        if (existingReview) {
            return { success: false, error: 'You have already reviewed this product' }
        }

        // Create the review
        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating,
                comment: comment?.trim() || null,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        vendorId: true,
                    }
                }
            }
        })

        // Update vendor's average rating
        await updateVendorRating(review.product.vendorId)

        // Create notification for vendor
        const vendor = await prisma.vendor.findUnique({
            where: { id: review.product.vendorId },
            select: { userId: true }
        })

        if (vendor) {
            await prisma.notification.create({
                data: {
                    userId: vendor.userId,
                    type: 'REVIEW_RECEIVED',
                    title: 'New Review',
                    message: `Your product "${review.product.name}" received a ${rating}-star review`,
                    data: { productId, reviewId: review.id, rating }
                }
            })
        }

        revalidatePath('/account/purchases')
        revalidatePath(`/3d-models/products/${productId}`)

        return {
            success: true,
            data: review
        }
    } catch (error) {
        console.error('Error creating review:', error)
        return { success: false, error: 'Failed to create review' }
    }
}

/**
 * Update an existing review
 */
export async function updateProductReview(
    reviewId: string,
    rating: number,
    comment?: string
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' }
        }

        // Find the review and verify ownership
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                product: {
                    select: {
                        id: true,
                        vendorId: true,
                    }
                }
            }
        })

        if (!existingReview) {
            return { success: false, error: 'Review not found' }
        }

        if (existingReview.userId !== session.user.id) {
            return { success: false, error: 'You can only edit your own reviews' }
        }

        // Update the review
        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating,
                comment: comment?.trim() || null,
            }
        })

        // Update vendor's average rating if rating changed
        if (existingReview.rating !== rating) {
            await updateVendorRating(existingReview.product.vendorId)
        }

        revalidatePath('/account/purchases')
        revalidatePath(`/3d-models/products/${existingReview.productId}`)

        return {
            success: true,
            data: updatedReview
        }
    } catch (error) {
        console.error('Error updating review:', error)
        return { success: false, error: 'Failed to update review' }
    }
}

/**
 * Delete a review
 */
export async function deleteProductReview(reviewId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Find the review and verify ownership
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                product: {
                    select: {
                        id: true,
                        vendorId: true,
                    }
                }
            }
        })

        if (!review) {
            return { success: false, error: 'Review not found' }
        }

        if (review.userId !== session.user.id) {
            return { success: false, error: 'You can only delete your own reviews' }
        }

        // Delete the review
        await prisma.review.delete({
            where: { id: reviewId }
        })

        // Update vendor's average rating
        await updateVendorRating(review.product.vendorId)

        revalidatePath('/account/purchases')
        revalidatePath(`/3d-models/products/${review.productId}`)

        return { success: true }
    } catch (error) {
        console.error('Error deleting review:', error)
        return { success: false, error: 'Failed to delete review' }
    }
}

/**
 * Get products purchased by user that don't have reviews yet
 */
export async function getProductsToReview() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get all products the user has purchased (from completed orders)
        const purchasedItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    userId: session.user.id,
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            },
            include: {
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
                },
                order: {
                    select: {
                        id: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                order: { createdAt: 'desc' }
            }
        })

        // Get products the user has already reviewed
        const reviewedProductIds = await prisma.review.findMany({
            where: { userId: session.user.id },
            select: { productId: true }
        }).then(reviews => new Set(reviews.map(r => r.productId)))

        // Filter to only unreviewd products (unique by productId)
        const unreviewedProducts = new Map()
        for (const item of purchasedItems) {
            if (!reviewedProductIds.has(item.productId) && !unreviewedProducts.has(item.productId)) {
                unreviewedProducts.set(item.productId, {
                    productId: item.productId,
                    name: item.product.name,
                    thumbnail: item.product.thumbnail,
                    vendor: item.product.vendor,
                    orderId: item.order.id,
                    purchasedAt: item.order.createdAt.toISOString()
                })
            }
        }

        return {
            success: true,
            data: Array.from(unreviewedProducts.values())
        }
    } catch (error) {
        console.error('Error fetching products to review:', error)
        return { success: false, error: 'Failed to fetch products to review' }
    }
}

/**
 * Check if user has reviewed a specific product
 */
export async function getReviewByProductId(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const review = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId
                }
            }
        })

        return {
            success: true,
            data: review
        }
    } catch (error) {
        console.error('Error fetching review:', error)
        return { success: false, error: 'Failed to fetch review' }
    }
}

/**
 * Check if user can review a product (has purchased it)
 */
export async function canReviewProduct(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, canReview: false, reason: 'Unauthorized' }
        }

        // Check if user has purchased this product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId: session.user.id,
                    status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
                }
            }
        })

        if (!hasPurchased) {
            return { success: true, canReview: false, reason: 'You must purchase this product before reviewing' }
        }

        // Check if user already reviewed
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId
                }
            }
        })

        if (existingReview) {
            return { success: true, canReview: false, reason: 'You have already reviewed this product', existingReviewId: existingReview.id }
        }

        return { success: true, canReview: true }
    } catch (error) {
        console.error('Error checking review eligibility:', error)
        return { success: false, canReview: false, reason: 'Failed to check review eligibility' }
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Update vendor's average rating based on all product reviews
 */
async function updateVendorRating(vendorId: string) {
    try {
        // Get all reviews for vendor's products
        const reviews = await prisma.review.findMany({
            where: {
                product: { vendorId }
            },
            select: { rating: true }
        })

        if (reviews.length === 0) {
            await prisma.vendor.update({
                where: { id: vendorId },
                data: {
                    averageRating: 0,
                    totalReviews: 0
                }
            })
            return
        }

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        const averageRating = totalRating / reviews.length

        await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                totalReviews: reviews.length
            }
        })
    } catch (error) {
        console.error('Error updating vendor rating:', error)
    }
}
