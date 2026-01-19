'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

// ============================================================================
// Address Management
// ============================================================================

/**
 * Get all user addresses
 */
export async function getUserAddresses() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return {
            success: true,
            data: addresses
        }
    } catch (error) {
        console.error('Error fetching addresses:', error)
        return { success: false, error: 'Failed to fetch addresses' }
    }
}

/**
 * Create a new address
 */
export async function createAddress(data: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    isDefault?: boolean
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // If this is the first address or set as default, update other addresses
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false }
            })
        }

        // Check if user has any addresses - if not, make this one default
        const addressCount = await prisma.address.count({
            where: { userId: session.user.id }
        })

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                name: data.name,
                street: data.street,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: data.country,
                isDefault: data.isDefault || addressCount === 0,
            }
        })

        revalidatePath('/account/settings')

        return {
            success: true,
            data: address
        }
    } catch (error) {
        console.error('Error creating address:', error)
        return { success: false, error: 'Failed to create address' }
    }
}

/**
 * Update an existing address
 */
export async function updateAddress(
    id: string,
    data: {
        name?: string
        street?: string
        city?: string
        state?: string
        zip?: string
        country?: string
        isDefault?: boolean
    }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Verify ownership
        const existingAddress = await prisma.address.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!existingAddress) {
            return { success: false, error: 'Address not found' }
        }

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id, NOT: { id } },
                data: { isDefault: false }
            })
        }

        const address = await prisma.address.update({
            where: { id },
            data: {
                name: data.name,
                street: data.street,
                city: data.city,
                state: data.state,
                zip: data.zip,
                country: data.country,
                isDefault: data.isDefault,
            }
        })

        revalidatePath('/account/settings')

        return {
            success: true,
            data: address
        }
    } catch (error) {
        console.error('Error updating address:', error)
        return { success: false, error: 'Failed to update address' }
    }
}

/**
 * Delete an address
 */
export async function deleteAddress(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Verify ownership
        const address = await prisma.address.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!address) {
            return { success: false, error: 'Address not found' }
        }

        await prisma.address.delete({ where: { id } })

        // If deleted address was default, set next one as default
        if (address.isDefault) {
            const nextAddress = await prisma.address.findFirst({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'asc' }
            })

            if (nextAddress) {
                await prisma.address.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true }
                })
            }
        }

        revalidatePath('/account/settings')

        return { success: true }
    } catch (error) {
        console.error('Error deleting address:', error)
        return { success: false, error: 'Failed to delete address' }
    }
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Verify ownership
        const address = await prisma.address.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!address) {
            return { success: false, error: 'Address not found' }
        }

        // Unset other defaults
        await prisma.address.updateMany({
            where: { userId: session.user.id },
            data: { isDefault: false }
        })

        // Set this as default
        await prisma.address.update({
            where: { id },
            data: { isDefault: true }
        })

        revalidatePath('/account/settings')

        return { success: true }
    } catch (error) {
        console.error('Error setting default address:', error)
        return { success: false, error: 'Failed to set default address' }
    }
}

// ============================================================================
// Location Settings
// ============================================================================

/**
 * Get user's location settings
 */
export async function getLocationSettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                softwarePreferences: true, // We'll use this JSON field for location settings
            }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        // Parse location from softwarePreferences or use defaults
        const prefs = user.softwarePreferences as Record<string, any> || {}

        return {
            success: true,
            data: {
                region: prefs.region || 'United States',
                language: prefs.language || 'English (US)',
                currency: prefs.currency || 'USD'
            }
        }
    } catch (error) {
        console.error('Error fetching location settings:', error)
        return { success: false, error: 'Failed to fetch location settings' }
    }
}

/**
 * Update user's location settings
 */
export async function updateLocationSettings(data: {
    region?: string
    language?: string
    currency?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    region: data.region || currentPrefs.region,
                    language: data.language || currentPrefs.language,
                    currency: data.currency || currentPrefs.currency,
                }
            }
        })

        revalidatePath('/account/settings')

        return { success: true }
    } catch (error) {
        console.error('Error updating location settings:', error)
        return { success: false, error: 'Failed to update location settings' }
    }
}

// ============================================================================
// Communication Preferences
// ============================================================================

/**
 * Get user's communication preferences
 */
export async function getCommunicationPreferences() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const prefs = (user.softwarePreferences as Record<string, any>) || {}

        return {
            success: true,
            data: {
                postalMail: prefs.postalMail || false,
                phoneCalls: prefs.phoneCalls || false,
                emailNotifications: prefs.emailNotifications !== false, // Default true
                orderUpdates: prefs.orderUpdates !== false, // Default true
                promotions: prefs.promotions || false,
                reviewReminders: prefs.reviewReminders !== false, // Default true
            }
        }
    } catch (error) {
        console.error('Error fetching communication preferences:', error)
        return { success: false, error: 'Failed to fetch communication preferences' }
    }
}

/**
 * Update user's communication preferences
 */
export async function updateCommunicationPreferences(data: {
    postalMail?: boolean
    phoneCalls?: boolean
    emailNotifications?: boolean
    orderUpdates?: boolean
    promotions?: boolean
    reviewReminders?: boolean
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    postalMail: data.postalMail ?? currentPrefs.postalMail,
                    phoneCalls: data.phoneCalls ?? currentPrefs.phoneCalls,
                    emailNotifications: data.emailNotifications ?? currentPrefs.emailNotifications,
                    orderUpdates: data.orderUpdates ?? currentPrefs.orderUpdates,
                    promotions: data.promotions ?? currentPrefs.promotions,
                    reviewReminders: data.reviewReminders ?? currentPrefs.reviewReminders,
                }
            }
        })

        revalidatePath('/account/settings')

        return { success: true }
    } catch (error) {
        console.error('Error updating communication preferences:', error)
        return { success: false, error: 'Failed to update communication preferences' }
    }
}

// ============================================================================
// Account Management
// ============================================================================

/**
 * Close user account (soft delete)
 */
export async function closeUserAccount(reason: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (!reason) {
            return { success: false, error: 'Please provide a reason for closing your account' }
        }

        // Get current user preferences
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        // Soft delete - mark account as closed
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    isActive: false,
                    closedAt: new Date().toISOString(),
                    closedReason: reason,
                }
            }
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'ACCOUNT_CLOSED',
                entity: 'User',
                entityId: session.user.id,
                changes: { reason }
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error closing account:', error)
        return { success: false, error: 'Failed to close account' }
    }
}

/**
 * Reopen a closed account
 */
export async function reopenUserAccount() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        if (currentPrefs.isActive !== false) {
            return { success: false, error: 'Account is not closed' }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    isActive: true,
                    closedAt: null,
                    closedReason: null,
                    reopenedAt: new Date().toISOString(),
                }
            }
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'ACCOUNT_REOPENED',
                entity: 'User',
                entityId: session.user.id,
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error reopening account:', error)
        return { success: false, error: 'Failed to reopen account' }
    }
}

/**
 * Update user email (with password verification)
 */
export async function updateEmail(newEmail: string, password: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (!newEmail || !password) {
            return { success: false, error: 'Email and password are required' }
        }

        // Import bcrypt dynamically to avoid issues
        const bcrypt = await import('bcryptjs')

        // Verify current password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true, email: true }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        if (!user.password) {
            return { success: false, error: 'Cannot change email for OAuth accounts' }
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return { success: false, error: 'Invalid password' }
        }

        if (user.email === newEmail) {
            return { success: false, error: 'New email is the same as current email' }
        }

        // Check if email is already taken
        const existingUser = await prisma.user.findUnique({
            where: { email: newEmail }
        })

        if (existingUser) {
            return { success: false, error: 'Email is already in use' }
        }

        // Update email
        await prisma.user.update({
            where: { id: session.user.id },
            data: { email: newEmail }
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'EMAIL_CHANGED',
                entity: 'User',
                entityId: session.user.id,
                changes: { oldEmail: user.email, newEmail }
            }
        })

        revalidatePath('/account/settings')

        return { success: true }
    } catch (error) {
        console.error('Error updating email:', error)
        return { success: false, error: 'Failed to update email' }
    }
}

/**
 * Get full user settings overview
 */
export async function getUserSettingsOverview() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const [user, addressCount] = await Promise.all([
            prisma.user.findUnique({
                where: { id: session.user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    softwarePreferences: true,
                    twoFactorEnabled: true,
                    accountType: true,
                }
            }),
            prisma.address.count({
                where: { userId: session.user.id }
            })
        ])

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const prefs = (user.softwarePreferences as Record<string, any>) || {}

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    memberSince: user.createdAt.toISOString(),
                    twoFactorEnabled: user.twoFactorEnabled,
                    accountType: user.accountType,
                },
                location: {
                    region: prefs.region || 'United States',
                    language: prefs.language || 'English (US)',
                    currency: prefs.currency || 'USD',
                },
                communication: {
                    postalMail: prefs.postalMail || false,
                    phoneCalls: prefs.phoneCalls || false,
                    emailNotifications: prefs.emailNotifications !== false,
                    orderUpdates: prefs.orderUpdates !== false,
                    promotions: prefs.promotions || false,
                },
                addressCount,
                isAccountActive: prefs.isActive !== false,
            }
        }
    } catch (error) {
        console.error('Error fetching user settings overview:', error)
        return { success: false, error: 'Failed to fetch settings overview' }
    }
}

// ============================================================================
// Notification Settings
// ============================================================================

/**
 * Get full notification preferences
 */
export async function getNotificationSettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                softwarePreferences: true,
                vendors: {
                    select: {
                        notificationSetting: true
                    }
                }
            }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const prefs = (user.softwarePreferences as Record<string, any>) || {}
        const vendorNotifications = user.vendors?.notificationSetting

        return {
            success: true,
            data: {
                // General notifications
                emailNotifications: prefs.emailNotifications !== false,
                orderUpdates: prefs.orderUpdates !== false,
                promotions: prefs.promotions || false,
                reviewReminders: prefs.reviewReminders !== false,
                securityAlerts: prefs.securityAlerts !== false,
                newsletterSubscribed: prefs.newsletterSubscribed || false,
                // Communication
                postalMail: prefs.postalMail || false,
                phoneCalls: prefs.phoneCalls || false,
                // Frequency
                emailFrequency: prefs.emailFrequency || 'immediate', // immediate, daily, weekly
                // Vendor-specific (if user is vendor)
                vendorNotifications: vendorNotifications ? {
                    emailNotifications: vendorNotifications.emailNotifications,
                    orderNotifications: vendorNotifications.orderNotifications,
                    productNotifications: vendorNotifications.productNotifications,
                    marketingNotifications: vendorNotifications.marketingNotifications,
                } : null
            }
        }
    } catch (error) {
        console.error('Error fetching notification settings:', error)
        return { success: false, error: 'Failed to fetch notification settings' }
    }
}

/**
 * Update notification preferences
 */
export async function updateNotificationSettings(data: {
    emailNotifications?: boolean
    orderUpdates?: boolean
    promotions?: boolean
    reviewReminders?: boolean
    securityAlerts?: boolean
    newsletterSubscribed?: boolean
    postalMail?: boolean
    phoneCalls?: boolean
    emailFrequency?: 'immediate' | 'daily' | 'weekly'
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    emailNotifications: data.emailNotifications ?? currentPrefs.emailNotifications,
                    orderUpdates: data.orderUpdates ?? currentPrefs.orderUpdates,
                    promotions: data.promotions ?? currentPrefs.promotions,
                    reviewReminders: data.reviewReminders ?? currentPrefs.reviewReminders,
                    securityAlerts: data.securityAlerts ?? currentPrefs.securityAlerts,
                    newsletterSubscribed: data.newsletterSubscribed ?? currentPrefs.newsletterSubscribed,
                    postalMail: data.postalMail ?? currentPrefs.postalMail,
                    phoneCalls: data.phoneCalls ?? currentPrefs.phoneCalls,
                    emailFrequency: data.emailFrequency ?? currentPrefs.emailFrequency,
                }
            }
        })

        revalidatePath('/account/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating notification settings:', error)
        return { success: false, error: 'Failed to update notification settings' }
    }
}

// ============================================================================
// Privacy Settings
// ============================================================================

/**
 * Get user's privacy settings
 */
export async function getPrivacySettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const prefs = (user.softwarePreferences as Record<string, any>) || {}

        return {
            success: true,
            data: {
                profileVisibility: prefs.profileVisibility || 'public', // public, private
                showPurchaseHistory: prefs.showPurchaseHistory !== false, // default true
                showReviews: prefs.showReviews !== false, // default true
                showWishlist: prefs.showWishlist || false, // default false
                allowMessageFromAnyone: prefs.allowMessageFromAnyone !== false,
                showOnlineStatus: prefs.showOnlineStatus || false,
                deletionRequested: prefs.deletionRequested || false,
                deletionRequestedAt: prefs.deletionRequestedAt || null,
            }
        }
    } catch (error) {
        console.error('Error fetching privacy settings:', error)
        return { success: false, error: 'Failed to fetch privacy settings' }
    }
}

/**
 * Update user's privacy settings
 */
export async function updatePrivacySettings(data: {
    profileVisibility?: 'public' | 'private'
    showPurchaseHistory?: boolean
    showReviews?: boolean
    showWishlist?: boolean
    allowMessageFromAnyone?: boolean
    showOnlineStatus?: boolean
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    profileVisibility: data.profileVisibility ?? currentPrefs.profileVisibility,
                    showPurchaseHistory: data.showPurchaseHistory ?? currentPrefs.showPurchaseHistory,
                    showReviews: data.showReviews ?? currentPrefs.showReviews,
                    showWishlist: data.showWishlist ?? currentPrefs.showWishlist,
                    allowMessageFromAnyone: data.allowMessageFromAnyone ?? currentPrefs.allowMessageFromAnyone,
                    showOnlineStatus: data.showOnlineStatus ?? currentPrefs.showOnlineStatus,
                }
            }
        })

        revalidatePath('/account/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating privacy settings:', error)
        return { success: false, error: 'Failed to update privacy settings' }
    }
}

/**
 * Request account data export (GDPR)
 */
export async function requestDataExport() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const [user, addresses, orders, reviews, wishlist] = await Promise.all([
            prisma.user.findUnique({
                where: { id: session.user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    softwarePreferences: true,
                    accountType: true,
                }
            }),
            prisma.address.findMany({
                where: { userId: session.user.id }
            }),
            prisma.order.findMany({
                where: { userId: session.user.id },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { name: true, price: true }
                            }
                        }
                    }
                }
            }),
            prisma.review.findMany({
                where: { userId: session.user.id },
                include: {
                    product: {
                        select: { name: true }
                    }
                }
            }),
            prisma.wishlist.findMany({
                where: { userId: session.user.id },
                include: {
                    product: {
                        select: { name: true, price: true }
                    }
                }
            })
        ])

        const exportData = {
            exportedAt: new Date().toISOString(),
            profile: user,
            addresses,
            orders: orders.map(o => ({
                id: o.id,
                totalAmount: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt,
                items: o.items.map(i => ({
                    productName: i.product.name,
                    quantity: i.quantity,
                    price: i.price
                }))
            })),
            reviews: reviews.map(r => ({
                productName: r.product.name,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt
            })),
            wishlist: wishlist.map(w => ({
                productName: w.product.name,
                price: w.product.price,
                addedAt: w.createdAt
            }))
        }

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'DATA_EXPORT_REQUESTED',
                entity: 'User',
                entityId: session.user.id,
            }
        })

        return {
            success: true,
            data: exportData
        }
    } catch (error) {
        console.error('Error exporting user data:', error)
        return { success: false, error: 'Failed to export data' }
    }
}

/**
 * Request account deletion
 */
export async function requestAccountDeletion(reason: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        if (!reason) {
            return { success: false, error: 'Please provide a reason' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    deletionRequested: true,
                    deletionRequestedAt: new Date().toISOString(),
                    deletionReason: reason,
                }
            }
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'ACCOUNT_DELETION_REQUESTED',
                entity: 'User',
                entityId: session.user.id,
                changes: { reason }
            }
        })

        return { success: true, message: 'Deletion request submitted. Your account will be deleted within 30 days.' }
    } catch (error) {
        console.error('Error requesting account deletion:', error)
        return { success: false, error: 'Failed to submit deletion request' }
    }
}

/**
 * Cancel account deletion request
 */
export async function cancelDeletionRequest() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        if (!currentPrefs.deletionRequested) {
            return { success: false, error: 'No deletion request found' }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                softwarePreferences: {
                    ...currentPrefs,
                    deletionRequested: false,
                    deletionRequestedAt: null,
                    deletionReason: null,
                    deletionCancelledAt: new Date().toISOString(),
                }
            }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: 'ACCOUNT_DELETION_CANCELLED',
                entity: 'User',
                entityId: session.user.id,
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error cancelling deletion request:', error)
        return { success: false, error: 'Failed to cancel deletion request' }
    }
}

// ============================================================================
// Public Profile Settings
// ============================================================================

/**
 * Get user's public profile settings
 */
export async function getPublicProfileSettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                softwarePreferences: true,
                vendors: {
                    select: {
                        id: true,
                        name: true,
                        bio: true,
                        location: true,
                        socialLinks: true,
                        avatar: true,
                        coverImage: true,
                    }
                }
            }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        const prefs = (user.softwarePreferences as Record<string, any>) || {}
        const vendor = user.vendors

        return {
            success: true,
            data: {
                displayName: user.name || '',
                email: user.email,
                avatar: user.image || '',
                bio: prefs.bio || '',
                location: prefs.location || '',
                website: prefs.website || '',
                socialLinks: prefs.socialLinks || {},
                // Vendor-specific
                isVendor: !!vendor,
                vendorProfile: vendor ? {
                    shopName: vendor.name,
                    shopBio: vendor.bio,
                    shopLocation: vendor.location,
                    shopAvatar: vendor.avatar,
                    shopCover: vendor.coverImage,
                    shopSocialLinks: vendor.socialLinks,
                } : null
            }
        }
    } catch (error) {
        console.error('Error fetching public profile settings:', error)
        return { success: false, error: 'Failed to fetch public profile' }
    }
}

/**
 * Update user's public profile
 */
export async function updatePublicProfile(data: {
    displayName?: string
    bio?: string
    location?: string
    website?: string
    socialLinks?: Record<string, string>
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { softwarePreferences: true }
        })

        const currentPrefs = (user?.softwarePreferences as Record<string, any>) || {}

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.displayName,
                softwarePreferences: {
                    ...currentPrefs,
                    bio: data.bio ?? currentPrefs.bio,
                    location: data.location ?? currentPrefs.location,
                    website: data.website ?? currentPrefs.website,
                    socialLinks: data.socialLinks ?? currentPrefs.socialLinks,
                }
            }
        })

        revalidatePath('/account/settings')
        revalidatePath('/account/profile')

        return { success: true }
    } catch (error) {
        console.error('Error updating public profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

/**
 * Update profile avatar
 */
export async function updateProfileAvatar(imageUrl: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        })

        revalidatePath('/account/settings')
        revalidatePath('/account/profile')

        return { success: true }
    } catch (error) {
        console.error('Error updating avatar:', error)
        return { success: false, error: 'Failed to update avatar' }
    }
}
