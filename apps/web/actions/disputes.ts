'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'
import { DisputeStatus, DisputeReason } from '@repo/database'
import { adjustEscrowBalance } from '@/actions/escrow'

export async function getDisputes(status?: DisputeStatus) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const disputes = await prisma.dispute.findMany({
            where: status ? { status } : undefined,
            include: {
                order: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        },
                        vendor: {
                            select: { id: true, name: true }
                        }
                    }
                },
                product: {
                    select: { id: true, name: true, thumbnail: true }
                },
                initiator: {
                    select: { id: true, name: true, email: true }
                },
                conversation: {
                    include: {
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return disputes
    } catch (error) {
        console.error('Error fetching disputes:', error)
        return []
    }
}

export async function getDisputeById(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            throw new Error('Unauthorized')
        }

        const dispute = await prisma.dispute.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        },
                        vendor: {
                            select: { id: true, name: true, user: true }
                        },
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                product: true,
                initiator: {
                    select: { id: true, name: true, email: true }
                },
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true }
                        }
                    }
                },
                conversation: {
                    include: {
                        messages: {
                            include: {
                                sender: {
                                    select: { id: true, name: true, role: true }
                                }
                            },
                            orderBy: { createdAt: 'asc' }
                        }
                    }
                }
            }
        })

        return dispute
    } catch (error) {
        console.error('Error fetching dispute:', error)
        return null
    }
}

export async function createDispute(data: {
    orderId: string
    productId: string
    reason: DisputeReason
    description: string
    evidenceFiles?: string[]
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify order belongs to user
        const order = await prisma.order.findUnique({
            where: { id: data.orderId },
            include: { vendor: true }
        })

        if (!order || order.userId !== session.user.id) {
            throw new Error('Order not found or unauthorized')
        }

        // Create conversation for dispute
        const conversation = await prisma.conversation.create({
            data: {
                vendorId: order.vendorId,
                customerId: session.user.id,
                participants: {
                    create: [
                        { userId: session.user.id },
                        { userId: order.vendor.userId }
                    ]
                }
            }
        })

        // Create dispute
        const dispute = await prisma.dispute.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                initiatorId: session.user.id,
                reason: data.description,
                disputeReason: data.reason,
                evidenceFiles: data.evidenceFiles || [],
                conversationId: conversation.id,
                status: 'PENDING',
                participants: {
                    create: [
                        { userId: session.user.id, role: 'BUYER' },
                        { userId: order.vendor.userId, role: 'SELLER' }
                    ]
                }
            }
        })

        // Hold funds in escrow
        await adjustEscrowBalance({
            vendorId: order.vendorId,
            amount: order.totalAmount, // Assuming dispute covers full order amount, or we should verify if partial disputes are possible. For now holding full order.
            reason: `Dispute #${dispute.id.slice(0, 8)} opened: ${data.reason}`,
            type: 'HOLD'
        })

        // Create system message in conversation
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: session.user.id,
                content: `Dispute opened: ${data.reason}`,
                messageType: 'DISPUTE_UPDATE',
                metadata: {
                    disputeId: dispute.id,
                    reason: data.reason
                }
            }
        })

        revalidatePath('/admin/disputes')
        return { success: true, disputeId: dispute.id }
    } catch (error) {
        console.error('Error creating dispute:', error)
        return { success: false, error: 'Failed to create dispute' }
    }
}

export async function joinDisputeConversation(disputeId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { conversation: true }
        })

        if (!dispute || !dispute.conversationId) {
            throw new Error('Dispute or conversation not found')
        }

        // Add admin as participant if not already
        const existing = await prisma.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: session.user.id,
                    conversationId: dispute.conversationId
                }
            }
        })

        if (!existing) {
            await prisma.conversationParticipant.create({
                data: {
                    userId: session.user.id,
                    conversationId: dispute.conversationId
                }
            })

            // Add admin to dispute participants
            await prisma.disputeParticipant.create({
                data: {
                    disputeId,
                    userId: session.user.id,
                    role: 'ADMIN'
                }
            })

            // Create system message
            await prisma.message.create({
                data: {
                    conversationId: dispute.conversationId,
                    senderId: session.user.id,
                    content: 'Admin has joined the conversation',
                    messageType: 'SYSTEM'
                }
            })
        }

        return { success: true, conversationId: dispute.conversationId }
    } catch (error) {
        console.error('Error joining dispute conversation:', error)
        return { success: false, error: 'Failed to join conversation' }
    }
}

export async function resolveDispute(
    disputeId: string,
    resolution: string,
    refundDistribution?: { buyerAmount: number; sellerAmount: number }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { order: true, conversation: true }
        })

        if (!dispute) {
            throw new Error('Dispute not found')
        }

        // Update dispute
        await prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: 'RESOLVED',
                resolution,
                resolvedByAdmin: true,
                refundAmount: refundDistribution?.buyerAmount || 0,
                refundProcessed: !!refundDistribution
            }
        })

        // Create refund if distribution provided
        if (refundDistribution) {
            // First, UNHOLD the total disputed amount (order total)
            // Assuming the full order amount was held upon dispute creation
            await adjustEscrowBalance({
                vendorId: dispute.order.vendorId,
                amount: dispute.order.totalAmount, // Unhold everything first
                reason: `Dispute #${dispute.id.slice(0, 8)} resolved: Unholding funds`,
                type: 'UNHOLD'
            })

            // Then, if there is a refund to the buyer, SUBTRACT it from the now-available balance
            if (refundDistribution.buyerAmount > 0) {
                await adjustEscrowBalance({
                    vendorId: dispute.order.vendorId,
                    amount: refundDistribution.buyerAmount,
                    reason: `Dispute #${dispute.id.slice(0, 8)} refund`,
                    type: 'SUBTRACT'
                })

                await prisma.refund.create({
                    data: {
                        orderId: dispute.orderId,
                        amount: refundDistribution.buyerAmount,
                        reason: 'DEFECTIVE_PRODUCT',
                        status: 'APPROVED',
                        processedBy: session.user.id,
                        notes: resolution
                    }
                })
            }
        }

        // Create system message
        if (dispute.conversationId) {
            await prisma.message.create({
                data: {
                    conversationId: dispute.conversationId,
                    senderId: session.user.id,
                    content: `Dispute resolved: ${resolution}`,
                    messageType: 'DISPUTE_UPDATE',
                    metadata: {
                        disputeId,
                        resolution,
                        refundAmount: refundDistribution?.buyerAmount
                    }
                }
            })
        }

        revalidatePath('/admin/disputes')
        revalidatePath(`/admin/disputes/${disputeId}`)
        return { success: true }
    } catch (error) {
        console.error('Error resolving dispute:', error)
        return { success: false, error: 'Failed to resolve dispute' }
    }
}
