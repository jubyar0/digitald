import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/follow/following - Get user's following list
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const following = await prisma.follow.findMany({
            where: {
                followerId: session.user.id
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(following.map((f: any) => ({
            id: f.following.id,
            name: f.following.name,
            avatar: f.following.avatar,
            bio: f.following.bio,
            followedAt: f.createdAt
        })))
    } catch (error) {
        console.error('Error fetching following list:', error)
        return NextResponse.json(
            { error: 'Failed to fetch following list' },
            { status: 500 }
        )
    }
}
