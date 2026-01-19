'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"

// ============================================
// VENDOR ACTIONS (For Seller Dashboard)
// ============================================

/**
 * Get all conversations for a vendor (seller dashboard)
 */
export async function getConversations() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const conversations = await prisma.conversation.findMany({
            where: { vendorId: vendor.id },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        })

        // Count unread messages for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (c) => {
                const unreadCount = await prisma.message.count({
                    where: {
                        conversationId: c.id,
                        senderId: { not: session.user.id },
                        read: false
                    }
                })
                return {
                    ...c,
                    lastMessage: c.messages[0],
                    unreadCount
                }
            })
        )

        return conversationsWithUnread
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return []
    }
}

// ============================================
// CUSTOMER ACTIONS (For /messages page)
// ============================================

/**
 * Get all conversations for a customer
 */
export async function getCustomerConversations() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return []
        }

        const conversations = await prisma.conversation.findMany({
            where: { customerId: session.user.id },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
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
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        })

        // Count unread and format conversations
        const formattedConversations = await Promise.all(
            conversations.map(async (c) => {
                const unreadCount = await prisma.message.count({
                    where: {
                        conversationId: c.id,
                        senderId: { not: session.user.id },
                        read: false
                    }
                })
                return {
                    id: c.id,
                    vendor: c.vendor,
                    lastMessage: c.messages[0] ? {
                        id: c.messages[0].id,
                        content: c.messages[0].content,
                        createdAt: c.messages[0].createdAt,
                        senderId: c.messages[0].senderId,
                        read: c.messages[0].read
                    } : null,
                    unreadCount,
                    updatedAt: c.updatedAt,
                    createdAt: c.createdAt
                }
            })
        )

        return formattedConversations
    } catch (error) {
        console.error('Error fetching customer conversations:', error)
        return []
    }
}

/**
 * Create a new conversation with a vendor (when customer contacts seller)
 */
export async function createConversationWithVendor(vendorId: string, initialMessage?: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Check if vendor exists
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId },
            select: { id: true, userId: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        // Prevent messaging yourself
        if (vendor.userId === session.user.id) {
            return { success: false, error: 'Cannot message yourself' }
        }

        // Check if conversation already exists
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                customerId: session.user.id,
                vendorId: vendorId
            }
        })

        if (existingConversation) {
            // If initial message provided, send it
            if (initialMessage?.trim()) {
                await prisma.message.create({
                    data: {
                        conversationId: existingConversation.id,
                        senderId: session.user.id,
                        content: initialMessage.trim(),
                        read: false
                    }
                })
                await prisma.conversation.update({
                    where: { id: existingConversation.id },
                    data: { updatedAt: new Date() }
                })
            }

            revalidatePath('/messages')
            return { success: true, conversationId: existingConversation.id, isNew: false }
        }

        // Create new conversation
        const conversation = await prisma.conversation.create({
            data: {
                customerId: session.user.id,
                vendorId: vendorId,
                participants: {
                    create: [
                        { userId: session.user.id },
                        { userId: vendor.userId }
                    ]
                }
            }
        })

        // Send initial message if provided
        if (initialMessage?.trim()) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: session.user.id,
                    content: initialMessage.trim(),
                    read: false
                }
            })
        }

        revalidatePath('/messages')
        return { success: true, conversationId: conversation.id, isNew: true }
    } catch (error) {
        console.error('Error creating conversation:', error)
        return { success: false, error: 'Failed to create conversation' }
    }
}

// ============================================
// SHARED ACTIONS (For both vendors and customers)
// ============================================

/**
 * Get messages for a conversation (works for both vendor and customer)
 */
export async function getMessages(conversationId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify participation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                vendor: true,
                participants: true
            }
        })

        if (!conversation) return []

        // Check if user is the vendor or the customer
        const isVendor = conversation.vendor?.userId === session.user.id
        const isCustomer = conversation.customerId === session.user.id
        const isParticipant = conversation.participants.some(p => p.userId === session.user.id)

        if (!isVendor && !isCustomer && !isParticipant) {
            throw new Error('Unauthorized')
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
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

        return messages.map(m => ({
            ...m,
            isMine: m.senderId === session.user.id
        }))
    } catch (error) {
        console.error('Error fetching messages:', error)
        return []
    }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, content: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        if (!content.trim()) {
            throw new Error('Message content is required')
        }

        // Verify participation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                vendor: true,
                participants: true
            }
        })

        if (!conversation) {
            throw new Error('Conversation not found')
        }

        const isVendor = conversation.vendor?.userId === session.user.id
        const isCustomer = conversation.customerId === session.user.id
        const isParticipant = conversation.participants.some(p => p.userId === session.user.id)

        if (!isVendor && !isCustomer && !isParticipant) {
            throw new Error('Unauthorized')
        }

        // Find receiver
        let receiverId: string | undefined
        if (isCustomer && conversation.vendor) {
            receiverId = conversation.vendor.userId
        } else if (isVendor && conversation.customerId) {
            receiverId = conversation.customerId
        }

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: session.user.id,
                receiverId,
                content: content.trim(),
                read: false
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

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        })

        revalidatePath('/seller/messages')
        revalidatePath('/messages')

        return {
            success: true,
            message: {
                ...message,
                isMine: true
            }
        }
    } catch (error) {
        console.error('Error sending message:', error)
        return { success: false, error: 'Failed to send message' }
    }
}

/**
 * Mark messages as read in a conversation
 */
export async function markMessagesAsRead(conversationId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false }
        }

        // Mark all messages from other users as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: session.user.id },
                read: false
            },
            data: {
                read: true,
                readAt: new Date()
            }
        })

        revalidatePath('/seller/messages')
        revalidatePath('/messages')
        return { success: true }
    } catch (error) {
        console.error('Error marking messages as read:', error)
        return { success: false }
    }
}

/**
 * Get total unread message count for current user
 */
export async function getUnreadMessageCount() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return 0
        }

        // Check if user is a vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        // Get conversations where user is participant
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { customerId: session.user.id },
                    { vendorId: vendor?.id }
                ]
            },
            select: { id: true }
        })

        const conversationIds = conversations.map(c => c.id)

        // Count unread messages
        const unreadCount = await prisma.message.count({
            where: {
                conversationId: { in: conversationIds },
                senderId: { not: session.user.id },
                read: false
            }
        })

        return unreadCount
    } catch (error) {
        console.error('Error getting unread count:', error)
        return 0
    }
}

/**
 * Star/unstar a conversation (placeholder - needs schema update for starred field)
 */
export async function toggleStarConversation(conversationId: string) {
    // Note: This requires adding a 'starred' field to the Conversation model
    // For now, we'll return a mock response
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false }
        }

        // TODO: Implement when starred field is added to schema
        // For now, just verify conversation exists and user has access
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { vendor: true }
        })

        if (!conversation) {
            return { success: false, error: 'Conversation not found' }
        }

        const isVendor = conversation.vendor?.userId === session.user.id
        const isCustomer = conversation.customerId === session.user.id

        if (!isVendor && !isCustomer) {
            return { success: false, error: 'Unauthorized' }
        }

        // Placeholder: Would toggle starred status here
        return { success: true, starred: true }
    } catch (error) {
        console.error('Error toggling star:', error)
        return { success: false }
    }
}

/**
 * Delete/archive a conversation (soft delete)
 */
export async function archiveConversation(conversationId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false }
        }

        // Verify ownership/participation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { vendor: true }
        })

        if (!conversation) {
            return { success: false, error: 'Conversation not found' }
        }

        const isVendor = conversation.vendor?.userId === session.user.id
        const isCustomer = conversation.customerId === session.user.id

        if (!isVendor && !isCustomer) {
            return { success: false, error: 'Unauthorized' }
        }

        // Note: For true archive, would add an 'archived' or 'archivedBy' field
        // For now, we could remove the user from participants
        // But to keep it simple, we'll just return success (placeholder)

        revalidatePath('/seller/messages')
        revalidatePath('/messages')
        return { success: true }
    } catch (error) {
        console.error('Error archiving conversation:', error)
        return { success: false }
    }
}

/**
 * Search vendors for starting a new conversation
 * Searches by name, email, or ID
 */
export async function searchVendorsForChat(query: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return []
        }

        if (!query || query.trim().length < 2) {
            return []
        }

        const searchQuery = query.trim()

        // Get current user's vendor profile to exclude
        const currentUserVendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        const vendors = await prisma.vendor.findMany({
            where: {
                AND: [
                    // Exclude current user's vendor profile
                    currentUserVendor ? { id: { not: currentUserVendor.id } } : {},
                    // Search conditions
                    {
                        OR: [
                            { name: { contains: searchQuery, mode: 'insensitive' } },
                            { id: { equals: searchQuery } },
                            { id: { startsWith: searchQuery } },
                            { user: { email: { contains: searchQuery, mode: 'insensitive' } } },
                            { user: { name: { contains: searchQuery, mode: 'insensitive' } } }
                        ]
                    }
                ]
            },
            take: 10,
            select: {
                id: true,
                name: true,
                avatar: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        })

        return vendors.map(vendor => ({
            id: vendor.id,
            name: vendor.name,
            avatar: vendor.avatar,
            email: vendor.user.email,
            userId: vendor.user.id
        }))
    } catch (error) {
        console.error('Error searching vendors for chat:', error)
        return []
    }
}
