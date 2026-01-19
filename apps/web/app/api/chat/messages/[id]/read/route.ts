import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

// PUT /api/chat/messages/[id]/read - Mark message as read
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

        // Verify message exists and user is receiver
        const message = await prisma.message.findUnique({
            where: {
                id
            }
        })

        if (!message) {
            return NextResponse.json(
                { error: 'Message not found' },
                { status: 404 }
            )
        }

        if (message.receiverId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Mark as read
        await prisma.message.update({
            where: { id },
            data: {
                readAt: new Date()
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Message marked as read'
        })

    } catch (error) {
        console.error('Error marking message as read:', error)
        return NextResponse.json(
            { error: 'Failed to mark message as read' },
            { status: 500 }
        )
    }
}
