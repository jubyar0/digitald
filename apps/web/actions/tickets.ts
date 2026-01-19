'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { TicketStatus, TicketPriority } from '@repo/database'
import {
    notifyAdminsNewTicket,
    notifyUserTicketUpdate,
    notifyUserNewReply,
    notifyAdminAssignment,
} from '@/lib/ticket-notifications'

// ============================================================================
// Helper Functions
// ============================================================================

async function getTicketWithRelations(ticketId: string) {
    return await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            assignee: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            users_support_tickets_resolvedByTousers: {
                select: {
                    id: true,
                    name: true,
                },
            },
            ticket_messages: {
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    })
}

// ============================================================================
// For All Users
// ============================================================================

export async function getTicket(ticketId: string, userId: string, userRole: string) {
    try {
        const ticket = await getTicketWithRelations(ticketId)

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        // Permission check: users can only see their own tickets unless admin
        if (userRole !== 'ADMIN' && ticket.userId !== userId) {
            throw new Error('Unauthorized to view this ticket')
        }

        return {
            success: true,
            data: {
                ...ticket,
                messages: ticket.ticket_messages.map((msg: any) => ({
                    ...msg,
                    user: msg.user
                }))
            }
        }
    } catch (error) {
        console.error('Error fetching ticket:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch ticket' }
    }
}

export async function getTicketMessages(ticketId: string, userId: string, userRole: string) {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { userId: true },
        })

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        // Permission check
        if (userRole !== 'ADMIN' && ticket.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const messages = await prisma.ticketMessage.findMany({
            where: {
                ticketId,
                // Hide internal notes from non-admins
                ...(userRole !== 'ADMIN' && { isInternal: false }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        return {
            success: true,
            data: messages.map((msg: any) => ({
                ...msg,
                user: msg.user
            }))
        }
    } catch (error) {
        console.error('Error fetching messages:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch messages' }
    }
}

export async function addTicketMessage(
    ticketId: string,
    userId: string,
    content: string,
    attachments?: any[],
    isInternal = false
) {
    try {
        // Verify ticket exists and user has permission
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { userId: true, status: true },
        })

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        // Check if ticket is closed
        if (ticket.status === 'CLOSED') {
            throw new Error('Cannot add messages to closed tickets')
        }

        const message = await prisma.ticketMessage.create({
            data: {
                id: crypto.randomUUID(),
                ticketId,
                userId,
                content,
                attachments: attachments || [],
                isInternal,
                updatedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        image: true,
                    },
                },
            },
        })

        // Update ticket's updatedAt
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() },
        })

        // Notify ticket owner about new reply (if not their own message)
        if (ticket.userId !== userId) {
            await notifyUserNewReply(
                ticket.userId,
                ticketId,
                message.user.name || message.user.email,
                isInternal
            )
        }

        revalidatePath(`/admin/support/${ticketId}`)
        revalidatePath(`/seller/support/${ticketId}`)
        revalidatePath(`/support/tickets/${ticketId}`)

        return {
            success: true,
            data: {
                ...message,
                user: message.user
            }
        }
    } catch (error) {
        console.error('Error adding message:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to add message' }
    }
}

// ============================================================================
// For Customers/Sellers
// ============================================================================

export async function createTicket(
    userId: string,
    subject: string,
    description: string,
    category: string,
    priority: TicketPriority = 'MEDIUM',
    attachments?: any[]
) {
    try {
        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                subject,
                description,
                category,
                priority,
                attachments: attachments || [],
                status: 'OPEN',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        // Notify admins about new ticket
        await notifyAdminsNewTicket(ticket.id)

        revalidatePath('/admin/support')
        revalidatePath('/seller/support')
        revalidatePath('/support/tickets')

        return { success: true, data: ticket }
    } catch (error) {
        console.error('Error creating ticket:', error)
        return { success: false, error: 'Failed to create ticket' }
    }
}

export async function getMyTickets(
    userId: string,
    page = 1,
    pageSize = 10,
    status?: TicketStatus
) {
    try {
        const skip = (page - 1) * pageSize
        const where: any = { userId }

        if (status) {
            where.status = status
        }

        const [tickets, total] = await Promise.all([
            prisma.supportTicket.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    assignee: {
                        select: {
                            name: true,
                        },
                    },

                },
            }),
            prisma.supportTicket.count({ where }),
        ])

        return {
            success: true,
            data: tickets,
            total,
            page,
            pageSize,
        }
    } catch (error) {
        console.error('Error fetching tickets:', error)
        return { success: false, error: 'Failed to fetch tickets' }
    }
}

export async function closeTicket(ticketId: string, userId: string, userRole: string) {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { userId: true, status: true },
        })

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        // Only ticket owner or admin can close
        if (ticket.userId !== userId && userRole !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        if (ticket.status === 'CLOSED') {
            throw new Error('Ticket is already closed')
        }

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: 'CLOSED',
                closedAt: new Date(),
            },
        })

        revalidatePath('/admin/support')
        revalidatePath('/seller/support')
        revalidatePath('/support/tickets')

        return { success: true }
    } catch (error) {
        console.error('Error closing ticket:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to close ticket' }
    }
}

// ============================================================================
// For Admins Only
// ============================================================================

export async function getAllTickets(
    page = 1,
    pageSize = 10,
    filters?: {
        status?: TicketStatus
        priority?: TicketPriority
        category?: string
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

        if (filters?.priority) {
            where.priority = filters.priority
        }

        if (filters?.category) {
            where.category = filters.category
        }

        if (filters?.assignedTo) {
            where.assignedTo = filters.assignedTo
        }

        if (filters?.search) {
            where.OR = [
                { subject: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { user: { email: { contains: filters.search, mode: 'insensitive' } } },
                { user: { name: { contains: filters.search, mode: 'insensitive' } } },
            ]
        }

        const [tickets, total] = await Promise.all([
            prisma.supportTicket.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: [
                    { priority: 'desc' },
                    { createdAt: 'desc' },
                ],
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },

                },
            }),
            prisma.supportTicket.count({ where }),
        ])

        return {
            success: true,
            data: tickets,
            total,
            page,
            pageSize,
        }
    } catch (error) {
        console.error('Error fetching all tickets:', error)
        return { success: false, error: 'Failed to fetch tickets' }
    }
}

export async function assignTicket(ticketId: string, adminId: string) {
    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                assignedTo: adminId,
                status: 'IN_PROGRESS',
            },
        })

        // Notify admin about assignment
        await notifyAdminAssignment(adminId, ticketId)

        revalidatePath('/admin/support')
        revalidatePath(`/admin/support/${ticketId}`)

        return { success: true }
    } catch (error) {
        console.error('Error assigning ticket:', error)
        return { success: false, error: 'Failed to assign ticket' }
    }
}

export async function updateTicketStatus(
    ticketId: string,
    status: TicketStatus,
    resolvedBy?: string
) {
    try {
        // Get current status before update
        const currentTicket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { status: true, userId: true },
        })

        const data: any = { status }

        if (status === 'RESOLVED' && resolvedBy) {
            data.resolvedBy = resolvedBy
            data.resolvedAt = new Date()
        }

        if (status === 'CLOSED') {
            data.closedAt = new Date()
        }

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data,
        })

        // Notify user about status change
        if (currentTicket && currentTicket.status !== status) {
            await notifyUserTicketUpdate(
                currentTicket.userId,
                ticketId,
                currentTicket.status,
                status
            )
        }

        revalidatePath('/admin/support')
        revalidatePath(`/admin/support/${ticketId}`)

        return { success: true }
    } catch (error) {
        console.error('Error updating ticket status:', error)
        return { success: false, error: 'Failed to update status' }
    }
}

export async function updateTicketPriority(ticketId: string, priority: TicketPriority) {
    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { priority },
        })

        revalidatePath('/admin/support')
        revalidatePath(`/admin/support/${ticketId}`)

        return { success: true }
    } catch (error) {
        console.error('Error updating ticket priority:', error)
        return { success: false, error: 'Failed to update priority' }
    }
}

export async function addInternalNote(ticketId: string, adminId: string, note: string) {
    try {
        await prisma.ticketMessage.create({
            data: {
                id: crypto.randomUUID(),
                ticketId,
                userId: adminId,
                content: note,
                isInternal: true,
                updatedAt: new Date(),
            },
        })

        revalidatePath(`/admin/support/${ticketId}`)

        return { success: true }
    } catch (error) {
        console.error('Error adding internal note:', error)
        return { success: false, error: 'Failed to add internal note' }
    }
}

export async function getTicketStats() {
    try {
        const [total, open, inProgress, resolved, closed, urgent] = await Promise.all([
            prisma.supportTicket.count(),
            prisma.supportTicket.count({ where: { status: 'OPEN' } }),
            prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
            prisma.supportTicket.count({ where: { status: 'CLOSED' } }),
            prisma.supportTicket.count({
                where: {
                    priority: 'URGENT',
                    status: { notIn: ['RESOLVED', 'CLOSED'] },
                },
            }),
        ])

        return {
            success: true,
            data: {
                total,
                open,
                inProgress,
                resolved,
                closed,
                urgent,
            },
        }
    } catch (error) {
        console.error('Error fetching ticket stats:', error)
        return { success: false, error: 'Failed to fetch stats' }
    }
}

export async function getAdmins() {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: { name: 'asc' },
        })

        return { success: true, data: admins }
    } catch (error) {
        console.error('Error fetching admins:', error)
        return { success: false, error: 'Failed to fetch admins' }
    }
}
