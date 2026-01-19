import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function PUT(
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

        const { id } = params
        const body = await request.json()
        const { name, description, icon, color, isActive } = body

        const badge = await prisma.sellerBadge.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                icon: icon !== undefined ? icon : undefined,
                color: color !== undefined ? color : undefined,
                isActive: isActive !== undefined ? isActive : undefined
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Badge updated successfully',
            badge
        })
    } catch (error) {
        console.error('Error updating badge:', error)
        return NextResponse.json(
            { error: 'Failed to update badge' },
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

        const { id } = params

        await prisma.sellerBadge.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Badge deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting badge:', error)
        return NextResponse.json(
            { error: 'Failed to delete badge' },
            { status: 500 }
        )
    }
}
