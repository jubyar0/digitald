'use server'

import { prisma } from '@/lib/db';

// ============================================================================
// User Notification Functions - Real Database Implementation
// ============================================================================

/**
 * Create a notification in the database
 */
async function createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type: type as any,
                title,
                message,
                data,
                isRead: false,
            }
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

/**
 * Notify user when withdrawal is approved
 */
export async function notifyWithdrawalApproved(
    userId: string,
    amount: number,
    currency: string
) {
    await createNotification(
        userId,
        'WITHDRAWAL_APPROVED',
        'Withdrawal Approved',
        `Your withdrawal request for ${currency} ${amount.toFixed(2)} has been approved and is being processed.`,
        { amount, currency }
    );
}

/**
 * Notify user when withdrawal is rejected
 */
export async function notifyWithdrawalRejected(
    userId: string,
    amount: number,
    currency: string
) {
    await createNotification(
        userId,
        'WITHDRAWAL_REJECTED',
        'Withdrawal Rejected',
        `Your withdrawal request for ${currency} ${amount.toFixed(2)} has been rejected. The funds have been returned to your available balance.`,
        { amount, currency }
    );
}

/**
 * Notify user about dispute status change
 */
export async function notifyDisputeUpdate(
    userId: string,
    disputeId: string,
    status: string,
    message: string
) {
    await createNotification(
        userId,
        'DISPUTE_UPDATE',
        'Dispute Update',
        message,
        { disputeId, status }
    );
}

/**
 * Notify vendor about new order
 */
export async function notifyNewOrder(
    vendorUserId: string,
    orderId: string,
    amount: number,
    currency: string
) {
    await createNotification(
        vendorUserId,
        'NEW_ORDER',
        'New Order Received',
        `You have received a new order worth ${currency} ${amount.toFixed(2)}.`,
        { orderId, amount, currency }
    );
}

/**
 * Notify user about order status change
 */
export async function notifyOrderStatusChange(
    userId: string,
    orderId: string,
    status: string
) {
    const statusMessages: Record<string, string> = {
        'PAID': 'Your order has been confirmed and paid.',
        'SHIPPED': 'Your order has been shipped.',
        'DELIVERED': 'Your order has been delivered.',
        'COMPLETED': 'Your order has been completed.',
        'CANCELLED': 'Your order has been cancelled.',
    };

    await createNotification(
        userId,
        'ORDER_STATUS',
        'Order Status Update',
        statusMessages[status] || `Your order status has been updated to ${status}.`,
        { orderId, status }
    );
}

/**
 * Notify vendor about product approval
 */
export async function notifyProductApproved(
    vendorUserId: string,
    productId: string,
    productName: string
) {
    await createNotification(
        vendorUserId,
        'PRODUCT_APPROVED',
        'Product Approved',
        `Your product "${productName}" has been approved and is now live.`,
        { productId, productName }
    );
}

/**
 * Notify vendor about product rejection
 */
export async function notifyProductRejected(
    vendorUserId: string,
    productId: string,
    productName: string,
    reason: string
) {
    await createNotification(
        vendorUserId,
        'PRODUCT_REJECTED',
        'Product Rejected',
        `Your product "${productName}" has been rejected. Reason: ${reason}`,
        { productId, productName, reason }
    );
}
