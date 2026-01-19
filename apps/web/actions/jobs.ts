'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'
import { JobOfferStatus } from '@repo/database'

export async function createJobOffer(data: {
    conversationId: string
    vendorId: string
    title: string
    description: string
    budget: number
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify conversation exists and user is a participant
        const conversation = await prisma.conversation.findUnique({
            where: { id: data.conversationId },
            include: { participants: true }
        })

        if (!conversation) {
            throw new Error('Conversation not found')
        }

        const isParticipant = conversation.participants.some(
            p => p.userId === session.user.id
        )

        if (!isParticipant) {
            throw new Error('Not a participant in this conversation')
        }

        // Create job offer
        const jobOffer = await prisma.jobOffer.create({
            data: {
                conversationId: data.conversationId,
                vendorId: data.vendorId,
                customerId: session.user.id,
                title: data.title,
                description: data.description,
                budget: data.budget,
                status: 'PENDING'
            }
        })

        // Create message in conversation
        await prisma.message.create({
            data: {
                conversationId: data.conversationId,
                senderId: session.user.id,
                content: `Job Offer: ${data.title}`,
                messageType: 'JOB_OFFER',
                metadata: {
                    jobOfferId: jobOffer.id,
                    title: data.title,
                    budget: data.budget
                }
            }
        })

        revalidatePath('/chat')
        return { success: true, jobOfferId: jobOffer.id }
    } catch (error) {
        console.error('Error creating job offer:', error)
        return { success: false, error: 'Failed to create job offer' }
    }
}

export async function acceptJobOffer(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const jobOffer = await prisma.jobOffer.findUnique({
            where: { id },
            include: { vendor: true, conversation: true }
        })

        if (!jobOffer) {
            throw new Error('Job offer not found')
        }

        // Verify user is the vendor
        if (jobOffer.vendor.userId !== session.user.id) {
            throw new Error('Unauthorized')
        }

        // Update job offer
        await prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'ACCEPTED',
                acceptedAt: new Date()
            }
        })

        // Create system message
        if (jobOffer.conversationId) {
            await prisma.message.create({
                data: {
                    conversationId: jobOffer.conversationId,
                    senderId: session.user.id,
                    content: 'Job offer accepted',
                    messageType: 'SYSTEM',
                    metadata: {
                        jobOfferId: id,
                        action: 'accepted'
                    }
                }
            })
        }

        revalidatePath('/chat')
        revalidatePath('/seller/jobs')
        return { success: true }
    } catch (error) {
        console.error('Error accepting job offer:', error)
        return { success: false, error: 'Failed to accept job offer' }
    }
}

export async function rejectJobOffer(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const jobOffer = await prisma.jobOffer.findUnique({
            where: { id },
            include: { vendor: true, conversation: true }
        })

        if (!jobOffer) {
            throw new Error('Job offer not found')
        }

        // Verify user is the vendor
        if (jobOffer.vendor.userId !== session.user.id) {
            throw new Error('Unauthorized')
        }

        // Update job offer
        await prisma.jobOffer.update({
            where: { id },
            data: {
                status: 'REJECTED'
            }
        })

        // Create system message
        if (jobOffer.conversationId) {
            await prisma.message.create({
                data: {
                    conversationId: jobOffer.conversationId,
                    senderId: session.user.id,
                    content: 'Job offer rejected',
                    messageType: 'SYSTEM',
                    metadata: {
                        jobOfferId: id,
                        action: 'rejected'
                    }
                }
            })
        }

        revalidatePath('/chat')
        revalidatePath('/seller/jobs')
        return { success: true }
    } catch (error) {
        console.error('Error rejecting job offer:', error)
        return { success: false, error: 'Failed to reject job offer' }
    }
}

export async function getJobOffers(vendorId?: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const jobOffers = await prisma.jobOffer.findMany({
            where: vendorId ? { vendorId } : {
                OR: [
                    { customerId: session.user.id },
                    { vendor: { userId: session.user.id } }
                ]
            },
            include: {
                vendor: {
                    select: { id: true, name: true }
                },
                customer: {
                    select: { id: true, name: true, email: true }
                },
                conversation: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return jobOffers
    } catch (error) {
        console.error('Error fetching job offers:', error)
        return []
    }
}
