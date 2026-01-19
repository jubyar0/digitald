import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/follow/followers/[sellerId] - Get followers list
export async function GET(
    request: NextRequest,
    { params }: { params: { sellerId: string } }
) {
    try {
        const { sellerId } = params

        const followers = await prisma.follow.findMany({
            where: {
                followingId: sellerId
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        image: true, // Assuming User model has image, otherwise remove or adjust
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(followers.map((f: any) => ({
            id: f.follower.id,
            name: f.follower.name,
            image: f.follower.image,
            email: f.follower.email, // Maybe hide email for public? But this is likely for seller dashboard.
            followedAt: f.createdAt
        })))
    } catch (error) {
        console.error('Error fetching followers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch followers' },
            { status: 500 }
        )
    }
}
