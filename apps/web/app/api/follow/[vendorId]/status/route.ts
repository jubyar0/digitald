import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { vendorId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { isFollowing: false },
                { status: 200 }
            )
        }

        const { vendorId } = params

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: vendorId
                }
            }
        })

        return NextResponse.json({
            isFollowing: !!follow
        })
    } catch (error) {
        console.error('Error checking follow status:', error)
        return NextResponse.json(
            { error: 'Failed to check follow status' },
            { status: 500 }
        )
    }
}
