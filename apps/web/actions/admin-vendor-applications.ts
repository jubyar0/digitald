'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import type {
    VendorApplicationStatus,
    StepStatus,
    NoteType,
    AuditAction,
    PersonaStatus
} from '@repo/database'

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ApplicationFilters {
    status?: VendorApplicationStatus | VendorApplicationStatus[]
    personaStatus?: PersonaStatus
    searchQuery?: string
    dateFrom?: Date
    dateTo?: Date
}

interface PaginationOptions {
    page?: number
    limit?: number
    sortBy?: 'createdAt' | 'updatedAt' | 'submittedAt'
    sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// Permission Helpers
// ============================================================================

async function getAdminPermissions(userId: string) {
    const admin = await prisma.adminAccount.findUnique({
        where: { userId },
        select: {
            isSuperAdmin: true,
            permissions: true,
        }
    })

    return {
        isSuperAdmin: admin?.isSuperAdmin || false,
        permissions: (admin?.permissions as any) || {},
        canApprove: admin?.isSuperAdmin || (admin?.permissions as any)?.canApprove || false,
        canReject: admin?.isSuperAdmin || (admin?.permissions as any)?.canReject || false,
        canRequestRevision: admin?.isSuperAdmin || (admin?.permissions as any)?.canRequestRevision || false,
        canOverridePersona: admin?.isSuperAdmin || false,
        canClosePermanently: admin?.isSuperAdmin || false,
    }
}

async function requireAdminSession() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        throw new Error('Unauthorized: No session found')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required')
    }

    return session.user.id
}

async function logAuditAction(
    applicationId: string,
    action: AuditAction,
    performedBy: string,
    metadata?: any
) {
    const headers = await import('next/headers')
    const headersList = headers.headers()

    await prisma.applicationAuditLog.create({
        data: {
            applicationId,
            action,
            performedBy,
            metadata: metadata || {},
            ipAddress: headersList.get('x-forwarded-for') || 'unknown',
            userAgent: headersList.get('user-agent') || 'unknown'
        }
    })
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Get vendor applications with advanced filtering and pagination
 */
export async function getVendorApplications(
    filters: ApplicationFilters = {},
    pagination: PaginationOptions = {}
) {
    try {
        await requireAdminSession()

        const {
            status,
            personaStatus,
            searchQuery,
            dateFrom,
            dateTo
        } = filters

        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = pagination

        const skip = (page - 1) * limit


        // Build where clause
        const where: any = {
            // Soft delete filtering via status CLOSED instead of deletedAt
        }

        if (status) {
            where.status = Array.isArray(status) ? { in: status } : status
        }

        if (personaStatus) {
            where.personaStatus = personaStatus
        }

        if (searchQuery) {
            where.OR = [
                { vendor: { name: { contains: searchQuery, mode: 'insensitive' } } },
                { vendor: { user: { email: { contains: searchQuery, mode: 'insensitive' } } } },
                { vendor: { user: { name: { contains: searchQuery, mode: 'insensitive' } } } },
                { id: { contains: searchQuery } },
            ]
        }

        if (dateFrom || dateTo) {
            where.createdAt = {}
            if (dateFrom) where.createdAt.gte = dateFrom
            if (dateTo) where.createdAt.lte = dateTo
        }

        // Fetch applications
        const [applications, totalCount] = await Promise.all([
            prisma.vendorApplication.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    vendor: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true,
                                    createdAt: true,
                                    image: true,
                                }
                            }
                        }
                    },
                    reviewer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    steps: {
                        orderBy: { stepNumber: 'asc' },
                        select: {
                            id: true,
                            stepNumber: true,
                            stepName: true,
                            status: true,
                            completedAt: true,
                            revisionRequired: true,
                        }
                    },
                    _count: {
                        select: {
                            applicationNotes: true,
                            auditLogs: true
                        }
                    }
                }
            }),
            prisma.vendorApplication.count({ where })
        ])

        return {
            success: true,
            data: {
                applications,
                pagination: {
                    total: totalCount,
                    page,
                    limit,
                    pages: Math.ceil(totalCount / limit)
                }
            }
        }
    } catch (error) {
        console.error('Error fetching vendor applications:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch applications'
        }
    }
}

/**
 * Get detailed information for a single application
 */
export async function getVendorApplicationById(applicationId: string) {
    try {
        await requireAdminSession()

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: {
                vendor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                                createdAt: true,
                                image: true,
                                role: true,
                                bannedUsers: true,
                            }
                        },
                        products: {
                            select: {
                                id: true,
                                name: true,
                                status: true,
                            },
                            take: 5
                        },
                        orders: {
                            select: {
                                id: true,
                                status: true,
                                totalAmount: true,
                            },
                            take: 5
                        },
                    }
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                },
                revisionRequestedByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                personaOverriddenByUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                steps: {
                    orderBy: { stepNumber: 'asc' }
                },
                applicationNotes: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        }
                    }
                },
                auditLogs: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        admin: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                personaVerification: true,
            }
        })

        if (!application) {
            return {
                success: false,
                error: 'Application not found'
            }
        }

        return {
            success: true,
            data: application
        }
    } catch (error) {
        console.error('Error fetching application details:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch application'
        }
    }
}

/**
 * Approve a vendor application
 */
export async function approveApplication(
    applicationId: string,
    adminNotes?: string
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.canApprove) {
            throw new Error('Unauthorized: You do not have permission to approve applications')
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: { vendor: { include: { user: true } } }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        if (application.status === 'APPROVED') {
            return { success: false, error: 'Application is already approved' }
        }

        // Update application status
        await prisma.$transaction(async (tx) => {
            // Update application
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                }
            })

            // Update user role to VENDOR
            await tx.user.update({
                where: { id: application.vendor.userId },
                data: { role: 'VENDOR' }
            })

            // Create escrow account if not exists
            const existingEscrow = await tx.escrowAccount.findUnique({
                where: { vendorId: application.vendorId }
            })

            if (!existingEscrow) {
                await tx.escrowAccount.create({
                    data: {
                        vendorId: application.vendorId,
                        balance: 0,
                        availableBalance: 0,
                    }
                })
            }

            // Add admin note if provided
            if (adminNotes) {
                await tx.applicationNote.create({
                    data: {
                        applicationId,
                        type: 'ADMIN_INTERNAL',
                        content: adminNotes,
                        createdBy: adminId,
                    }
                })
            }

            // Log audit action
            await logAuditAction(applicationId, 'APPROVED', adminId, {
                notes: adminNotes || null
            })

            // Create notification for user
            await tx.notification.create({
                data: {
                    userId: application.vendor.userId,
                    type: 'APPLICATION_APPROVED',
                    title: 'Seller Application Approved',
                    message: 'Congratulations! Your seller application has been approved. You can now start listing products.',
                    isRead: false,
                }
            })
        })

        // TODO: Send approval email

        revalidatePath('/admin/seller-applications')
        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Application approved successfully' }
    } catch (error) {
        console.error('Error approving application:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to approve application'
        }
    }
}

/**
 * Reject a vendor application
 */
export async function rejectApplication(
    applicationId: string,
    reason: string,
    sendToUser: boolean = true
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.canReject) {
            throw new Error('Unauthorized: You do not have permission to reject applications')
        }

        if (!reason || reason.trim().length === 0) {
            return { success: false, error: 'Rejection reason is required' }
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: { vendor: { include: { user: true } } }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        if (application.status === 'APPROVED') {
            return { success: false, error: 'Cannot reject an approved application' }
        }

        await prisma.$transaction(async (tx) => {
            // Update application
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'REJECTED',
                    rejectedAt: new Date(),
                    rejectionReason: reason,
                    reviewedBy: adminId,
                    reviewedAt: new Date(),
                }
            })

            // Add note if should be visible to user
            if (sendToUser) {
                await tx.applicationNote.create({
                    data: {
                        applicationId,
                        type: 'USER_FACING',
                        content: reason,
                        createdBy: adminId,
                    }
                })
            }

            // Always add internal note
            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'ADMIN_INTERNAL',
                    content: `Application rejected. Reason: ${reason}`,
                    createdBy: adminId,
                }
            })

            // Log audit action
            await logAuditAction(applicationId, 'REJECTED', adminId, {
                reason,
                sentToUser: sendToUser
            })

            // Create notification for user
            if (sendToUser) {
                await tx.notification.create({
                    data: {
                        userId: application.vendor.userId,
                        type: 'APPLICATION_REJECTED',
                        title: 'Seller Application Rejected',
                        message: `Your seller application has been rejected. Reason: ${reason}`,
                        isRead: false,
                    }
                })
            }
        })

        // TODO: Send rejection email

        revalidatePath('/admin/seller-applications')
        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Application rejected' }
    } catch (error) {
        console.error('Error rejecting application:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reject application'
        }
    }
}

/**
 * Request revision on application
 */
export async function requestRevision(
    applicationId: string,
    reason: string,
    stepNumbers?: number[]
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.canRequestRevision) {
            throw new Error('Unauthorized: You do not have permission to request revisions')
        }

        if (!reason || reason.trim().length === 0) {
            return { success: false, error: 'Revision reason is required' }
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: {
                vendor: { include: { user: true } },
                steps: true
            }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        if (application.status === 'APPROVED') {
            return { success: false, error: 'Cannot request revision on approved application' }
        }

        await prisma.$transaction(async (tx) => {
            // Update application
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'NEEDS_REVISION',
                    revisionRequested: true,
                    revisionRequestedAt: new Date(),
                    revisionRequestedBy: adminId,
                    revisionReason: reason,
                }
            })

            // Mark specific steps as needing revision
            if (stepNumbers && stepNumbers.length > 0) {
                await tx.applicationStep.updateMany({
                    where: {
                        applicationId,
                        stepNumber: { in: stepNumbers }
                    },
                    data: {
                        status: 'NEEDS_REVISION',
                        revisionRequired: true,
                        revisionNotes: reason,
                    }
                })
            }

            // Add user-facing note
            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'USER_FACING',
                    content: reason,
                    createdBy: adminId,
                    metadata: {
                        steps: stepNumbers || []
                    }
                }
            })

            // Log audit action
            await logAuditAction(applicationId, 'REVISION_REQUESTED', adminId, {
                reason,
                steps: stepNumbers || []
            })

            // Create notification for user
            await tx.notification.create({
                data: {
                    userId: application.vendor.userId,
                    type: 'APPLICATION_REVISION_REQUESTED',
                    title: 'Revision Requested on Your Application',
                    message: `Please review and update your application. ${reason}`,
                    isRead: false,
                }
            })
        })

        // TODO: Send revision request email

        revalidatePath('/admin/seller-applications')
        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Revision requested successfully' }
    } catch (error) {
        console.error('Error requesting revision:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to request revision'
        }
    }
}

/**
 * Reopen a closed or rejected application
 */
export async function reopenApplication(
    applicationId: string,
    reason: string
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.canApprove) { // Reuse approve permission for reopen
            throw new Error('Unauthorized: You do not have permission to reopen applications')
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: { vendor: { include: { user: true } } }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        if (application.status !== 'REJECTED' && application.status !== 'CLOSED') {
            return { success: false, error: 'Only rejected or closed applications can be reopened' }
        }

        await prisma.$transaction(async (tx) => {
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'UNDER_REVIEW',
                    revisionRequested: false,
                }
            })

            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'ADMIN_INTERNAL',
                    content: `Application reopened. Reason: ${reason}`,
                    createdBy: adminId,
                }
            })

            await logAuditAction(applicationId, 'REOPENED', adminId, { reason })

            await tx.notification.create({
                data: {
                    userId: application.vendor.userId,
                    type: 'APPLICATION_SUBMITTED',
                    title: 'Application Reopened',
                    message: 'Your seller application has been reopened for review.',
                    isRead: false,
                }
            })
        })

        revalidatePath('/admin/seller-applications')
        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Application reopened successfully' }
    } catch (error) {
        console.error('Error reopening application:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reopen application'
        }
    }
}

/**
 * Close application permanently
 */
export async function closeApplicationPermanently(
    applicationId: string,
    reason: string
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.canClosePermanently) {
            throw new Error('Unauthorized: Only super admins can close applications permanently')
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        if (application.status === 'APPROVED') {
            return { success: false, error: 'Cannot close an approved application' }
        }

        await prisma.$transaction(async (tx) => {
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'CLOSED',
                    deletedAt: new Date(), // Soft delete
                }
            })

            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'ADMIN_INTERNAL',
                    content: `Application closed permanently. Reason: ${reason}`,
                    createdBy: adminId,
                }
            })

            await logAuditAction(applicationId, 'CLOSED', adminId, { reason })
        })

        revalidatePath('/admin/seller-applications')

        return { success: true, message: 'Application closed permanently' }
    } catch (error) {
        console.error('Error closing application:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to close application'
        }
    }
}

/**
 * Add admin note to application
 */
export async function addAdminNote(
    applicationId: string,
    content: string,
    isUserFacing: boolean = false
) {
    try {
        const adminId = await requireAdminSession()

        if (!content || content.trim().length === 0) {
            return { success: false, error: 'Note content is required' }
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: { vendor: { include: { user: true } } }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        const noteType: NoteType = isUserFacing ? 'USER_FACING' : 'ADMIN_INTERNAL'

        await prisma.$transaction(async (tx) => {
            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: noteType,
                    content,
                    createdBy: adminId,
                }
            })

            await logAuditAction(applicationId, 'NOTE_ADDED', adminId, {
                noteType,
                isUserFacing
            })

            // Notify user if note is user-facing
            if (isUserFacing) {
                await tx.notification.create({
                    data: {
                        userId: application.vendor.userId,
                        type: 'APPLICATION_REVISION_REQUESTED',
                        title: 'New Note on Your Application',
                        message: content.substring(0, 200),
                        isRead: false,
                    }
                })
            }
        })

        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Note added successfully' }
    } catch (error) {
        console.error('Error adding note:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add note'
        }
    }
}

/**
 * Force complete a specific step (admin override)
 */
export async function forceCompleteStep(
    applicationId: string,
    stepNumber: number,
    adminNotes: string
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.isSuperAdmin) {
            throw new Error('Unauthorized: Only super admins can force step completion')
        }

        await prisma.$transaction(async (tx) => {
            await tx.applicationStep.updateMany({
                where: {
                    applicationId,
                    stepNumber
                },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                    revisionRequired: false,
                }
            })

            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'ADMIN_INTERNAL',
                    content: `Step ${stepNumber} force-completed by admin. Reason: ${adminNotes}`,
                    createdBy: adminId,
                    metadata: { stepNumber }
                }
            })

            await logAuditAction(applicationId, 'STEP_COMPLETED', adminId, {
                stepNumber,
                forcedByAdmin: true,
                notes: adminNotes
            })
        })

        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Step marked as completed' }
    } catch (error) {
        console.error('Error forcing step completion:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to complete step'
        }
    }
}

/**
 * Request revision on a specific step
 */
export async function requestStepRevision(
    applicationId: string,
    stepNumber: number,
    revisionNotes: string
) {
    try {
        const adminId = await requireAdminSession()
        const permissions = await getAdminPermissions(adminId)

        if (!permissions.canRequestRevision) {
            throw new Error('Unauthorized: You do not have permission to request revisions')
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: { vendor: { include: { user: true } } }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        await prisma.$transaction(async (tx) => {
            await tx.applicationStep.updateMany({
                where: {
                    applicationId,
                    stepNumber
                },
                data: {
                    status: 'NEEDS_REVISION',
                    revisionRequired: true,
                    revisionNotes,
                }
            })

            // Update application status
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    status: 'NEEDS_REVISION',
                    revisionRequested: true,
                    currentStep: stepNumber, // Redirect user to this step
                }
            })

            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'USER_FACING',
                    content: `Step ${stepNumber} needs revision: ${revisionNotes}`,
                    createdBy: adminId,
                    metadata: { stepNumber }
                }
            })

            await logAuditAction(applicationId, 'STEP_REVISION_REQUESTED', adminId, {
                stepNumber,
                notes: revisionNotes
            })

            await tx.notification.create({
                data: {
                    userId: application.vendor.userId,
                    type: 'APPLICATION_REVISION_REQUESTED',
                    title: 'Revision Requested on Application Step',
                    message: `Step ${stepNumber} needs revision: ${revisionNotes}`,
                    isRead: false,
                }
            })
        })

        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return { success: true, message: 'Step revision requested' }
    } catch (error) {
        console.error('Error requesting step revision:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to request step revision'
        }
    }
}

/**
 * Get application statistics for dashboard
 */
export async function getApplicationStatistics(dateRange?: { from: Date; to: Date }) {
    try {
        await requireAdminSession()

        const where: any = { deletedAt: null }

        if (dateRange) {
            where.createdAt = {
                gte: dateRange.from,
                lte: dateRange.to
            }
        }

        const [
            totalApplications,
            statusCounts,
            personaStatusCounts,
            avgReviewTime,
        ] = await Promise.all([
            prisma.vendorApplication.count({ where }),

            prisma.vendorApplication.groupBy({
                by: ['status'],
                where,
                _count: true
            }),

            prisma.vendorApplication.groupBy({
                by: ['personaStatus'],
                where,
                _count: true
            }),

            // Average review time (for approved/rejected applications)
            prisma.vendorApplication.aggregate({
                where: {
                    ...where,
                    status: { in: ['APPROVED', 'REJECTED'] },
                    reviewedAt: { not: null },
                },
                _avg: {
                    // This is a simplification - in real scenario you'd calculate diff between submitted and reviewed
                }
            })
        ])

        const approvedCount = statusCounts.find(s => s.status === 'APPROVED')?._count || 0
        const rejectedCount = statusCounts.find(s => s.status === 'REJECTED')?._count || 0
        const pendingCount = statusCounts.find(s => s.status === 'PENDING')?._count || 0
        const underReviewCount = statusCounts.find(s => s.status === 'UNDER_REVIEW')?._count || 0
        const needsRevisionCount = statusCounts.find(s => s.status === 'NEEDS_REVISION')?._count || 0

        const totalReviewed = approvedCount + rejectedCount
        const approvalRate = totalReviewed > 0 ? (approvedCount / totalReviewed) * 100 : 0
        const rejectionRate = totalReviewed > 0 ? (rejectedCount / totalReviewed) * 100 : 0

        return {
            success: true,
            data: {
                total: totalApplications,
                byStatus: {
                    pending: pendingCount,
                    underReview: underReviewCount,
                    needsRevision: needsRevisionCount,
                    approved: approvedCount,
                    rejected: rejectedCount,
                },
                byPersonaStatus: personaStatusCounts.reduce((acc, curr) => {
                    acc[curr.personaStatus] = curr._count
                    return acc
                }, {} as Record<string, number>),
                metrics: {
                    approvalRate: Math.round(approvalRate * 10) / 10,
                    rejectionRate: Math.round(rejectionRate * 10) / 10,
                    // avgReviewTimeHours: calculateAvgReviewTime(), // TODO: Implement
                }
            }
        }
    } catch (error) {
        console.error('Error fetching statistics:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch statistics'
        }
    }
}
