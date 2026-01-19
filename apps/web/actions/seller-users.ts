'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import crypto from 'crypto'

// ============================================================================
// Store Users Management
// ============================================================================

/**
 * Get the current seller's vendor ID
 */
async function getVendorId(): Promise<{ success: true; vendorId: string } | { success: false; error: string }> {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return { success: false, error: 'Unauthorized - Please sign in' }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { vendors: true }
        })

        if (!user?.vendors) {
            return { success: false, error: 'No store found - You need to create a store first' }
        }

        return { success: true, vendorId: user.vendors.id }
    } catch (error) {
        console.error('Error getting vendor ID:', error)
        return { success: false, error: 'Failed to get store information' }
    }
}

/**
 * Get all store users for the current store
 */
export async function getStoreUsers() {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        const storeUsers = await (prisma as any).storeUser.findMany({
            where: { vendorId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        twoFactorEnabled: true,
                    }
                },
                role: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Also get the store owner
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        twoFactorEnabled: true,
                    }
                }
            }
        })

        const formattedUsers = storeUsers.map((su: any) => ({
            id: su.id,
            name: su.user?.name || su.email.split('@')[0],
            email: su.email,
            image: su.user?.image || null,
            status: su.status,
            role: su.role.name,
            roleId: su.role.id,
            has2FA: su.user?.twoFactorEnabled || su.has2FA,
            lastActiveAt: su.lastActiveAt,
            createdAt: su.createdAt,
        }))

        // Add store owner at the beginning
        if (vendor?.user) {
            formattedUsers.unshift({
                id: 'owner',
                name: vendor.user.name || vendor.user.email.split('@')[0],
                email: vendor.user.email,
                image: vendor.user.image,
                status: 'ACTIVE' as const,
                role: 'Store owner',
                roleId: 'owner',
                has2FA: vendor.user.twoFactorEnabled,
                lastActiveAt: new Date(),
                createdAt: vendor.createdAt,
            })
        }

        return { success: true, data: formattedUsers }
    } catch (error) {
        console.error('Error fetching store users:', error)
        return { success: false, error: 'Failed to fetch store users' }
    }
}

/**
 * Invite a new team member to the store
 */
export async function inviteStoreUser(email: string, roleId: string) {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        // Check if user already exists in store
        const existingStoreUser = await (prisma as any).storeUser.findUnique({
            where: {
                vendorId_email: {
                    vendorId,
                    email,
                }
            }
        })

        if (existingStoreUser) {
            return { success: false, error: 'User already invited to this store' }
        }

        // Check if role exists
        const role = await (prisma as any).storeRole.findUnique({
            where: { id: roleId }
        })

        if (!role || role.vendorId !== vendorId) {
            return { success: false, error: 'Invalid role' }
        }

        // Check if user exists in the system
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        // Generate invite token
        const inviteToken = crypto.randomBytes(32).toString('hex')
        const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        // Create store user
        const storeUser = await (prisma as any).storeUser.create({
            data: {
                vendorId,
                userId: existingUser?.id || null,
                email,
                roleId,
                status: existingUser ? 'ACTIVE' : 'PENDING',
                inviteToken: existingUser ? null : inviteToken,
                inviteExpiresAt: existingUser ? null : inviteExpiresAt,
                has2FA: existingUser?.twoFactorEnabled || false,
            },
            include: {
                role: {
                    select: { name: true }
                }
            }
        })

        // TODO: Send invitation email if user doesn't exist

        revalidatePath('/seller/settings/users')
        return {
            success: true,
            data: {
                id: storeUser.id,
                email: storeUser.email,
                role: storeUser.role.name,
                status: storeUser.status,
            }
        }
    } catch (error) {
        console.error('Error inviting store user:', error)
        return { success: false, error: 'Failed to invite user' }
    }
}

/**
 * Update a store user's role or status
 */
export async function updateStoreUser(
    storeUserId: string,
    data: { roleId?: string; status?: 'ACTIVE' | 'INACTIVE' }
) {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        // Verify the store user belongs to this vendor
        const storeUser = await (prisma as any).storeUser.findUnique({
            where: { id: storeUserId }
        })

        if (!storeUser || storeUser.vendorId !== vendorId) {
            return { success: false, error: 'User not found' }
        }

        // If updating role, verify it exists and belongs to vendor
        if (data.roleId) {
            const role = await (prisma as any).storeRole.findUnique({
                where: { id: data.roleId }
            })

            if (!role || role.vendorId !== vendorId) {
                return { success: false, error: 'Invalid role' }
            }
        }

        const updated = await (prisma as any).storeUser.update({
            where: { id: storeUserId },
            data: {
                roleId: data.roleId,
                status: data.status,
            }
        })

        revalidatePath('/seller/settings/users')
        return { success: true, data: updated }
    } catch (error) {
        console.error('Error updating store user:', error)
        return { success: false, error: 'Failed to update user' }
    }
}

/**
 * Remove a team member from the store
 */
export async function removeStoreUser(storeUserId: string) {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        // Verify the store user belongs to this vendor
        const storeUser = await (prisma as any).storeUser.findUnique({
            where: { id: storeUserId }
        })

        if (!storeUser || storeUser.vendorId !== vendorId) {
            return { success: false, error: 'User not found' }
        }

        await (prisma as any).storeUser.delete({
            where: { id: storeUserId }
        })

        revalidatePath('/seller/settings/users')
        return { success: true }
    } catch (error) {
        console.error('Error removing store user:', error)
        return { success: false, error: 'Failed to remove user' }
    }
}

// ============================================================================
// Store Roles Management
// ============================================================================

// Default permissions that can be assigned to roles
const STORE_PERMISSIONS = [
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'orders.view',
    'orders.manage',
    'customers.view',
    'customers.manage',
    'analytics.view',
    'settings.view',
    'settings.edit',
    'team.view',
    'team.manage',
    'discounts.view',
    'discounts.manage',
    'support.view',
    'support.respond',
] as const

// Default system roles
const SYSTEM_ROLES = [
    {
        name: 'Administrator',
        description: 'Full access to all store features',
        permissions: [...STORE_PERMISSIONS],
    },
    {
        name: 'Customer support',
        description: 'Can view and respond to customer inquiries',
        permissions: ['customers.view', 'orders.view', 'support.view', 'support.respond'],
    },
    {
        name: 'Marketer',
        description: 'Can manage discounts and view analytics',
        permissions: ['products.view', 'analytics.view', 'discounts.view', 'discounts.manage'],
    },
    {
        name: 'Merchandiser',
        description: 'Can manage products and inventory',
        permissions: ['products.view', 'products.create', 'products.edit', 'orders.view'],
    },
    {
        name: 'Online store editor',
        description: 'Can edit store settings and appearance',
        permissions: ['settings.view', 'settings.edit', 'products.view'],
    },
    {
        name: 'App developer',
        description: 'Can access API settings',
        permissions: ['settings.view'],
    },
]

/**
 * Get all roles for the current store (creates system roles if needed)
 */
export async function getStoreRoles() {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        // Check if system roles exist, create if not
        const existingRoles = await (prisma as any).storeRole.findMany({
            where: { vendorId }
        })

        if (existingRoles.length === 0) {
            // Create system roles for this store
            await (prisma as any).storeRole.createMany({
                data: SYSTEM_ROLES.map(role => ({
                    vendorId,
                    name: role.name,
                    description: role.description,
                    permissions: role.permissions,
                    isSystem: true,
                }))
            })
        }

        const roles = await (prisma as any).storeRole.findMany({
            where: { vendorId },
            include: {
                _count: {
                    select: { storeUsers: true }
                }
            },
            orderBy: [
                { isSystem: 'desc' },
                { name: 'asc' }
            ]
        })

        return {
            success: true,
            data: roles.map((role: any) => ({
                id: role.id,
                name: role.name,
                description: role.description,
                permissions: role.permissions as string[],
                isSystem: role.isSystem,
                userCount: role._count.storeUsers,
            }))
        }
    } catch (error) {
        console.error('Error fetching store roles:', error)
        return { success: false, error: 'Failed to fetch roles' }
    }
}

/**
 * Create a custom role
 */
export async function createStoreRole(
    name: string,
    permissions: string[],
    description?: string
) {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        // Check if role name already exists
        const existing = await (prisma as any).storeRole.findUnique({
            where: {
                vendorId_name: {
                    vendorId,
                    name,
                }
            }
        })

        if (existing) {
            return { success: false, error: 'Role with this name already exists' }
        }

        const role = await (prisma as any).storeRole.create({
            data: {
                vendorId,
                name,
                description,
                permissions,
                isSystem: false,
            }
        })

        revalidatePath('/seller/settings/users/roles')
        return { success: true, data: role }
    } catch (error) {
        console.error('Error creating store role:', error)
        return { success: false, error: 'Failed to create role' }
    }
}

/**
 * Update a custom role
 */
export async function updateStoreRole(
    roleId: string,
    data: { name?: string; permissions?: string[]; description?: string }
) {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        const role = await (prisma as any).storeRole.findUnique({
            where: { id: roleId }
        })

        if (!role || role.vendorId !== vendorId) {
            return { success: false, error: 'Role not found' }
        }

        if (role.isSystem) {
            return { success: false, error: 'Cannot modify system roles' }
        }

        // Check for name conflicts
        if (data.name && data.name !== role.name) {
            const existing = await (prisma as any).storeRole.findUnique({
                where: {
                    vendorId_name: {
                        vendorId,
                        name: data.name,
                    }
                }
            })

            if (existing) {
                return { success: false, error: 'Role with this name already exists' }
            }
        }

        const updated = await (prisma as any).storeRole.update({
            where: { id: roleId },
            data: {
                name: data.name,
                description: data.description,
                permissions: data.permissions,
            }
        })

        revalidatePath('/seller/settings/users/roles')
        return { success: true, data: updated }
    } catch (error) {
        console.error('Error updating store role:', error)
        return { success: false, error: 'Failed to update role' }
    }
}

/**
 * Delete a custom role
 */
export async function deleteStoreRole(roleId: string) {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        const role = await (prisma as any).storeRole.findUnique({
            where: { id: roleId },
            include: {
                _count: {
                    select: { storeUsers: true }
                }
            }
        })

        if (!role || role.vendorId !== vendorId) {
            return { success: false, error: 'Role not found' }
        }

        if (role.isSystem) {
            return { success: false, error: 'Cannot delete system roles' }
        }

        if (role._count.storeUsers > 0) {
            return { success: false, error: 'Cannot delete role with assigned users' }
        }

        await (prisma as any).storeRole.delete({
            where: { id: roleId }
        })

        revalidatePath('/seller/settings/users/roles')
        return { success: true }
    } catch (error) {
        console.error('Error deleting store role:', error)
        return { success: false, error: 'Failed to delete role' }
    }
}

/**
 * Export store users to CSV format
 */
export async function exportStoreUsers() {
    try {
        const vendorResult = await getVendorId()
        if (!vendorResult.success) {
            return { success: false, error: vendorResult.error }
        }
        const vendorId = vendorResult.vendorId

        const storeUsers = await (prisma as any).storeUser.findMany({
            where: { vendorId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                role: {
                    select: { name: true }
                }
            }
        })

        // Generate CSV
        const headers = ['Name', 'Email', 'Role', 'Status', 'Joined']
        const rows = storeUsers.map((su: any) => [
            su.user?.name || su.email.split('@')[0],
            su.email,
            su.role.name,
            su.status,
            su.createdAt.toISOString().split('T')[0],
        ])

        const csv = [
            headers.join(','),
            ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(','))
        ].join('\n')

        return { success: true, data: csv }
    } catch (error) {
        console.error('Error exporting store users:', error)
        return { success: false, error: 'Failed to export users' }
    }
}
