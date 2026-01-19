'use server'

import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'

// ============================================================================
// Cached Dashboard Stats - Revalidates every 30 seconds
// ============================================================================

async function _getSellerDashboardStatsCached(userId: string) {
    // Get vendor ID for the user
    const vendor = await prisma.vendor.findUnique({
        where: { userId },
        select: { id: true }
    })

    if (!vendor) {
        return {
            storeId: '',
            sales: { total: 0, growth: 0 },
            orders: { total: 0, pending: 0 },
            products: { total: 0, unpublished: 0 },
            customers: { total: 0, new: 0 },
            revenue: { total: 0, growth: 0 },
            conversionRate: { value: 0, growth: 0 },
            recentOrders: []
        }
    }

    const vendorId = vendor.id

    const [
        totalSales,
        ordersCount,
        pendingOrdersCount,
        productsCount,
        unpublishedProductsCount,
        customersCount,
        earnings,
        recentOrders
    ] = await Promise.all([
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { vendorId, status: 'COMPLETED' }
        }),
        prisma.order.count({ where: { vendorId } }),
        prisma.order.count({
            where: { vendorId, status: { in: ['PENDING', 'PAID'] } }
        }),
        prisma.product.count({ where: { vendorId } }),
        prisma.product.count({
            where: { vendorId, status: { not: 'PUBLISHED' } }
        }),
        prisma.order.groupBy({
            by: ['userId'],
            where: { vendorId },
            _count: { userId: true }
        }),
        prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { userId, type: 'COMMISSION_SELLER', status: 'COMPLETED' }
        }),
        prisma.order.findMany({
            where: { vendorId },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                totalAmount: true,
                status: true,
                createdAt: true,
                user: { select: { name: true, email: true } }
            }
        })
    ])

    return {
        storeId: vendorId,
        sales: { total: totalSales._sum.totalAmount || 0, growth: 12 },
        orders: { total: ordersCount, pending: pendingOrdersCount },
        products: { total: productsCount, unpublished: unpublishedProductsCount },
        customers: { total: customersCount.length, new: 0 },
        revenue: { total: earnings._sum.amount || 0, growth: 19 },
        conversionRate: { value: 3.2, growth: 0.5 },
        recentOrders: recentOrders.map((order: any) => ({
            id: order.id,
            customer: order.user.name || order.user.email,
            amount: order.totalAmount,
            status: order.status,
            date: order.createdAt
        }))
    }
}

// Create cached version with 30 second revalidation
const getCachedSellerDashboardStats = (userId: string) =>
    unstable_cache(
        () => _getSellerDashboardStatsCached(userId),
        [`seller-dashboard-stats-${userId}`],
        {
            revalidate: 30, // Cache for 30 seconds
            tags: [`seller-stats-${userId}`, 'seller-dashboard']
        }
    )()

export async function getSellerDashboardStatsCached() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }
        return getCachedSellerDashboardStats(session.user.id)
    } catch (error) {
        console.error('Error fetching cached seller dashboard stats:', error)
        return {
            storeId: '',
            sales: { total: 0, growth: 0 },
            orders: { total: 0, pending: 0 },
            products: { total: 0, unpublished: 0 },
            customers: { total: 0, new: 0 },
            revenue: { total: 0, growth: 0 },
            conversionRate: { value: 0, growth: 0 },
            recentOrders: []
        }
    }
}

// ============================================================================
// Cached Analytics Data - Revalidates every 60 seconds
// ============================================================================

async function _getSellerAnalyticsCached(userId: string) {
    const vendor = await prisma.vendor.findUnique({
        where: { userId },
        select: { id: true }
    })

    if (!vendor) {
        return { salesData: [], topProducts: [], stats: null }
    }

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [orders, totalSales, ordersCount, customersCount] = await Promise.all([
        prisma.order.findMany({
            where: {
                vendorId: vendor.id,
                status: 'COMPLETED',
                createdAt: { gte: sixMonthsAgo }
            },
            select: { totalAmount: true, createdAt: true }
        }),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { vendorId: vendor.id, status: 'COMPLETED' }
        }),
        prisma.order.count({
            where: { vendorId: vendor.id, status: 'COMPLETED' }
        }),
        prisma.order.groupBy({
            by: ['userId'],
            where: { vendorId: vendor.id, status: 'COMPLETED' }
        })
    ])

    // Group by month
    const monthlyData = new Map<string, number>()
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const month = d.toLocaleString('default', { month: 'short' })
        monthlyData.set(month, 0)
    }

    orders.forEach((order: any) => {
        const month = order.createdAt.toLocaleString('default', { month: 'short' })
        const current = monthlyData.get(month) || 0
        monthlyData.set(month, current + order.totalAmount)
    })

    return {
        salesData: Array.from(monthlyData.entries()).map(([name, sales]) => ({
            name,
            sales
        })),
        stats: {
            totalRevenue: totalSales._sum.totalAmount || 0,
            totalOrders: ordersCount,
            totalCustomers: customersCount.length
        },
        topProducts: [] // Simplified for now
    }
}

const getCachedSellerAnalytics = (userId: string) =>
    unstable_cache(
        () => _getSellerAnalyticsCached(userId),
        [`seller-analytics-${userId}`],
        {
            revalidate: 60, // Cache for 60 seconds
            tags: [`seller-analytics-${userId}`, 'seller-analytics']
        }
    )()

export async function getSellerAnalyticsCached() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }
        return getCachedSellerAnalytics(session.user.id)
    } catch (error) {
        console.error('Error fetching cached seller analytics:', error)
        return { salesData: [], topProducts: [], stats: null }
    }
}

// ============================================================================
// Cached Products List - Revalidates every 30 seconds
// ============================================================================

async function _getSellerProductsCached(
    userId: string,
    page: number = 1,
    pageSize: number = 20
) {
    const vendor = await prisma.vendor.findUnique({
        where: { userId },
        select: { id: true }
    })

    if (!vendor) {
        return { data: [], total: 0 }
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: { vendorId: vendor.id },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                price: true,
                status: true,
                thumbnail: true,
                isActive: true,
                createdAt: true
            }
        }),
        prisma.product.count({ where: { vendorId: vendor.id } })
    ])

    return {
        data: products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            status: p.status,
            thumbnail: p.thumbnail,
            isActive: p.isActive,
            createdAt: p.createdAt
        })),
        total
    }
}

export async function getSellerProductsCached(page: number = 1, pageSize: number = 20) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Products cache is per-user and page
        return unstable_cache(
            () => _getSellerProductsCached(session.user.id, page, pageSize),
            [`seller-products-${session.user.id}-${page}-${pageSize}`],
            {
                revalidate: 30,
                tags: [`seller-products-${session.user.id}`, 'seller-products']
            }
        )()
    } catch (error) {
        console.error('Error fetching cached seller products:', error)
        return { data: [], total: 0 }
    }
}

// ============================================================================
// Cache Invalidation Helpers
// ============================================================================

import { revalidateTag } from 'next/cache'

export async function invalidateSellerCache(userId: string) {
    revalidateTag(`seller-stats-${userId}`)
    revalidateTag(`seller-analytics-${userId}`)
    revalidateTag(`seller-products-${userId}`)
}

export async function invalidateAllSellerCaches() {
    revalidateTag('seller-dashboard')
    revalidateTag('seller-analytics')
    revalidateTag('seller-products')
}
