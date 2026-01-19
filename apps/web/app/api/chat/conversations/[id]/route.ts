import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

// GET /api/chat/conversations/[id] - Get conversation messages
export async function GET(
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

        // Verify user is participant
        const conversation = await prisma.conversation.findUnique({
            where: {
                id
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
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

        // Get messages
        const messages = await prisma.message.findMany({
            where: {
                conversationId: id
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        const otherParticipant = conversation.participants.find((p: any) => p.userId !== session.user.id)?.user

        return NextResponse.json({
            conversation: {
                id: conversation.id,
                otherParticipant: otherParticipant ? {
                    id: otherParticipant.id,
                    name: otherParticipant.name,
                    email: otherParticipant.email,
                    image: otherParticipant.image
                } : null
            },
            messages: messages.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                createdAt: msg.createdAt,
                senderId: msg.senderId,
                messageType: msg.messageType,
                metadata: msg.metadata,
                readAt: msg.readAt,
                sender: {
                    name: msg.sender.name,
                    image: msg.sender.image
                },
                isMine: msg.senderId === session.user.id
            }))
        })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        )
    }
}
