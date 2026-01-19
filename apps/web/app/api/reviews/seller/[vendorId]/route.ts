import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { vendorId: string } }
) {
    try {
        const { vendorId } = params
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // Get seller reviews
        const [reviews, total] = await Promise.all([
            prisma.sellerReview.findMany({
                where: {
                    vendorId
                },
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
                skip,
                take: limit
            }),
            prisma.sellerReview.count({
                where: {
                    vendorId
                }
            })
        ])

        return NextResponse.json({
            reviews: reviews.map((review: typeof reviews[number]) => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                user: {
                    name: review.user.name || 'Anonymous',
                    email: review.user.email
                }
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching seller reviews:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { vendorId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            )
        }

        const { vendorId } = params
        const body = await request.json()
        const { rating, comment } = body

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        // Check if vendor exists
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId }
        })

        if (!vendor) {
            return NextResponse.json(
                { error: 'Vendor not found' },
                { status: 404 }
            )
        }

        // Check if user has purchased from this vendor
        const hasPurchased = await prisma.order.findFirst({
            where: {
                userId: session.user.id,
                vendorId: vendorId,
                status: 'COMPLETED'
            }
        })

        if (!hasPurchased) {
            return NextResponse.json(
                { error: 'You must purchase from this seller before leaving a review' },
                { status: 403 }
            )
        }

        // Check if review already exists
        const existingReview = await prisma.sellerReview.findUnique({
            where: {
                userId_vendorId: {
                    userId: session.user.id,
                    vendorId: vendorId
                }
            }
        })

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this seller' },
                { status: 400 }
            )
        }

        // Create review
        const review = await prisma.sellerReview.create({
            data: {
                userId: session.user.id,
                vendorId: vendorId,
                rating,
                comment: comment || null
            }
        })

        // Update vendor rating statistics
        const allReviews = await prisma.sellerReview.findMany({
            where: { vendorId },
            select: { rating: true }
        })

        const averageRating = allReviews.reduce((sum: number, r: typeof allReviews[number]) => sum + r.rating, 0) / allReviews.length

        await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                averageRating,
                totalReviews: allReviews.length
            }
        })

        // Create notification for vendor
        await prisma.notification.create({
            data: {
                userId: vendor.userId,
                type: 'REVIEW_RECEIVED',
                title: 'New Review',
                message: `${session.user.name || 'Someone'} left you a ${rating}-star review`,
                data: {
                    reviewId: review.id,
                    rating,
                    reviewerName: session.user.name
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            review: {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt
            }
        })
    } catch (error) {
        console.error('Error creating seller review:', error)
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        )
    }
}
