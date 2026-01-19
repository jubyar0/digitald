'use server'

import { prisma } from '@/lib/db'

/**
 * Get published products for the frontend
 */
export async function getPublishedProducts(params?: {
    page?: number
    pageSize?: number
    categoryId?: string
    search?: string
    sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high'
    minPrice?: number
    maxPrice?: number
}) {
    try {
        const {
            page = 1,
            pageSize = 12,
            categoryId,
            search,
            sortBy = 'newest',
            minPrice,
            maxPrice
        } = params || {}

        const skip = (page - 1) * pageSize
        const where: any = {
            status: 'PUBLISHED',
            isActive: true,
            isDraft: false
        }

        // Category filter
        if (categoryId) {
            where.categoryId = categoryId
        }

        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {}
            if (minPrice !== undefined) where.price.gte = minPrice
            if (maxPrice !== undefined) where.price.lte = maxPrice
        }

        // Sorting
        let orderBy: any = { createdAt: 'desc' }
        switch (sortBy) {
            case 'popular':
                orderBy = { views: 'desc' }
                break
            case 'price_low':
                orderBy = { price: 'asc' }
                break
            case 'price_high':
                orderBy = { price: 'desc' }
                break
            default:
                orderBy = { createdAt: 'desc' }
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy,
                include: {
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            averageRating: true,
                            totalReviews: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    reviews: {
                        select: {
                            rating: true
                        }
                    },
                    _count: {
                        select: {
                            reviews: true,
                            wishlistedBy: true
                        }
                    }
                }
            }),
            prisma.product.count({ where })
        ])

        // Calculate average rating for each product
        const productsWithRating = products.map((product: any) => {
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
                : 0

            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                currency: product.currency,
                thumbnail: product.thumbnail,
                images: product.images,
                views: product.views,
                downloads: product.downloads,
                likes: product.likes,
                createdAt: product.createdAt,
                vendor: product.vendor,
                category: product.category,
                averageRating: avgRating,
                totalReviews: product._count.reviews,
                totalWishlists: product._count.wishlistedBy,
                _count: {
                    reviews: product._count.reviews
                }
            }
        })

        return {
            data: productsWithRating,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching published products:', error)
        throw new Error('Failed to fetch products')
    }
}

/**
 * Get a single product by slug or ID
 */
export async function getProductBySlug(slugOrId: string) {
    try {
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { id: slugOrId },
                    { name: slugOrId } // You might want to add a slug field to Product model
                ],
                status: 'PUBLISHED',
                isActive: true,
                isDraft: false
            },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        avatar: true,
                        coverImage: true,
                        averageRating: true,
                        totalReviews: true,
                        totalFollowers: true,
                        bio: true,
                        specializations: true,
                        location: true,
                        socialLinks: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        parent: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                versions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                },
                _count: {
                    select: {
                        reviews: true,
                        wishlistedBy: true
                    }
                }
            }
        })

        if (!product) {
            return null
        }

        // Increment view count
        await prisma.product.update({
            where: { id: product.id },
            data: { views: { increment: 1 } }
        })

        // Calculate average rating
        const avgRating = product.reviews.length > 0
            ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
            : 0

        return {
            ...product,
            averageRating: avgRating,
            totalReviews: product._count.reviews,
            totalWishlists: product._count.wishlistedBy
        }
    } catch (error) {
        console.error('Error fetching product:', error)
        throw new Error('Failed to fetch product')
    }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8) {
    try {
        const products = await prisma.product.findMany({
            where: {
                status: 'PUBLISHED',
                isActive: true,
                isDraft: false
            },
            take: limit,
            orderBy: [
                { views: 'desc' },
                { downloads: 'desc' }
            ],
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                }
            }
        })

        return products
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return []
    }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categorySlug: string, page = 1, pageSize = 12) {
    try {
        const category = await prisma.category.findFirst({
            where: {
                slug: categorySlug,
                isActive: true
            }
        })

        if (!category) {
            return { data: [], total: 0, page, pageSize, totalPages: 0 }
        }

        return getPublishedProducts({
            page,
            pageSize,
            categoryId: category.id
        })
    } catch (error) {
        console.error('Error fetching products by category:', error)
        throw new Error('Failed to fetch products by category')
    }
}

/**
 * Get related products
 */
export async function getRelatedProducts(productId: string, limit = 4) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { categoryId: true }
        })

        if (!product) {
            return []
        }

        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: productId },
                status: 'PUBLISHED',
                isActive: true,
                isDraft: false
            },
            take: limit,
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                }
            }
        })

        return relatedProducts
    } catch (error) {
        console.error('Error fetching related products:', error)
        return []
    }
}

/**
 * Get product statistics
 */
export async function getProductStats() {
    try {
        const [totalProducts, totalVendors, totalCategories] = await Promise.all([
            prisma.product.count({
                where: {
                    status: 'PUBLISHED',
                    isActive: true
                }
            }),
            prisma.vendor.count(),
            prisma.category.count({
                where: {
                    isActive: true
                }
            })
        ])

        return {
            totalProducts,
            totalVendors,
            totalCategories
        }
    } catch (error) {
        console.error('Error fetching product stats:', error)
        return {
            totalProducts: 0,
            totalVendors: 0,
            totalCategories: 0
        }
    }
}
