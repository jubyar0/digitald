// Shared query utilities with caching
'use server'

import { cache } from 'react'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'

/**
 * Cached query for vendor lookup
 * Uses React cache to deduplicate requests within a single render
 */
export const getCachedVendor = cache(async (userId: string) => {
    return await prisma.vendor.findUnique({
        where: { userId },
        select: { id: true, name: true }
    })
})

/**
 * Cached query for admin lookup
 */
export const getCachedAdmin = cache(async (userId: string) => {
    return await prisma.adminAccount.findUnique({
        where: { userId },
        select: {
            id: true,
            permissions: true,
            lastLogin: true
        }
    })
})

/**
 * Cached categories query with products count
 */
export const getCachedCategoriesWithCount = cache(async () => {
    return await prisma.category.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            isActive: true,
            parentId: true,
            collectionId: true,
            collection: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    icon: true
                }
            },
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    })
})

/**
 * Cached collections query
 */
export const getCachedCollections = cache(async () => {
    return await prisma.collection.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            _count: {
                select: { categories: true }
            }
        },
        orderBy: { name: 'asc' }
    })
})

/**
 * Cached product stats for a vendor
 */
export const getCachedVendorProductStats = cache(async (vendorId: string) => {
    const [total, published, pending] = await Promise.all([
        prisma.product.count({ where: { vendorId } }),
        prisma.product.count({ where: { vendorId, status: 'PUBLISHED' } }),
        prisma.product.count({ where: { vendorId, status: 'PENDING' } })
    ])

    return { total, published, pending, unpublished: total - published }
})

/**
 * Helper to get current user's vendor with caching
 */
export async function getCurrentVendor() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    return await getCachedVendor(session.user.id)
}

/**
 * Helper to get current admin with caching
 */
export async function getCurrentAdmin() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return null

    return await getCachedAdmin(session.user.id)
}
