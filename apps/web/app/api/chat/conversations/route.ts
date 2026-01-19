import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

// GET /api/chat/conversations - Get user's conversations
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: session.user.id
                    }
                }
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
                },
                vendor: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
                dispute: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        // Format conversations for frontend
        const formattedConversations = conversations.map((conv: any) => {
            const otherParticipant = conv.participants.find((p: any) => p.userId !== session.user.id)?.user
            const lastMessage = conv.messages[0]

            return {
                id: conv.id,
                participants: conv.participants.map((p: any) => ({
                    id: p.user.id,
                    name: p.user.name,
                    image: p.user.image
                })),
                vendorId: conv.vendorId,
                vendor: conv.vendor,
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId
                } : null,
                updatedAt: conv.updatedAt,
                unreadCount: 0, // TODO: Calculate unread count
                hasDispute: !!conv.dispute
            }
        })

        return NextResponse.json(formattedConversations)
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        )
    }
}

// POST /api/chat/conversations - Create conversation with seller
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { sellerId } = body

        if (!sellerId) {
            return NextResponse.json(
                { error: 'Seller ID is required' },
                { status: 400 }
            )
        }

        // Check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: {
                                userId: session.user.id
                            }
                        }
                    },
                    {
                        participants: {
                            some: {
                                userId: sellerId
                            }
                        }
                    }
                ]
            }
        })

        if (existingConversation) {
            return NextResponse.json({
                id: existingConversation.id,
                isNew: false
            })
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: session.user.id },
                        { userId: sellerId }
                    ]
                }
            }
        })

        return NextResponse.json({
            id: conversation.id,
            isNew: true
        })
    } catch (error) {
        console.error('Error creating conversation:', error)
        return NextResponse.json(
            { error: 'Failed to create conversation' },
            { status: 500 }
        )
    }
}
