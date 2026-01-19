import { Role } from '@prisma/client'

/**
 * Permission definitions for each role
 */
export const PERMISSIONS = {
    ADMIN: {
        MANAGE_COLLECTIONS: true,
        MANAGE_CATEGORIES: true,
        MANAGE_ALL_PRODUCTS: true,
        MANAGE_VENDORS: true,
        APPROVE_PAYOUTS: true,
        VIEW_ALL_ANALYTICS: true,
        MANAGE_USERS: true,
        MANAGE_SETTINGS: true,
        VIEW_ALL_ORDERS: true,
        MANAGE_DISPUTES: true,
    },
    VENDOR: {
        MANAGE_OWN_PRODUCTS: true,
        VIEW_OWN_ANALYTICS: true,
        REQUEST_PAYOUTS: true,
        MANAGE_PROFILE: true,
        VIEW_OWN_ORDERS: true,
        RESPOND_TO_MESSAGES: true,
        MANAGE_STOREFRONT: true,
    },
    CUSTOMER: {
        BROWSE_PRODUCTS: true,
        PURCHASE: true,
        REVIEW: true,
        OPEN_DISPUTES: true,
        MANAGE_WISHLIST: true,
        VIEW_OWN_ORDERS: true,
        SEND_MESSAGES: true,
    },
} as const

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: string): boolean {
    if (role === 'ADMIN') {
        return PERMISSIONS.ADMIN[permission as keyof typeof PERMISSIONS.ADMIN] || false
    }
    if (role === 'VENDOR') {
        return PERMISSIONS.VENDOR[permission as keyof typeof PERMISSIONS.VENDOR] || false
    }
    if (role === 'CUSTOMER') {
        return PERMISSIONS.CUSTOMER[permission as keyof typeof PERMISSIONS.CUSTOMER] || false
    }
    return false
}

/**
 * Check if user can manage a specific product
 */
export async function canManageProduct(
    userId: string,
    productId: string,
    prisma: any
): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
                vendors: {
                    select: { id: true },
                },
            },
        })

        if (!user) return false

        // Admins can manage all products
        if (user.role === 'ADMIN') return true

        // Vendors can only manage their own products
        if (user.role === 'VENDOR' && user.vendors) {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: { vendorId: true },
            })

            return product?.vendorId === user.vendors.id
        }

        return false
    } catch (error) {
        console.error('Error checking product ownership:', error)
        return false
    }
}

/**
 * Check if user is admin
 */
export function isAdmin(role: Role): boolean {
    return role === 'ADMIN'
}

/**
 * Check if user is vendor
 */
export function isVendor(role: Role): boolean {
    return role === 'VENDOR'
}

/**
 * Check if user is customer
 */
export function isCustomer(role: Role): boolean {
    return role === 'CUSTOMER'
}

/**
 * Get allowed routes for a role
 */
export function getAllowedRoutes(role: Role): string[] {
    const routes: string[] = []

    if (role === 'ADMIN') {
        routes.push(
            '/admin',
            '/admin/collections',
            '/admin/categories',
            '/admin/vendors',
            '/admin/payouts',
            '/admin/products',
            '/admin/orders',
            '/admin/users',
            '/admin/settings'
        )
    }

    if (role === 'VENDOR') {
        routes.push(
            '/seller',
            '/seller/dashboard',
            '/seller/products',
            '/seller/orders',
            '/seller/analytics',
            '/seller/finance',
            '/seller/messages',
            '/seller/profile',
            '/seller/settings'
        )
    }

    if (role === 'CUSTOMER') {
        routes.push(
            '/dashboard',
            '/orders',
            '/wishlist',
            '/profile',
            '/settings'
        )
    }

    return routes
}
