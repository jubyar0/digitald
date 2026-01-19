import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

// PUT /api/reviews/[id] - Update review
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = params
        const body = await request.json()
        const { rating, comment } = body

        // Verify review ownership
        const review = await prisma.sellerReview.findUnique({
            where: {
                id
            }
        })

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            )
        }

        if (review.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Update review
        const updatedReview = await prisma.sellerReview.update({
            where: {
                id
            },
            data: {
                rating: rating !== undefined ? rating : review.rating,
                comment: comment !== undefined ? comment : review.comment
            }
        })

        // Recalculate vendor rating
        const vendorReviews = await prisma.sellerReview.findMany({
            where: {
                vendorId: review.vendorId
            }
        })

        const totalRating = vendorReviews.reduce((sum: number, r: any) => sum + r.rating, 0)
        const averageRating = totalRating / vendorReviews.length

        await prisma.vendor.update({
            where: {
                id: review.vendorId
            },
            data: {
                averageRating,
                totalReviews: vendorReviews.length
            }
        })

        return NextResponse.json(updatedReview)
    } catch (error) {
        console.error('Error updating review:', error)
        return NextResponse.json(
            { error: 'Failed to update review' },
            { status: 500 }
        )
    }
}

// DELETE /api/reviews/[id] - Delete review
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = params

        // Verify review ownership or admin
        const review = await prisma.sellerReview.findUnique({
            where: {
                id
            }
        })

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            )
        }

        if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Delete review
        await prisma.sellerReview.delete({
            where: {
                id
            }
        })

        // Recalculate vendor rating
        const vendorReviews = await prisma.sellerReview.findMany({
            where: {
                vendorId: review.vendorId
            }
        })

        const totalRating = vendorReviews.reduce((sum: number, r: any) => sum + r.rating, 0)
        const averageRating = vendorReviews.length > 0 ? totalRating / vendorReviews.length : 0

        await prisma.vendor.update({
            where: {
                id: review.vendorId
            },
            data: {
                averageRating,
                totalReviews: vendorReviews.length
            }
        })

        return NextResponse.json({ success: true, message: 'Review deleted' })
    } catch (error) {
        console.error('Error deleting review:', error)
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        )
    }
}
