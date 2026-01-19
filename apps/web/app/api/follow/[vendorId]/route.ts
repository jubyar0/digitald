import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

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

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: vendorId
                }
            }
        })

        if (existingFollow) {
            return NextResponse.json(
                { error: 'Already following this vendor' },
                { status: 400 }
            )
        }

        // Create follow
        await prisma.follow.create({
            data: {
                followerId: session.user.id,
                followingId: vendorId
            }
        })

        // Update vendor follower count
        await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                totalFollowers: {
                    increment: 1
                }
            }
        })

        // Create notification for vendor
        await prisma.notification.create({
            data: {
                userId: vendor.userId,
                type: 'NEW_SALE', // We'll add NEW_FOLLOWER type later
                title: 'New Follower',
                message: `${session.user.name || 'Someone'} started following you`,
                data: {
                    followerId: session.user.id,
                    followerName: session.user.name
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Successfully followed vendor'
        })
    } catch (error) {
        console.error('Error following vendor:', error)
        return NextResponse.json(
            { error: 'Failed to follow vendor' },
            { status: 500 }
        )
    }
}

export async function DELETE(
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

        // Delete follow
        const deleted = await prisma.follow.deleteMany({
            where: {
                followerId: session.user.id,
                followingId: vendorId
            }
        })

        if (deleted.count === 0) {
            return NextResponse.json(
                { error: 'Not following this vendor' },
                { status: 400 }
            )
        }

        // Update vendor follower count
        await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                totalFollowers: {
                    decrement: 1
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Successfully unfollowed vendor'
        })
    } catch (error) {
        console.error('Error unfollowing vendor:', error)
        return NextResponse.json(
            { error: 'Failed to unfollow vendor' },
            { status: 500 }
        )
    }
}
