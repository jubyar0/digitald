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
        const { name, description, logoUrl, category, isActive } = body

        const tool = await prisma.softwareTool.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                logoUrl: logoUrl !== undefined ? logoUrl : undefined,
                category: category !== undefined ? category : undefined,
                isActive: isActive !== undefined ? isActive : undefined
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Software tool updated successfully',
            tool
        })
    } catch (error) {
        console.error('Error updating software tool:', error)
        return NextResponse.json(
            { error: 'Failed to update software tool' },
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

        await prisma.softwareTool.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Software tool deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting software tool:', error)
        return NextResponse.json(
            { error: 'Failed to delete software tool' },
            { status: 500 }
        )
    }
}
