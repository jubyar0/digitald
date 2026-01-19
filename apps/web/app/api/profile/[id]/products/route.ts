import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { searchParams } = new URL(request.url)
        
        // Pagination params
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit
        
        // Filtering params
        const categoryId = searchParams.get('categoryId')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sortBy') || 'newest' // newest, popular, price_asc, price_desc
        
        // Find vendor by ID (vendor ID or user ID)
        const vendor = await prisma.vendor.findFirst({
            where: {
                OR: [
                    { id: id },
                    { userId: id }
                ]
            },
            select: {
                id: true
            }
        })

        if (!vendor) {
            return NextResponse.json(
                { error: 'Vendor not found' },
                { status: 404 }
            )
        }

        // Build where clause
        const where: any = {
            vendorId: vendor.id,
            status: 'PUBLISHED',
            isActive: true,
            isDraft: false
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) where.price.gte = parseFloat(minPrice)
            if (maxPrice) where.price.lte = parseFloat(maxPrice)
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Build orderBy clause
        let orderBy: any = { createdAt: 'desc' } // default: newest
        
        switch (sortBy) {
            case 'popular':
                orderBy = { downloads: 'desc' }
                break
            case 'price_asc':
                orderBy = { price: 'asc' }
                break
            case 'price_desc':
                orderBy = { price: 'desc' }
                break
            case 'rating':
                orderBy = [
                    { reviews: { _count: 'desc' } }
                ]
                break
        }

        // Fetch products with pagination
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    currency: true,
                    thumbnail: true,
                    images: true,
                    categoryId: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    views: true,
                    downloads: true,
                    likes: true,
                    createdAt: true,
                    updatedAt: true,
                    reviews: {
                        select: {
                            rating: true
                        }
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            }),
            prisma.product.count({ where })
        ])

        // Calculate average rating for each product
        const productsWithRating = products.map(product => {
            const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
            const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
            
            return {
                ...product,
                averageRating: parseFloat(averageRating.toFixed(1)),
                reviewCount: product.reviews.length,
                reviews: undefined // Remove reviews array from response
            }
        })

        return NextResponse.json({
            products: productsWithRating,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + products.length < total
            }
        })
    } catch (error) {
        console.error('Error fetching vendor products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}
