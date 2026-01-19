'use server'

import { prisma } from '@/lib/prisma'
import { AdminNotification, AdminNotificationType, NotificationGroup } from '@/types/notifications'
// Prisma types are inferred from query results

export async function getAdminNotifications(limit = 50): Promise<AdminNotification[]> {
    try {
        const notifications: AdminNotification[] = []

        // Get pending vendor applications
        try {
            const vendorApplications = await prisma.vendorApplication.findMany({
                where: { status: 'PENDING' },
                include: {
                    vendor: {
                        include: {
                            user: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            })

            vendorApplications.forEach((app: any) => {
                notifications.push({
                    id: `vendor-app-${app.id}`,
                    type: 'VENDOR_APPLICATION',
                    title: 'New Vendor Application',
                    message: `${app.vendor.user.name} has applied to become a vendor`,
                    entityId: app.id,
                    entityType: 'VendorApplication',
                    isRead: false,
                    createdAt: app.createdAt,
                    actionUrl: `/admin/vendors/applications`,
                    metadata: {
                        userName: app.vendor.user.name,
                        userEmail: app.vendor.user.email,
                        vendorName: app.vendor.name,
                    }
                })
            })
        } catch (vendorAppError) {
            console.error('Error fetching vendor applications:', vendorAppError)
            // Continue without vendor application notifications
        }

        // Get pending products
        const pendingProducts = await prisma.product.findMany({
            where: { status: 'PENDING' },
            include: {
                vendor: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        })

        pendingProducts.forEach((product: any) => {
            notifications.push({
                id: `product-${product.id}`,
                type: 'PRODUCT_PENDING',
                title: 'Product Pending Approval',
                message: `${product.name} by ${product.vendor.name} is awaiting approval`,
                entityId: product.id,
                entityType: 'Product',
                isRead: false,
                createdAt: product.createdAt,
                actionUrl: `/admin/products/pending`,
                metadata: {
                    productName: product.name,
                    vendorName: product.vendor.name,
                }
            })
        })

        // Get pending withdrawals
        const pendingWithdrawals = await prisma.withdrawal.findMany({
            where: { status: 'PENDING' },
            include: {
                vendor: {
                    select: {
                        name: true,
                        user: {
                            select: { email: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        })

        pendingWithdrawals.forEach((withdrawal: any) => {
            notifications.push({
                id: `withdrawal-${withdrawal.id}`,
                type: 'WITHDRAWAL_REQUEST',
                title: 'Withdrawal Request',
                message: `${withdrawal.vendor.name} requested withdrawal of ${withdrawal.currency} ${withdrawal.amount}`,
                entityId: withdrawal.id,
                entityType: 'Withdrawal',
                isRead: false,
                createdAt: withdrawal.createdAt,
                actionUrl: `/admin/withdrawals`,
                metadata: {
                    vendorName: withdrawal.vendor.name,
                    amount: withdrawal.amount,
                }
            })
        })

        // Get open support tickets
        const openTickets = await prisma.supportTicket.findMany({
            where: { status: 'OPEN' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        })

        openTickets.forEach((ticket: any) => {
            notifications.push({
                id: `ticket-${ticket.id}`,
                type: 'SUPPORT_TICKET',
                title: 'New Support Ticket',
                message: `${ticket.user.name}: ${ticket.subject}`,
                entityId: ticket.id,
                entityType: 'SupportTicket',
                isRead: false,
                createdAt: ticket.createdAt,
                actionUrl: `/admin/support`,
                metadata: {
                    userName: ticket.user.name,
                    userEmail: ticket.user.email,
                }
            })
        })

        // Get recent users (last 7 days)
        const recentUsers = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        })

        recentUsers.forEach((user: any) => {
            notifications.push({
                id: `user-${user.id}`,
                type: 'NEW_USER',
                title: 'New User Registration',
                message: `${user.name} has registered`,
                entityId: user.id,
                entityType: 'User',
                isRead: false,
                createdAt: user.createdAt,
                actionUrl: `/admin/users`,
                metadata: {
                    userName: user.name,
                    userEmail: user.email,
                }
            })
        })

        // Sort all notifications by date
        return notifications
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit)

    } catch (error) {
        console.error('Error fetching admin notifications:', error)
        throw new Error('Failed to fetch notifications')
    }
}

export async function getNotificationGroups(): Promise<NotificationGroup[]> {
    try {
        const notifications = await getAdminNotifications()

        const groups: Record<AdminNotificationType, AdminNotification[]> = {
            VENDOR_APPLICATION: [],
            PRODUCT_PENDING: [],
            WITHDRAWAL_REQUEST: [],
            SUPPORT_TICKET: [],
            NEW_USER: [],
            SYSTEM_ALERT: [],
        }

        notifications.forEach(notification => {
            groups[notification.type].push(notification)
        })

        const groupTitles: Record<AdminNotificationType, string> = {
            VENDOR_APPLICATION: 'Vendor Applications',
            PRODUCT_PENDING: 'Pending Products',
            WITHDRAWAL_REQUEST: 'Withdrawal Requests',
            SUPPORT_TICKET: 'Support Tickets',
            NEW_USER: 'New Users',
            SYSTEM_ALERT: 'System Alerts',
        }

        return Object.entries(groups)
            .filter(([_, notifications]) => notifications.length > 0)
            .map(([type, notifications]) => ({
                type: type as AdminNotificationType,
                title: groupTitles[type as AdminNotificationType],
                notifications,
                count: notifications.length,
            }))

    } catch (error) {
        console.error('Error fetching notification groups:', error)
        throw new Error('Failed to fetch notification groups')
    }
}

export async function getUnreadNotificationCount(): Promise<number> {
    try {
        const counts = await Promise.allSettled([
            prisma.vendorApplication.count({ where: { status: 'PENDING' } }),
            prisma.product.count({ where: { status: 'PENDING' } }),
            prisma.withdrawal.count({ where: { status: 'PENDING' } }),
            prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        ])

        return counts.reduce((total, result) => {
            if (result.status === 'fulfilled') {
                return total + result.value
            } else {
                console.error('Error counting notifications:', result.reason)
                return total
            }
        }, 0)

    } catch (error) {
        console.error('Error fetching unread notification count:', error)
        return 0
    }
}

export async function markNotificationAsRead(id: string): Promise<{ success: boolean }> {
    // This is a placeholder since we're using derived notifications
    // In a real implementation, you'd store read status in a separate table
    return { success: true }
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
    // This is a placeholder since we're using derived notifications
    // In a real implementation, you'd store read status in a separate table
    return { success: true }
}
