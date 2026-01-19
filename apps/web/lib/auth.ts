import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { Role } from "@repo/database"
import { prisma } from "@/lib/db"

/**
 * Get the current session on the server side
 * Use this in Server Components and API Routes
 */
export async function getCurrentSession() {
    return await getServerSession(authOptions)
}

/**
 * Get the current user from session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    const session = await getCurrentSession()
    return session?.user ?? null
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: string | undefined, allowedRoles: Role[]) {
    if (!userRole) return false
    return allowedRoles.includes(userRole as Role)
}

/**
 * Get redirect URL based on user role
 * ADMIN -> /admin/dashboard
 * VENDOR -> /seller/dashboard
 * CUSTOMER -> /dashboard
 */
export function getRedirectByRole(role: string): string {
    switch (role) {
        case "ADMIN":
            return "/admin/dashboard"
        case "VENDOR":
            return "/seller/dashboard"
        case "CUSTOMER":
        default:
            return "/dashboard"
    }
}

/**
 * Check if user is authenticated
 * Throws error if not authenticated (use in protected routes)
 */
export async function requireAuth() {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    return session
}

/**
 * Check if user has required role
 * Throws error if user doesn't have the role
 */
export async function requireRole(allowedRoles: Role[]) {
    const session = await requireAuth()
    if (!hasRole(session.user.role, allowedRoles)) {
        throw new Error("Forbidden")
    }
    return session
}

/**
 * Check if user is an ADMIN
 * Throws error if user is not an admin
 */
export async function requireAdmin() {
    const session = await requireAuth()
    if (session.user.role !== "ADMIN") {
        throw new Error("Forbidden - Admin access required")
    }
    return session
}

/**
 * Check if user is a VENDOR or ADMIN
 * Throws error if user doesn't have vendor access
 */
export async function requireVendor() {
    const session = await requireAuth()
    if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
        throw new Error("Forbidden - Vendor access required")
    }
    return session
}

/**
 * Check if user is a Super Admin (ADMIN with isSuperAdmin flag)
 * Use for sensitive operations like API settings, system configuration
 */
export async function requireSuperAdmin() {
    const session = await requireAuth()

    if (session.user.role !== "ADMIN") {
        throw new Error("Forbidden - Admin access required")
    }

    // Check AdminAccount for isSuperAdmin flag
    const adminAccount = await prisma.adminAccount.findUnique({
        where: { userId: session.user.id }
    })

    if (!adminAccount?.isSuperAdmin) {
        throw new Error("Forbidden - Super Admin access required")
    }

    return session
}
