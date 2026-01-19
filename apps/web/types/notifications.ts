export type AdminNotificationType =
    | 'VENDOR_APPLICATION'
    | 'PRODUCT_PENDING'
    | 'WITHDRAWAL_REQUEST'
    | 'SUPPORT_TICKET'
    | 'NEW_USER'
    | 'SYSTEM_ALERT'

export interface AdminNotification {
    id: string
    type: AdminNotificationType
    title: string
    message: string
    entityId?: string
    entityType?: string
    isRead: boolean
    createdAt: Date
    actionUrl?: string
    metadata?: {
        userName?: string
        userEmail?: string
        vendorName?: string
        productName?: string
        amount?: number
        status?: string
    }
}

export interface NotificationGroup {
    type: AdminNotificationType
    title: string
    notifications: AdminNotification[]
    count: number
}
