'use server'

import { prisma } from '@/lib/db'

/**
 * Notify admins when a new support ticket is created
 */
export async function notifyAdminsNewTicket(ticketId: string) {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!ticket) return

        // Get all admins
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true },
        })

        // Create notifications for all admins
        const notifications = admins.map((admin) => ({
            userId: admin.id,
            title: 'New Support Ticket',
            message: `${ticket.user.name || ticket.user.email} created a new ${ticket.priority} priority ticket: ${ticket.subject}`,
            type: 'TICKET_NEW' as any,
        }))

        await prisma.notification.createMany({
            data: notifications,
        })

        console.log(`Notified ${admins.length} admins about new ticket ${ticketId}`)
    } catch (error) {
        console.error('Error notifying admins about new ticket:', error)
    }
}

/**
 * Notify user when ticket status is updated
 */
export async function notifyUserTicketUpdate(
    userId: string,
    ticketId: string,
    oldStatus: string,
    newStatus: string
) {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: {
                subject: true,
                assignee: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        if (!ticket) return

        let message = `Your ticket "${ticket.subject}" status changed from ${oldStatus} to ${newStatus}`

        if (newStatus === 'RESOLVED') {
            message = `Your ticket "${ticket.subject}" has been resolved!`
        } else if (newStatus === 'CLOSED') {
            message = `Your ticket "${ticket.subject}" has been closed`
        }

        await prisma.notification.create({
            data: {
                userId,
                title: 'Ticket Status Updated',
                message,
                type: 'TICKET_UPDATE' as any,
            },
        })

        console.log(`Notified user ${userId} about ticket ${ticketId} status change`)
    } catch (error) {
        console.error('Error notifying user about ticket update:', error)
    }
}

/**
 * Notify user when there's a new reply to their ticket
 */
export async function notifyUserNewReply(
    userId: string,
    ticketId: string,
    replierName: string,
    isInternal: boolean
) {
    try {
        // Don't notify about internal notes
        if (isInternal) return

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { subject: true },
        })

        if (!ticket) return

        await prisma.notification.create({
            data: {
                userId,
                title: 'New Reply to Your Ticket',
                message: `${replierName} replied to your ticket "${ticket.subject}"`,
                type: 'TICKET_REPLY' as any,
            },
        })

        console.log(`Notified user ${userId} about new reply on ticket ${ticketId}`)
    } catch (error) {
        console.error('Error notifying user about new reply:', error)
    }
}

/**
 * Notify admin when assigned to a ticket
 */
export async function notifyAdminAssignment(adminId: string, ticketId: string) {
    try {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!ticket) return

        await prisma.notification.create({
            data: {
                userId: adminId,
                title: 'Ticket Assigned to You',
                message: `You've been assigned to ticket "${ticket.subject}" from ${ticket.user.name || ticket.user.email}`,
                type: 'TICKET_ASSIGNED' as any,
            },
        })

        console.log(`Notified admin ${adminId} about ticket assignment ${ticketId}`)
    } catch (error) {
        console.error('Error notifying admin about assignment:', error)
    }
}
