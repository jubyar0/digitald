'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ChatSessionStatus, ChatSenderType, ChatMessageType } from '@repo/database'
import crypto from 'crypto'

// ============================================================================
// Visitor Tracking
// ============================================================================

export async function trackVisitor(data: {
    fingerprint: string
    name?: string
    email?: string
    userAgent?: string
    ipAddress?: string
    country?: string
    city?: string
    currentPage?: string
}) {
    try {
        const visitor = await prisma.liveChatVisitor.upsert({
            where: { fingerprint: data.fingerprint },
            update: {
                name: data.name || undefined,
                email: data.email || undefined,
                userAgent: data.userAgent,
                ipAddress: data.ipAddress,
                country: data.country,
                city: data.city,
                currentPage: data.currentPage,
                isOnline: true,
                pageViews: { increment: 1 },
            },
            create: {
                fingerprint: data.fingerprint,
                name: data.name,
                email: data.email,
                userAgent: data.userAgent,
                ipAddress: data.ipAddress,
                country: data.country,
                city: data.city,
                currentPage: data.currentPage,
            },
        })

        // Track page visit
        if (data.currentPage) {
            await prisma.pageVisitHistory.create({
                data: {
                    visitorId: visitor.id,
                    pageUrl: data.currentPage,
                },
            })
        }

        return { success: true, data: visitor }
    } catch (error) {
        console.error('Error tracking visitor:', error)
        return { success: false, error: 'Failed to track visitor' }
    }
}

export async function setVisitorOffline(fingerprint: string) {
    try {
        await prisma.liveChatVisitor.update({
            where: { fingerprint },
            data: { isOnline: false },
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to update visitor status' }
    }
}

export async function getLiveVisitors(page = 1, pageSize = 20) {
    try {
        const skip = (page - 1) * pageSize

        const [visitors, total] = await Promise.all([
            prisma.liveChatVisitor.findMany({
                where: { isOnline: true },
                take: pageSize,
                skip,
                orderBy: { lastVisit: 'desc' },
                include: {
                    sessions: {
                        where: { status: { in: ['WAITING', 'ACTIVE'] } },
                        take: 1,
                        orderBy: { startedAt: 'desc' },
                    },
                    pageHistory: {
                        take: 5,
                        orderBy: { visitedAt: 'desc' },
                    },
                },
            }),
            prisma.liveChatVisitor.count({ where: { isOnline: true } }),
        ])

        return { success: true, data: visitors, total }
    } catch (error) {
        console.error('Error fetching live visitors:', error)
        return { success: false, error: 'Failed to fetch visitors' }
    }
}

// ============================================================================
// Chat Sessions
// ============================================================================

export async function startChatSession(data: {
    fingerprint: string
    visitorName?: string
    visitorEmail?: string
    visitorAvatar?: string
    department?: string
    initialMessage?: string
}) {
    try {
        // Get or create visitor
        let visitor = await prisma.liveChatVisitor.findUnique({
            where: { fingerprint: data.fingerprint },
        })

        const metadata = data.visitorAvatar ? { avatar: data.visitorAvatar } : undefined

        if (!visitor) {
            visitor = await prisma.liveChatVisitor.create({
                data: {
                    fingerprint: data.fingerprint,
                    name: data.visitorName,
                    email: data.visitorEmail,
                    metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
                },
            })
        } else {
            // Update visitor info if provided
            await prisma.liveChatVisitor.update({
                where: { id: visitor.id },
                data: {
                    name: data.visitorName || undefined,
                    email: data.visitorEmail || undefined,
                    metadata: metadata ? { ...((visitor.metadata as object) || {}), ...metadata } : undefined,
                },
            })
        }

        // Generate unique session ID
        const sessionId = `chat_${crypto.randomBytes(8).toString('hex')}`

        // Create session
        const session = await prisma.liveChatSession.create({
            data: {
                sessionId,
                visitorId: visitor.id,
                visitorName: data.visitorName || visitor.name,
                visitorEmail: data.visitorEmail || visitor.email,
                department: data.department,
                status: 'WAITING',
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
            },
            include: {
                visitor: true,
            },
        })

        // Update visitor chat count
        await prisma.liveChatVisitor.update({
            where: { id: visitor.id },
            data: { totalChats: { increment: 1 } },
        })

        // Add initial message if provided
        if (data.initialMessage) {
            await prisma.liveChatMessage.create({
                data: {
                    sessionId: session.id,
                    senderType: 'VISITOR',
                    content: data.initialMessage,
                    messageType: 'TEXT',
                },
            })
        }

        revalidatePath('/admin/support/livechat')
        return { success: true, data: session }
    } catch (error) {
        console.error('Error starting chat session:', error)
        return { success: false, error: 'Failed to start chat session' }
    }
}

export async function getChatSessions(
    page = 1,
    pageSize = 20,
    filters?: {
        status?: ChatSessionStatus
        assignedTo?: string
        search?: string
    }
) {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (filters?.status) {
            where.status = filters.status
        }

        if (filters?.assignedTo) {
            where.assignedTo = filters.assignedTo
        }

        if (filters?.search) {
            where.OR = [
                { visitorName: { contains: filters.search, mode: 'insensitive' } },
                { visitorEmail: { contains: filters.search, mode: 'insensitive' } },
            ]
        }

        const [sessions, total] = await Promise.all([
            prisma.liveChatSession.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { startedAt: 'desc' },
                include: {
                    visitor: true,
                    assignee: {
                        select: { id: true, name: true, email: true, image: true },
                    },
                    messages: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                    },
                    _count: {
                        select: { messages: true },
                    },
                },
            }),
            prisma.liveChatSession.count({ where }),
        ])

        return { success: true, data: sessions, total }
    } catch (error) {
        console.error('Error fetching chat sessions:', error)
        return { success: false, error: 'Failed to fetch sessions' }
    }
}

export async function getVisitorSessions(fingerprint: string) {
    try {
        const visitor = await prisma.liveChatVisitor.findUnique({
            where: { fingerprint },
        })

        if (!visitor) {
            return { success: true, data: [] }
        }

        const sessions = await prisma.liveChatSession.findMany({
            where: { visitorId: visitor.id },
            orderBy: { startedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        return { success: true, data: sessions }
    } catch (error) {
        console.error('Error fetching visitor sessions:', error)
        return { success: false, error: 'Failed to fetch visitor sessions' }
    }
}

export async function getChatSession(sessionId: string) {
    try {
        const session = await prisma.liveChatSession.findUnique({
            where: { sessionId },
            include: {
                visitor: {
                    include: {
                        pageHistory: {
                            take: 10,
                            orderBy: { visitedAt: 'desc' },
                        },
                    },
                },
                assignee: {
                    select: { id: true, name: true, email: true, image: true },
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        })

        if (!session) {
            return { success: false, error: 'Session not found' }
        }

        return { success: true, data: session }
    } catch (error) {
        console.error('Error fetching chat session:', error)
        return { success: false, error: 'Failed to fetch session' }
    }
}

export async function assignChatToAgent(sessionId: string, agentId: string) {
    try {
        // Check if agent has permission
        const agent = await prisma.user.findUnique({
            where: { id: agentId },
            select: { canHandleLiveChat: true, name: true }
        })

        if (!agent || !agent.canHandleLiveChat) {
            return { success: false, error: 'Agent does not have permission to handle live chats' }
        }

        const session = await prisma.liveChatSession.update({
            where: { sessionId },
            data: {
                assignedTo: agentId,
                status: 'ACTIVE',
            },
            include: {
                assignee: {
                    select: { id: true, name: true, email: true },
                },
            },
        })

        // Add system message about assignment
        await prisma.liveChatMessage.create({
            data: {
                sessionId: session.id,
                senderType: 'SYSTEM',
                messageType: 'SYSTEM',
                content: `Chat assigned to ${session.assignee?.name || 'an agent'}`,
            },
        })

        revalidatePath('/admin/support/livechat')
        return { success: true, data: session }
    } catch (error) {
        console.error('Error assigning chat:', error)
        return { success: false, error: 'Failed to assign chat' }
    }
}

export async function endChatSession(sessionId: string, rating?: number, feedback?: string) {
    try {
        const session = await prisma.liveChatSession.update({
            where: { sessionId },
            data: {
                status: 'CLOSED',
                endedAt: new Date(),
                rating,
                feedback,
            },
        })

        revalidatePath('/admin/support/livechat')
        return { success: true, data: session }
    } catch (error) {
        console.error('Error ending chat session:', error)
        return { success: false, error: 'Failed to end chat session' }
    }
}

// ============================================================================
// Chat Messages
// ============================================================================

import { generateAIResponse } from './ai-chat'
import { getLivechatSettings } from './chatbot-settings'

export async function sendChatMessage(data: {
    sessionId: string
    senderId?: string
    senderType: ChatSenderType
    content: string
    messageType?: ChatMessageType
    attachments?: any[]
    context?: { userId?: string; productId?: string; currentUrl?: string }
}) {
    try {
        // Get session by sessionId
        const session = await prisma.liveChatSession.findUnique({
            where: { sessionId: data.sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 10, // Get last 10 messages for history
                },
            },
        })

        if (!session) {
            return { success: false, error: 'Session not found' }
        }

        const message = await prisma.liveChatMessage.create({
            data: {
                sessionId: session.id,
                senderId: data.senderId,
                senderType: data.senderType,
                content: data.content,
                messageType: data.messageType || 'TEXT',
                attachments: data.attachments,
            },
        })

        // Update session last activity
        await prisma.liveChatSession.update({
            where: { id: session.id },
            data: { updatedAt: new Date() },
        })

        // AI Integration (Synchronous to ensure execution)
        if (data.senderType === 'VISITOR' && session.status !== 'CLOSED') {
            try {
                const settingsRes = await getLivechatSettings()
                const settings = settingsRes.success ? settingsRes.data : null

                if (settings?.aiEnabled) {
                    // Prepare history
                    const history = session.messages.map((m) => ({
                        role: m.senderType === 'VISITOR' ? 'user' : 'assistant',
                        content: m.content,
                    })) as { role: 'user' | 'assistant'; content: string }[]

                    // Generate AI Response
                    const aiResponse = await generateAIResponse(history, data.content, data.context)

                    if (aiResponse.success && aiResponse.text) {
                        // Save AI Message
                        await prisma.liveChatMessage.create({
                            data: {
                                sessionId: session.id,
                                senderType: 'BOT',
                                content: aiResponse.text,
                                messageType: 'TEXT',
                                isAI: true,
                            },
                        })

                        // Handle Escalation
                        if (aiResponse.escalated) {
                            await prisma.liveChatSession.update({
                                where: { id: session.id },
                                data: {
                                    status: 'WAITING', // Move to waiting for human
                                    isAIHandled: false,
                                    escalationReason: aiResponse.reason
                                },
                            })
                        } else {
                            // Mark as AI handled if not already
                            if (!session.isAIHandled) {
                                await prisma.liveChatSession.update({
                                    where: { id: session.id },
                                    data: { isAIHandled: true },
                                })
                            }
                        }
                    } else {
                        // Fallback if AI fails
                        await prisma.liveChatMessage.create({
                            data: {
                                sessionId: session.id,
                                senderType: 'BOT',
                                content: "I apologize, but I'm having trouble processing your request right now. Please try again or type 'live support' to speak with a human.",
                                messageType: 'TEXT',
                                isAI: true,
                            },
                        })
                    }
                }
            } catch (error) {
                console.error('AI Generation Error:', error)
            }
        }

        revalidatePath('/admin/support/livechat')
        return { success: true, data: message }
    } catch (error) {
        console.error('Error sending message:', error)
        return { success: false, error: 'Failed to send message' }
    }
}

export async function getChatMessages(sessionId: string) {
    try {
        const session = await prisma.liveChatSession.findUnique({
            where: { sessionId },
        })

        if (!session) {
            return { success: false, error: 'Session not found' }
        }

        const messages = await prisma.liveChatMessage.findMany({
            where: { sessionId: session.id },
            orderBy: { createdAt: 'asc' },
        })

        return { success: true, data: messages }
    } catch (error) {
        console.error('Error fetching messages:', error)
        return { success: false, error: 'Failed to fetch messages' }
    }
}

export async function markMessagesAsRead(sessionId: string) {
    try {
        const session = await prisma.liveChatSession.findUnique({
            where: { sessionId },
        })

        if (!session) {
            return { success: false, error: 'Session not found' }
        }

        await prisma.liveChatMessage.updateMany({
            where: {
                sessionId: session.id,
                isRead: false,
                senderType: 'VISITOR',
            },
            data: { isRead: true },
        })

        return { success: true }
    } catch (error) {
        console.error('Error marking messages as read:', error)
        return { success: false, error: 'Failed to mark messages as read' }
    }
}

// ============================================================================
// Stats
// ============================================================================

export async function getLivechatStats() {
    try {
        const [totalSessions, waiting, active, onlineVisitors, todaySessions, aiHandled] = await Promise.all([
            prisma.liveChatSession.count(),
            prisma.liveChatSession.count({ where: { status: 'WAITING' } }),
            prisma.liveChatSession.count({ where: { status: 'ACTIVE' } }),
            prisma.liveChatVisitor.count({ where: { isOnline: true } }),
            prisma.liveChatSession.count({
                where: {
                    startedAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.liveChatSession.count({ where: { isAIHandled: true } }),
        ])

        const avgRating = await prisma.liveChatSession.aggregate({
            _avg: { rating: true },
            where: { rating: { not: null } },
        })

        return {
            success: true,
            data: {
                totalSessions,
                waiting,
                active,
                onlineVisitors,
                todaySessions,
                aiHandled,
                avgRating: avgRating._avg.rating || 0,
            },
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
        return { success: false, error: 'Failed to fetch stats' }
    }
}
