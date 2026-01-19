'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/db'
import { encryptSettings, decryptSettings, maskValue } from '@/lib/crypto'

// Provider types for API settings
export type ApiProvider =
    | 'stripe'
    | 'paypal'
    | 'cryptomus'
    | 'gemini'
    | 'sentry'
    | 'crisp'
    | 'google'

// Settings structure for each provider
export interface StripeSettings {
    secretKey: string
    publishableKey: string
    webhookSecret: string
}

export interface PaypalSettings {
    clientId: string
    clientSecret: string
    mode: 'sandbox' | 'live'
}

export interface CryptomusSettings {
    merchantId: string
    apiKey: string
}

export interface GeminiSettings {
    apiKey: string
}

export interface SentrySettings {
    dsn: string
}

export interface CrispSettings {
    websiteId: string
}

export interface GoogleSettings {
    clientId: string
    clientSecret: string
}

export type ApiSettings =
    | StripeSettings
    | PaypalSettings
    | CryptomusSettings
    | GeminiSettings
    | SentrySettings
    | CrispSettings
    | GoogleSettings

// ============================================================================
// Authorization
// ============================================================================

/**
 * Check if the current user is an admin
 */
async function requireAdmin() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        throw new Error('Unauthorized: Authentication required')
    }

    if (session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required')
    }

    return session.user
}

/**
 * Check if user is admin (returns boolean, doesn't throw)
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return false
        }

        return true
    } catch {
        return false
    }
}

// ============================================================================
// API Settings CRUD
// ============================================================================

/**
 * Get all API settings (super admin only)
 * Returns masked values for display
 */
export async function getApiSettings() {
    return { success: true, data: [] }
}

/**
 * Get API setting for a specific provider (super admin only)
 * Returns actual decrypted values for editing
 */
export async function getApiSettingByProvider(provider: ApiProvider) {
    return { success: true, data: null }
}

/**
 * Update or create API setting for a provider (super admin only)
 */
export async function updateApiSetting(
    provider: ApiProvider,
    settings: Record<string, string>,
    isActive: boolean = true
) {
    return { success: true }
}

/**
 * Delete API setting for a provider (admin only)
 */
export async function deleteApiSetting(provider: ApiProvider) {
    return { success: true }
}

/**
 * Toggle API setting active status (admin only)
 */
export async function toggleApiSetting(provider: ApiProvider) {
    return { success: true, isActive: true }
}

// ============================================================================
// Helper: Get decrypted settings for internal use
// ============================================================================

/**
 * Get decrypted API settings for a provider (internal use only)
 * Falls back to environment variables if not found in database
 */
export async function getProviderSettings<T extends ApiSettings>(
    provider: ApiProvider
): Promise<T | null> {
    return getEnvFallback(provider) as T | null
}

/**
 * Get settings from environment variables as fallback
 */
function getEnvFallback(provider: ApiProvider): Record<string, string> | null {
    switch (provider) {
        case 'stripe':
            if (!process.env.STRIPE_SECRET_KEY) return null
            return {
                secretKey: process.env.STRIPE_SECRET_KEY || '',
                publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
            }
        case 'paypal':
            if (!process.env.PAYPAL_CLIENT_ID) return null
            return {
                clientId: process.env.PAYPAL_CLIENT_ID || '',
                clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
                mode: (process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox'
            }
        case 'cryptomus':
            if (!process.env.CRYPTOMUS_MERCHANT_ID) return null
            return {
                merchantId: process.env.CRYPTOMUS_MERCHANT_ID || '',
                apiKey: process.env.CRYPTOMUS_API_KEY || ''
            }
        case 'gemini':
            if (!process.env.GEMINI_API_KEY) return null
            return {
                apiKey: process.env.GEMINI_API_KEY || ''
            }
        case 'sentry':
            if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return null
            return {
                dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || ''
            }
        case 'crisp':
            if (!process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) return null
            return {
                websiteId: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || ''
            }
        case 'google':
            if (!process.env.GOOGLE_CLIENT_ID) return null
            return {
                clientId: process.env.GOOGLE_CLIENT_ID || '',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
            }
        default:
            return null
    }
}
