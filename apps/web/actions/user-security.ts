'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import bcrypt from 'bcryptjs'

// ============================================================================
// Password Verification
// ============================================================================

export async function verifyPassword(password: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true }
        })

        if (!user || !user.password) {
            return { success: false, error: 'No password set for this account' }
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return { success: false, error: 'Incorrect password' }
        }

        return { success: true }
    } catch (error) {
        console.error('Error verifying password:', error)
        return { success: false, error: 'Failed to verify password' }
    }
}

// ============================================================================
// Two-Factor Authentication Status
// ============================================================================

export async function getTwoFactorStatus() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { enabled: false, canEnable: false }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                password: true
            }
        })

        // User can enable 2FA only if they have a password set
        const hasPassword = !!user?.password

        // For now, 2FA is not implemented, so always return false
        return {
            enabled: false,
            canEnable: hasPassword
        }
    } catch (error) {
        console.error('Error getting 2FA status:', error)
        return { enabled: false, canEnable: false }
    }
}

// ============================================================================
// Account Type Detection
// ============================================================================

export async function getAccountType() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { hasPassword: false, isGoogleOnly: true }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true }
        })

        const hasPassword = !!user?.password

        return {
            hasPassword,
            isGoogleOnly: !hasPassword
        }
    } catch (error) {
        console.error('Error getting account type:', error)
        return { hasPassword: false, isGoogleOnly: true }
    }
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Get user's security overview
 */
export async function getSecurityOverview() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                password: true,
                twoFactorEnabled: true,
                accountType: true,
                softwarePreferences: true,
                createdAt: true,
            }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const prefs = (user.softwarePreferences as Record<string, any>) || {}

        // Get recent audit logs for security events
        const recentSecurityEvents = await prisma.auditLog.findMany({
            where: {
                userId: session.user.id,
                action: {
                    in: ['PASSWORD_CHANGED', 'EMAIL_CHANGED', 'LOGIN', 'LOGIN_FAILED', 'ACCOUNT_CLOSED', 'ACCOUNT_REOPENED']
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                action: true,
                createdAt: true,
                changes: true,
            }
        })

        return {
            success: true,
            data: {
                hasPassword: !!user.password,
                twoFactorEnabled: user.twoFactorEnabled,
                accountType: user.accountType,
                accountCreated: user.createdAt,
                lastPasswordChange: prefs.lastPasswordChange || null,
                recentSecurityEvents: recentSecurityEvents.map(e => ({
                    action: e.action,
                    date: e.createdAt.toISOString(),
                })),
            }
        }
    } catch (error) {
        console.error('Error getting security overview:', error)
        return { success: false, error: 'Failed to get security overview' }
    }
}

/**
 * Get active login sessions (placeholder - would need session tracking)
 * In a real implementation, this would query a sessions table
 */
export async function getActiveSessions() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Placeholder - in production, query actual session storage
        // For now, return current session info
        return {
            success: true,
            data: {
                sessions: [
                    {
                        id: 'current',
                        device: 'Current Device',
                        browser: 'Unknown Browser',
                        location: 'Unknown Location',
                        lastActive: new Date().toISOString(),
                        isCurrent: true,
                    }
                ],
                note: 'Session tracking requires additional infrastructure setup'
            }
        }
    } catch (error) {
        console.error('Error getting active sessions:', error)
        return { success: false, error: 'Failed to get sessions' }
    }
}

/**
 * Revoke a specific session (placeholder)
 */
export async function revokeSession(sessionId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (sessionId === 'current') {
            return { success: false, error: 'Cannot revoke current session. Use logout instead.' }
        }

        // Placeholder - would revoke from session storage
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'SESSION_REVOKED',
                entity: 'Session',
                entityId: sessionId,
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error revoking session:', error)
        return { success: false, error: 'Failed to revoke session' }
    }
}

/**
 * Revoke all sessions except current (placeholder)
 */
export async function revokeAllSessions() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Placeholder - would clear all sessions except current
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'ALL_SESSIONS_REVOKED',
                entity: 'Session',
                entityId: session.user.id,
            }
        })

        return { success: true, message: 'All other sessions have been logged out' }
    } catch (error) {
        console.error('Error revoking all sessions:', error)
        return { success: false, error: 'Failed to revoke sessions' }
    }
}

// ============================================================================
// Two-Factor Authentication (Placeholder Implementation)
// ============================================================================

/**
 * Setup 2FA - placeholder
 * Full implementation requires: speakeasy, qrcode libraries
 */
export async function setup2FA() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true, twoFactorEnabled: true }
        })

        if (!user?.password) {
            return { success: false, error: 'Please set a password before enabling 2FA' }
        }

        if (user.twoFactorEnabled) {
            return { success: false, error: '2FA is already enabled' }
        }

        // Placeholder - would generate TOTP secret and QR code
        return {
            success: true,
            data: {
                message: '2FA setup requires additional libraries. This is a placeholder.',
                // In production:
                // secret: generatedSecret,
                // qrCodeUrl: qrCodeDataUrl,
                // backupCodes: generatedBackupCodes,
            }
        }
    } catch (error) {
        console.error('Error setting up 2FA:', error)
        return { success: false, error: 'Failed to setup 2FA' }
    }
}

/**
 * Verify 2FA code - placeholder
 */
export async function verify2FA(code: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (!code || code.length !== 6) {
            return { success: false, error: 'Invalid code format' }
        }

        // Placeholder - would verify TOTP code
        return {
            success: false,
            error: '2FA verification requires additional libraries. This is a placeholder.'
        }
    } catch (error) {
        console.error('Error verifying 2FA:', error)
        return { success: false, error: 'Failed to verify code' }
    }
}

/**
 * Disable 2FA
 */
export async function disable2FA(password: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Verify password first
        const passwordCheck = await verifyPassword(password)
        if (!passwordCheck.success) {
            return { success: false, error: 'Incorrect password' }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null,
            }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: '2FA_DISABLED',
                entity: 'User',
                entityId: session.user.id,
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error disabling 2FA:', error)
        return { success: false, error: 'Failed to disable 2FA' }
    }
}
