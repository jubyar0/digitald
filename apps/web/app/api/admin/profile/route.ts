import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - Fetch admin profile
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        // Find admin account
        const adminAccount = await prisma.adminAccount.findUnique({
            where: {
                userId: session.user.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                        createdAt: true
                    }
                }
            }
        })

        if (!adminAccount) {
            return NextResponse.json(
                { error: 'Admin account not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(adminAccount)
    } catch (error) {
        console.error('Error fetching admin profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, email } = body

        // Update user information
        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name: name !== undefined ? name : undefined,
                email: email !== undefined ? email : undefined
            }
        })

        // Update lastLogin on admin account
        await prisma.adminAccount.update({
            where: {
                userId: session.user.id
            },
            data: {
                lastLogin: new Date()
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        })
    } catch (error) {
        console.error('Error updating admin profile:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
