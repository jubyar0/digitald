'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import type { PersonaStatus, AuditAction } from '@repo/database'

// ============================================================================
// Persona Configuration
// ============================================================================

interface PersonaConfig {
    enabled: boolean
    apiKey?: string
    environmentId?: string
    templateId?: string
    autoApproveOnVerify: boolean
    webhookSecret?: string
}

async function getPersonaConfig(): Promise<PersonaConfig> {
    const settings = await prisma.setting.findMany({
        where: {
            key: {
                in: [
                    'persona_enabled',
                    'persona_api_key',
                    'persona_environment_id',
                    'persona_template_id',
                    'persona_auto_approve',
                    'persona_webhook_secret'
                ]
            }
        }
    })

    const config: PersonaConfig = {
        enabled: settings.find(s => s.key === 'persona_enabled')?.value === 'true',
        apiKey: settings.find(s => s.key === 'persona_api_key')?.value,
        environmentId: settings.find(s => s.key === 'persona_environment_id')?.value,
        templateId: settings.find(s => s.key === 'persona_template_id')?.value,
        autoApproveOnVerify: settings.find(s => s.key === 'persona_auto_approve')?.value === 'true',
        webhookSecret: settings.find(s => s.key === 'persona_webhook_secret')?.value,
    }

    return config
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
// Persona API Integration (Mock - Replace with actual API calls)
// ============================================================================

interface PersonaInquiryResponse {
    id: string
    url: string
    status: string
}

async function createPersonaInquiry(
    config: PersonaConfig,
    userData: {
        referenceId: string
        email: string
        name?: string
    }
): Promise<PersonaInquiryResponse> {
    // Mock implementation - Replace with actual Persona API call
    // const response = await fetch('https://withpersona.com/api/v1/inquiries', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${config.apiKey}`,
    //     'Content-Type': 'application/json',
    //     'Persona-Version': '2023-01-05'
    //   },
    //   body: JSON.stringify({
    //     data: {
    //       type: 'inquiry',
    //       attributes: {
    //         inquiry_template_id: config.templateId,
    //         reference_id: userData.referenceId,
    //         note: `Vendor application: ${userData.referenceId}`,
    //         fields: {
    //           name_first: userData.name?.split(' ')[0],
    //           name_last: userData.name?.split(' ').slice(1).join(' '),
    //           email_address: userData.email,
    //         }
    //       }
    //     }
    //   })
    // })

    // const data = await response.json()

    // Mock response for development
    return {
        id: `inq_${Date.now()}`,
        url: `https://withpersona.com/verify?inquiry-id=inq_${Date.now()}`,
        status: 'pending'
    }
}

async function checkPersonaInquiryStatus(
    config: PersonaConfig,
    inquiryId: string
): Promise<{ status: string; details?: any }> {
    // Mock implementation - Replace with actual Persona API call
    // const response = await fetch(`https://withpersona.com/api/v1/inquiries/${inquiryId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${config.apiKey}`,
    //     'Persona-Version': '2023-01-05'
    //   }
    // })

    // const data = await response.json()

    // Mock response
    return {
        status: 'pending',
        details: {}
    }
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Initiate Persona verification for an application
 */
export async function initiatePersonaVerification(applicationId: string) {
    try {
        const adminId = await requireAdminSession()

        const config = await getPersonaConfig()

        if (!config.enabled) {
            return {
                success: false,
                error: 'Persona verification is not enabled'
            }
        }

        if (!config.apiKey) {
            return {
                success: false,
                error: 'Persona API key is not configured'
            }
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: {
                vendor: {
                    include: {
                        user: true
                    }
                },
                personaVerification: true
            }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        // Check if verification already exists
        if (application.personaVerification) {
            return {
                success: false,
                error: 'Persona verification already initiated. Use retry instead.'
            }
        }

        // Create Persona inquiry
        const inquiry = await createPersonaInquiry(config, {
            referenceId: application.id,
            email: application.vendor.user.email,
            name: application.vendor.user.name || application.vendor.name
        })

        // Save verification record
        await prisma.$transaction(async (tx) => {
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    personaInquiryId: inquiry.id,
                    personaStatus: 'PENDING' as PersonaStatus,
                }
            })

            await tx.personaVerification.create({
                data: {
                    applicationId,
                    inquiryId: inquiry.id,
                    status: 'PENDING' as PersonaStatus,
                    verificationUrl: inquiry.url,
                }
            })

            await logAuditAction(applicationId, 'PERSONA_INITIATED', adminId, {
                inquiryId: inquiry.id
            })

            // Send notification to user
            await tx.notification.create({
                data: {
                    userId: application.vendor.userId,
                    type: 'APPLICATION_SUBMITTED',
                    title: 'Identity Verification Required',
                    message: 'Please complete your identity verification to proceed with your seller application.',
                    isRead: false,
                }
            })
        })

        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return {
            success: true,
            data: {
                inquiryId: inquiry.id,
                verificationUrl: inquiry.url
            }
        }
    } catch (error) {
        console.error('Error initiating Persona verification:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to initiate verification'
        }
    }
}

/**
 * Retry Persona verification (create new inquiry)
 */
export async function retryPersonaVerification(applicationId: string) {
    try {
        const adminId = await requireAdminSession()

        const config = await getPersonaConfig()

        if (!config.enabled) {
            return {
                success: false,
                error: 'Persona verification is not enabled'
            }
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
            include: {
                vendor: {
                    include: {
                        user: true
                    }
                },
                personaVerification: true
            }
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        // Create new inquiry
        const inquiry = await createPersonaInquiry(config, {
            referenceId: application.id,
            email: application.vendor.user.email,
            name: application.vendor.user.name || application.vendor.name
        })

        // Update verification record
        await prisma.$transaction(async (tx) => {
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    personaInquiryId: inquiry.id,
                    personaStatus: 'PENDING' as PersonaStatus,
                    personaOverridden: false,
                }
            })

            // Update or create verification record
            if (application.personaVerification) {
                await tx.personaVerification.update({
                    where: { applicationId },
                    data: {
                        inquiryId: inquiry.id,
                        status: 'PENDING' as PersonaStatus,
                        verificationUrl: inquiry.url,
                        lastCheckedAt: new Date(),
                    }
                })
            } else {
                await tx.personaVerification.create({
                    data: {
                        applicationId,
                        inquiryId: inquiry.id,
                        status: 'PENDING' as PersonaStatus,
                        verificationUrl: inquiry.url,
                    }
                })
            }

            await logAuditAction(applicationId, 'PERSONA_INITIATED', adminId, {
                inquiryId: inquiry.id,
                retry: true
            })

            await tx.notification.create({
                data: {
                    userId: application.vendor.userId,
                    type: 'APPLICATION_SUBMITTED',
                    title: 'New Identity Verification Request',
                    message: 'Please complete your identity verification.',
                    isRead: false,
                }
            })
        })

        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return {
            success: true,
            data: {
                inquiryId: inquiry.id,
                verificationUrl: inquiry.url
            }
        }
    } catch (error) {
        console.error('Error retrying Persona verification:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to retry verification'
        }
    }
}

/**
 * Override Persona verification (admin bypass)
 */
export async function overridePersonaVerification(
    applicationId: string,
    reason: string,
    approved: boolean = true
) {
    try {
        const adminId = await requireAdminSession()

        // Check if admin is super admin
        const admin = await prisma.adminAccount.findUnique({
            where: { userId: adminId },
            select: { isSuperAdmin: true }
        })

        if (!admin?.isSuperAdmin) {
            throw new Error('Unauthorized: Only super admins can override Persona verification')
        }

        if (!reason || reason.trim().length === 0) {
            return { success: false, error: 'Override reason is required' }
        }

        const application = await prisma.vendorApplication.findUnique({
            where: { id: applicationId },
        })

        if (!application) {
            return { success: false, error: 'Application not found' }
        }

        const newStatus: PersonaStatus = approved ? 'OVERRIDDEN' : 'FAILED'

        await prisma.$transaction(async (tx) => {
            await tx.vendorApplication.update({
                where: { id: applicationId },
                data: {
                    personaStatus: newStatus,
                    personaOverridden: true,
                    personaOverrideReason: reason,
                    personaOverriddenBy: adminId,
                    personaOverriddenAt: new Date(),
                    personaVerifiedAt: approved ? new Date() : null,
                }
            })

            if (application.personaInquiryId) {
                await tx.personaVerification.upsert({
                    where: { applicationId },
                    create: {
                        applicationId,
                        inquiryId: application.personaInquiryId || `override_${Date.now()}`,
                        status: newStatus,
                    },
                    update: {
                        status: newStatus,
                        lastCheckedAt: new Date(),
                    }
                })
            }

            await tx.applicationNote.create({
                data: {
                    applicationId,
                    type: 'ADMIN_INTERNAL',
                    content: `Persona verification ${approved ? 'approved' : 'rejected'} by admin override. Reason: ${reason}`,
                    createdBy: adminId,
                }
            })

            await logAuditAction(applicationId, 'PERSONA_OVERRIDDEN', adminId, {
                reason,
                approved
            })
        })

        revalidatePath(`/admin/seller-applications/${applicationId}`)

        return {
            success: true,
            message: `Persona verification ${approved ? 'approved' : 'rejected'} via override`
        }
    } catch (error) {
        console.error('Error overriding Persona verification:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to override verification'
        }
    }
}

/**
 * Get Persona verification status
 */
export async function getPersonaVerificationStatus(applicationId: string) {
    try {
        await requireAdminSession()

        const verification = await prisma.personaVerification.findUnique({
            where: { applicationId },
            include: {
                application: {
                    select: {
                        personaStatus: true,
                        personaOverridden: true,
                        personaOverrideReason: true,
                        personaVerifiedAt: true,
                    }
                }
            }
        })

        if (!verification) {
            return {
                success: false,
                error: 'Verification not found'
            }
        }

        return {
            success: true,
            data: verification
        }
    } catch (error) {
        console.error('Error fetching verification status:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch verification status'
        }
    }
}

/**
 * Handle Persona webhook (called by Persona when verification status changes)
 */
export async function handlePersonaWebhook(webhookData: any) {
    try {
        // Verify webhook signature (important for security!)
        const config = await getPersonaConfig()

        // TODO: Implement proper webhook signature verification
        // const signature = headers().get('persona-signature')
        // if (!verifyWebhookSignature(webhookData, signature, config.webhookSecret)) {
        //   throw new Error('Invalid webhook signature')
        // }

        const { data } = webhookData
        const inquiryId = data.id
        const status = data.attributes.status
        const referenceId = data.attributes.reference_id

        // Find application by inquiry ID or reference ID
        const application = await prisma.vendorApplication.findFirst({
            where: {
                OR: [
                    { personaInquiryId: inquiryId },
                    { id: referenceId }
                ]
            },
            include: {
                vendor: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!application) {
            console.error('Application not found for Persona webhook:', inquiryId)
            return { success: false, error: 'Application not found' }
        }

        // Map Persona status to our PersonaStatus enum
        let personaStatus: PersonaStatus = 'PENDING'
        let auditAction: AuditAction = 'PERSONA_INITIATED'

        switch (status) {
            case 'completed':
            case 'approved':
                personaStatus = 'VERIFIED'
                auditAction = 'PERSONA_COMPLETED'
                break
            case 'failed':
            case 'declined':
                personaStatus = 'FAILED'
                auditAction = 'PERSONA_FAILED'
                break
            case 'pending':
            case 'created':
                personaStatus = 'PENDING'
                break
            default:
                personaStatus = 'UNDER_REVIEW'
        }

        // Update application
        await prisma.$transaction(async (tx) => {
            const updateData: any = {
                personaStatus,
            }

            if (personaStatus === 'VERIFIED') {
                updateData.personaVerifiedAt = new Date()

                // Auto-approve if configured
                if (config.autoApproveOnVerify && application.status === 'PENDING') {
                    updateData.status = 'APPROVED'
                    updateData.approvedAt = new Date()

                    // Update user role
                    await tx.user.update({
                        where: { id: application.vendor.userId },
                        data: { role: 'VENDOR' }
                    })

                    // Create notification
                    await tx.notification.create({
                        data: {
                            userId: application.vendor.userId,
                            type: 'APPLICATION_APPROVED',
                            title: 'Seller Application Approved',
                            message: 'Your identity verification was successful and your seller application has been approved!',
                            isRead: false,
                        }
                    })
                }
            } else if (personaStatus === 'FAILED') {
                // Notify user of failure
                await tx.notification.create({
                    data: {
                        userId: application.vendor.userId,
                        type: 'APPLICATION_REJECTED',
                        title: 'Identity Verification Failed',
                        message: 'Your identity verification was not successful. Please contact support or try again.',
                        isRead: false,
                    }
                })
            }

            await tx.vendorApplication.update({
                where: { id: application.id },
                data: updateData
            })

            await tx.personaVerification.update({
                where: { applicationId: application.id },
                data: {
                    status: personaStatus,
                    webhookData,
                    lastCheckedAt: new Date(),
                    failureReason: data.attributes.failure_reason || null,
                }
            })

            // Log audit action
            await logAuditAction(application.id, auditAction, 'system', {
                inquiryId,
                webhookStatus: status,
                autoApproved: config.autoApproveOnVerify && personaStatus === 'VERIFIED'
            })
        })

        revalidatePath(`/admin/seller-applications/${application.id}`)

        return { success: true }
    } catch (error) {
        console.error('Error handling Persona webhook:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process webhook'
        }
    }
}

/**
 * Get Persona settings (admin only)
 */
export async function getPersonaSettings() {
    try {
        const adminId = await requireAdminSession()

        const admin = await prisma.adminAccount.findUnique({
            where: { userId: adminId },
            select: { isSuperAdmin: true }
        })

        if (!admin?.isSuperAdmin) {
            throw new Error('Unauthorized: Only super admins can view Persona settings')
        }

        const config = await getPersonaConfig()

        // Don't expose API key in full
        return {
            success: true,
            data: {
                enabled: config.enabled,
                apiKeySet: !!config.apiKey,
                environmentId: config.environmentId,
                templateId: config.templateId,
                autoApproveOnVerify: config.autoApproveOnVerify,
            }
        }
    } catch (error) {
        console.error('Error fetching Persona settings:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch settings'
        }
    }
}

/**
 * Update Persona settings (super admin only)
 */
export async function updatePersonaSettings(settings: {
    enabled?: boolean
    apiKey?: string
    environmentId?: string
    templateId?: string
    autoApproveOnVerify?: boolean
    webhookSecret?: string
}) {
    try {
        const adminId = await requireAdminSession()

        const admin = await prisma.adminAccount.findUnique({
            where: { userId: adminId },
            select: { isSuperAdmin: true }
        })

        if (!admin?.isSuperAdmin) {
            throw new Error('Unauthorized: Only super admins can update Persona settings')
        }

        const updates: Array<{ key: string; value: string }> = []

        if (settings.enabled !== undefined) {
            updates.push({ key: 'persona_enabled', value: String(settings.enabled) })
        }

        if (settings.apiKey) {
            updates.push({ key: 'persona_api_key', value: settings.apiKey })
        }

        if (settings.environmentId !== undefined) {
            updates.push({ key: 'persona_environment_id', value: settings.environmentId })
        }

        if (settings.templateId !== undefined) {
            updates.push({ key: 'persona_template_id', value: settings.templateId })
        }

        if (settings.autoApproveOnVerify !== undefined) {
            updates.push({ key: 'persona_auto_approve', value: String(settings.autoApproveOnVerify) })
        }

        if (settings.webhookSecret) {
            updates.push({ key: 'persona_webhook_secret', value: settings.webhookSecret })
        }

        // Update settings in database
        for (const update of updates) {
            await prisma.setting.upsert({
                where: { key: update.key },
                create: {
                    key: update.key,
                    value: update.value,
                    type: 'string',
                    group: 'persona'
                },
                update: {
                    value: update.value
                }
            })
        }

        revalidatePath('/admin/settings')

        return {
            success: true,
            message: 'Persona settings updated successfully'
        }
    } catch (error) {
        console.error('Error updating Persona settings:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update settings'
        }
    }
}
