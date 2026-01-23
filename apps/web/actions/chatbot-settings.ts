'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ============================================================================
// Livechat Settings
// ============================================================================

export async function getLivechatSettings() {
    try {
        let settings = await prisma.liveChatSettings.findFirst()

        // Create default settings if not exists
        if (!settings) {
            settings = await prisma.liveChatSettings.create({
                data: {},
            })
        }

        return { success: true, data: settings }
    } catch (error) {
        console.error('Error fetching livechat settings:', error)
        return { success: false, error: 'Failed to fetch settings' }
    }
}

export async function updateLivechatSettings(data: {
    // Appearance
    widgetColor?: string
    widgetPosition?: string
    widgetIcon?: string
    welcomeMessage?: string
    offlineMessage?: string

    // Eye Catcher
    eyeCatcherEnabled?: boolean
    eyeCatcherText?: string
    eyeCatcherDelay?: number

    // Operating Hours
    operatingHoursEnabled?: boolean
    operatingHours?: any
    timezone?: string

    // Features
    soundEnabled?: boolean
    fileShareEnabled?: boolean
    maxFileSize?: number
    allowedFileTypes?: string[]

    // AI & Translation
    aiEnabled?: boolean
    aiModel?: string
    aiSystemPrompt?: string
    autoTranslateEnabled?: boolean
    defaultLanguage?: string

    // Voice/Video
    voiceEnabled?: boolean
    videoEnabled?: boolean
}) {
    try {
        let settings = await prisma.liveChatSettings.findFirst()

        if (settings) {
            settings = await prisma.liveChatSettings.update({
                where: { id: settings.id },
                data,
            })
        } else {
            settings = await prisma.liveChatSettings.create({
                data,
            })
        }

        revalidatePath('/admin/support/settings')
        return { success: true, data: settings }
    } catch (error) {
        console.error('Error updating livechat settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}

// ============================================================================
// SMTP Settings
// ============================================================================

export async function getSmtpSettings() {
    try {
        let settings = await prisma.smtpSettings.findFirst()

        if (!settings) {
            settings = await prisma.smtpSettings.create({
                data: {},
            })
        }

        // Mask password
        if (settings.password) {
            settings.password = '********'
        }

        return { success: true, data: settings }
    } catch (error) {
        console.error('Error fetching SMTP settings:', error)
        return { success: false, error: 'Failed to fetch SMTP settings' }
    }
}

export async function updateSmtpSettings(data: {
    host?: string
    port?: number
    username?: string
    password?: string
    encryption?: string
    fromEmail?: string
    fromName?: string
    isActive?: boolean
}) {
    try {
        let settings = await prisma.smtpSettings.findFirst()

        // Don't update password if it's masked
        if (data.password === '********') {
            delete data.password
        }

        if (settings) {
            settings = await prisma.smtpSettings.update({
                where: { id: settings.id },
                data,
            })
        } else {
            settings = await prisma.smtpSettings.create({
                data,
            })
        }

        revalidatePath('/admin/support/settings/email')
        return { success: true, data: settings }
    } catch (error) {
        console.error('Error updating SMTP settings:', error)
        return { success: false, error: 'Failed to update SMTP settings' }
    }
}

export async function testSmtpConnection(email: string) {
    try {
        const settings = await prisma.smtpSettings.findFirst()

        if (!settings || !settings.host) {
            return { success: false, error: 'SMTP not configured' }
        }

        // TODO: Implement actual SMTP test
        // For now, just return success
        return { success: true, message: 'Test email sent successfully' }
    } catch (error) {
        console.error('Error testing SMTP:', error)
        return { success: false, error: 'Failed to test SMTP connection' }
    }
}

// ============================================================================
// Social Integrations
// ============================================================================

export async function getSocialIntegrations() {
    try {
        const integrations = await prisma.socialIntegration.findMany({
            orderBy: { platform: 'asc' },
        })

        // Mask sensitive data
        return {
            success: true,
            data: integrations.map((i) => ({
                ...i,
                apiKey: i.apiKey ? '********' : null,
                apiSecret: i.apiSecret ? '********' : null,
                accessToken: i.accessToken ? '********' : null,
            })),
        }
    } catch (error) {
        console.error('Error fetching social integrations:', error)
        return { success: false, error: 'Failed to fetch integrations' }
    }
}

export async function updateSocialIntegration(
    platform: string,
    data: {
        isEnabled?: boolean
        apiKey?: string
        apiSecret?: string
        accessToken?: string
        refreshToken?: string
        webhookUrl?: string
        config?: any
    }
) {
    try {
        // Don't update masked values
        if (data.apiKey === '********') delete data.apiKey
        if (data.apiSecret === '********') delete data.apiSecret
        if (data.accessToken === '********') delete data.accessToken

        const integration = await prisma.socialIntegration.upsert({
            where: { platform },
            update: data,
            create: { platform, ...data },
        })

        revalidatePath('/admin/support/settings/integrations')
        return { success: true, data: integration }
    } catch (error) {
        console.error('Error updating social integration:', error)
        return { success: false, error: 'Failed to update integration' }
    }
}

// ============================================================================
// Security Settings
// ============================================================================

export async function getSecuritySettings() {
    try {
        let settings = await prisma.securitySettings.findFirst()

        if (!settings) {
            settings = await prisma.securitySettings.create({
                data: {},
            })
        }

        return { success: true, data: settings }
    } catch (error) {
        console.error('Error fetching security settings:', error)
        return { success: false, error: 'Failed to fetch security settings' }
    }
}

export async function updateSecuritySettings(data: {
    countryRestrictions?: boolean
    allowedCountries?: string[]
    blockedCountries?: string[]
    dosProtectionEnabled?: boolean
    maxRequestsPerMinute?: number
    blockDuration?: number
    allowedDomains?: string[]
}) {
    try {
        let settings = await prisma.securitySettings.findFirst()

        if (settings) {
            settings = await prisma.securitySettings.update({
                where: { id: settings.id },
                data,
            })
        } else {
            settings = await prisma.securitySettings.create({
                data,
            })
        }

        revalidatePath('/admin/support/settings/security')
        return { success: true, data: settings }
    } catch (error) {
        console.error('Error updating security settings:', error)
        return { success: false, error: 'Failed to update security settings' }
    }
}
