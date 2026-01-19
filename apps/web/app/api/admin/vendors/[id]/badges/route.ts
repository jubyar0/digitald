import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const vendorId = params.id
        const body = await request.json()
        const { badgeId } = body

        if (!badgeId) {
            return NextResponse.json(
                { error: 'Badge ID is required' },
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

        // Check if badge exists
        const badge = await prisma.sellerBadge.findUnique({
            where: { id: badgeId }
        })

        if (!badge) {
            return NextResponse.json(
                { error: 'Badge not found' },
                { status: 404 }
            )
        }

        // Check if badge already assigned
        const existing = await prisma.vendorBadge.findUnique({
            where: {
                vendorId_badgeId: {
                    vendorId,
                    badgeId
                }
            }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Badge already assigned to this vendor' },
                { status: 400 }
            )
        }

        // Assign badge
        const vendorBadge = await prisma.vendorBadge.create({
            data: {
                vendorId,
                badgeId,
                assignedBy: session.user.id
            },
            include: {
                badge: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Badge assigned successfully',
            vendorBadge: {
                id: vendorBadge.id,
                badge: vendorBadge.badge,
                assignedAt: vendorBadge.assignedAt
            }
        })
    } catch (error) {
        console.error('Error assigning badge:', error)
        return NextResponse.json(
            { error: 'Failed to assign badge' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const vendorId = params.id
        const { searchParams } = new URL(request.url)
        const badgeId = searchParams.get('badgeId')

        if (!badgeId) {
            return NextResponse.json(
                { error: 'Badge ID is required' },
                { status: 400 }
            )
        }

        await prisma.vendorBadge.delete({
            where: {
                vendorId_badgeId: {
                    vendorId,
                    badgeId
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Badge removed successfully'
        })
    } catch (error) {
        console.error('Error removing badge:', error)
        return NextResponse.json(
            { error: 'Failed to remove badge' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const vendorId = params.id

        const vendorBadges = await prisma.vendorBadge.findMany({
            where: { vendorId },
            include: {
                badge: true
            }
        })

        return NextResponse.json({
            badges: vendorBadges.map((vb: typeof vendorBadges[number]) => ({
                id: vb.id,
                badge: vb.badge,
                assignedAt: vb.assignedAt
            }))
        })
    } catch (error) {
        console.error('Error fetching vendor badges:', error)
        return NextResponse.json(
            { error: 'Failed to fetch vendor badges' },
            { status: 500 }
        )
    }
}
