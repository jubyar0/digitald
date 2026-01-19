import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const badges = await prisma.sellerBadge.findMany({
            include: {
                _count: {
                    select: {
                        vendors: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            badges: badges.map((badge: typeof badges[number]) => ({
                id: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                color: badge.color,
                isActive: badge.isActive,
                vendorCount: badge._count.vendors,
                createdAt: badge.createdAt
            }))
        })
    } catch (error) {
        console.error('Error fetching badges:', error)
        return NextResponse.json(
            { error: 'Failed to fetch badges' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, description, icon, color } = body

        if (!name || !icon) {
            return NextResponse.json(
                { error: 'Name and icon are required' },
                { status: 400 }
            )
        }

        // Check if badge name already exists
        const existing = await prisma.sellerBadge.findUnique({
            where: { name }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Badge with this name already exists' },
                { status: 400 }
            )
        }

        const badge = await prisma.sellerBadge.create({
            data: {
                name,
                description: description || null,
                icon,
                color: color || '#3b82f6',
                isActive: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Badge created successfully',
            badge: {
                id: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                color: badge.color,
                isActive: badge.isActive
            }
        })
    } catch (error) {
        console.error('Error creating badge:', error)
        return NextResponse.json(
            { error: 'Failed to create badge' },
            { status: 500 }
        )
    }
}

