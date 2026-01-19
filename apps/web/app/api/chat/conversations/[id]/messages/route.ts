import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

// POST /api/chat/conversations/[id]/messages - Send message
export async function POST(
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
        const body = await request.json()
        const { content } = body

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Message content is required' },
                { status: 400 }
            )
        }

        // Verify user is participant
        const conversation = await prisma.conversation.findUnique({
            where: {
                id
            },
            include: {
                participants: true
            }
        })

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            )
        }

        const isParticipant = conversation.participants.some(
            (p: any) => p.userId === session.user.id
        )

        if (!isParticipant) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Identify receiver
        const receiver = conversation.participants.find((p: any) => p.userId !== session.user.id)

        if (!receiver) {
            return NextResponse.json(
                { error: 'Receiver not found' },
                { status: 404 }
            )
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId: id,
                senderId: session.user.id,
                receiverId: receiver.userId,
                content: content.trim(),
                messageType: body.messageType || 'USER',
                metadata: body.metadata || null
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        })

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id },
            data: { updatedAt: new Date() }
        })

        return NextResponse.json({
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            senderId: message.senderId,
            senderName: message.sender.name,
            senderImage: message.sender.image,
            isMine: true
        })
    } catch (error) {
        console.error('Error sending message:', error)
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        )
    }
}
