/**
 * Prisma Query Helpers - Optimized database queries
 * 
 * Best practices:
 * 1. Always use `select` instead of full object fetch
 * 2. Use `findMany` with pagination
 * 3. Use `Promise.all` for parallel queries
 * 4. Cache expensive queries with `unstable_cache`
 */

import { prisma } from '@/lib/db'

// ============================================================================
// Pagination Helper
// ============================================================================

export interface PaginationParams {
    page?: number
    pageSize?: number
}

export interface PaginatedResult<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasMore: boolean
}

export function getPaginationParams(params: PaginationParams) {
    const page = Math.max(1, params.page || 1)
    const pageSize = Math.min(100, Math.max(1, params.pageSize || 10))
    const skip = (page - 1) * pageSize

    return { page, pageSize, skip }
}

export function createPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number
): PaginatedResult<T> {
    const totalPages = Math.ceil(total / pageSize)
    return {
        data,
        total,
        page,
        pageSize,
        totalPages,
        hasMore: page < totalPages,
    }
}

// ============================================================================
// Optimized Select Objects - Reduce data transfer
// ============================================================================

export const productMinimalSelect = {
    id: true,
    name: true,
    price: true,
    thumbnail: true,
    status: true,
    isActive: true,
} as const

export const productListSelect = {
    ...productMinimalSelect,
    description: true,
    createdAt: true,
    views: true,
    downloads: true,
    category: {
        select: {
            id: true,
            name: true,
        },
    },
} as const

export const userMinimalSelect = {
    id: true,
    name: true,
    email: true,
    image: true,
} as const

export const vendorMinimalSelect = {
    id: true,
    name: true,
    avatar: true,
} as const

export const orderListSelect = {
    id: true,
    totalAmount: true,
    status: true,
    createdAt: true,
    user: {
        select: userMinimalSelect,
    },
    _count: {
        select: {
            items: true,
        },
    },
} as const

// ============================================================================
// Batch Data Fetching
// ============================================================================

/**
 * Fetch multiple related data in parallel
 * Reduces N+1 query problem
 */
export async function batchFetchVendorData(vendorId: string) {
    const [vendor, products, orders, stats] = await Promise.all([
        prisma.vendor.findUnique({
            where: { id: vendorId },
            select: {
                id: true,
                name: true,
                avatar: true,
                totalSales: true,
                averageRating: true,
                totalReviews: true,
            },
        }),
        prisma.product.count({
            where: { vendorId },
        }),
        prisma.order.count({
            where: { vendorId },
        }),
        prisma.order.aggregate({
            where: { vendorId, status: 'COMPLETED' },
            _sum: { totalAmount: true },
        }),
    ])

    return {
        vendor,
        productCount: products,
        orderCount: orders,
        totalRevenue: stats._sum.totalAmount || 0,
    }
}

// ============================================================================
// Cursor-based Pagination (for infinite scroll)
// ============================================================================

export async function getProductsCursor(
    vendorId: string,
    cursor?: string,
    limit: number = 20
) {
    const products = await prisma.product.findMany({
        where: { vendorId },
        take: limit + 1, // Get one extra to check if there's more
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        select: productListSelect,
    })

    let nextCursor: string | undefined = undefined
    if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem?.id
    }

    return {
        products,
        nextCursor,
        hasMore: !!nextCursor,
    }
}

// ============================================================================
// Aggregate Queries (for dashboards)
// ============================================================================

export async function getVendorDashboardAggregates(vendorId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
        thisMonthRevenue,
        lastMonthRevenue,
        thisMonthOrders,
        lastMonthOrders,
        pendingOrders,
        publishedProducts,
    ] = await Promise.all([
        // This month revenue
        prisma.order.aggregate({
            where: {
                vendorId,
                status: 'COMPLETED',
                createdAt: { gte: startOfMonth },
            },
            _sum: { totalAmount: true },
        }),
        // Last month revenue
        prisma.order.aggregate({
            where: {
                vendorId,
                status: 'COMPLETED',
                createdAt: { gte: startOfLastMonth, lt: startOfMonth },
            },
            _sum: { totalAmount: true },
        }),
        // This month orders
        prisma.order.count({
            where: {
                vendorId,
                createdAt: { gte: startOfMonth },
            },
        }),
        // Last month orders
        prisma.order.count({
            where: {
                vendorId,
                createdAt: { gte: startOfLastMonth, lt: startOfMonth },
            },
        }),
        // Pending orders
        prisma.order.count({
            where: {
                vendorId,
                status: { in: ['PENDING', 'PAID'] },
            },
        }),
        // Published products
        prisma.product.count({
            where: {
                vendorId,
                status: 'PUBLISHED',
            },
        }),
    ])

    const thisMonthTotal = thisMonthRevenue._sum.totalAmount || 0
    const lastMonthTotal = lastMonthRevenue._sum.totalAmount || 0
    const revenueGrowth = lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0

    const orderGrowth = lastMonthOrders > 0
        ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0

    return {
        revenue: {
            thisMonth: thisMonthTotal,
            lastMonth: lastMonthTotal,
            growth: Math.round(revenueGrowth * 10) / 10,
        },
        orders: {
            thisMonth: thisMonthOrders,
            lastMonth: lastMonthOrders,
            pending: pendingOrders,
            growth: Math.round(orderGrowth * 10) / 10,
        },
        products: {
            published: publishedProducts,
        },
    }
}
