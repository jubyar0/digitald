'use server'

import { prisma } from '@/lib/prisma'
import { SearchResult, SearchResults } from '@/types/search'

export async function searchUsers(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ],
        },
        take: 5,
        select: { id: true, name: true, email: true, role: true, image: true },
    })

    return users.map((user: any) => ({
        id: user.id,
        type: 'USER',
        title: user.name || 'Unknown User',
        subtitle: user.email,
        url: `/admin/users?search=${encodeURIComponent(user.email)}`,
        badge: {
            text: user.role,
            variant: user.role === 'ADMIN' ? 'destructive' : user.role === 'VENDOR' ? 'warning' : 'default',
        },
        image: user.image
    }))
}

export async function searchVendors(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const vendors = await prisma.vendor.findMany({ // Changed VendorProfile to Vendor
        where: {
            name: { contains: query, mode: 'insensitive' }, // Changed storeName to name
        },
        take: 5,
        select: {
            id: true,
            name: true, // Changed storeName to name
            user: {
                select: {
                    email: true,
                    // image: true, // User has no image
                },
            },
            avatar: true, // Vendor has avatar
        },
    })

    return vendors.map((vendor: any) => ({
        id: vendor.id,
        type: 'VENDOR',
        title: vendor.name, // Changed storeName to name
        subtitle: vendor.user.email,
        url: `/admin/vendors?search=${encodeURIComponent(vendor.name)}`, // Changed storeName to name
        badge: {
            text: 'VENDOR',
            variant: 'warning',
        },
        image: vendor.avatar // Use vendor avatar
    }))
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const products = await prisma.product.findMany({
        where: {
            name: { contains: query, mode: 'insensitive' }, // Changed title to name
        },
        take: 5,
        select: { id: true, name: true, status: true, vendor: { select: { name: true } }, images: true }, // Changed title to name, storeName to name
    })

    return products.map((product: any) => ({
        id: product.id,
        type: 'PRODUCT',
        title: product.name, // Changed title to name
        subtitle: `By ${product.vendor.name}`, // Changed storeName to name
        url: `/admin/products?search=${encodeURIComponent(product.name)}`, // Changed title to name
        badge: {
            text: product.status,
            variant: product.status === 'PUBLISHED' ? 'success' : product.status === 'PENDING' ? 'warning' : 'default',
        },
        image: product.images && Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null
    }))
}

export async function searchOrders(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const orders = await prisma.order.findMany({
        where: {
            id: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
            id: true,
            totalAmount: true,
            currency: true,
            status: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    })

    return orders.map((order: any) => ({
        id: order.id,
        type: 'ORDER',
        title: `Order #${order.id.slice(-8)}`,
        subtitle: `By ${order.user.name}`,
        url: `/admin/orders?search=${encodeURIComponent(order.id)}`,
        badge: {
            text: order.status,
            variant: order.status === 'COMPLETED' ? 'success' : 'default',
        },
    }))
}

export async function searchTickets(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const tickets = await prisma.supportTicket.findMany({
        where: {
            OR: [
                { subject: { contains: query, mode: 'insensitive' } },
                { id: { contains: query, mode: 'insensitive' } },
            ],
        },
        take: 5,
        select: {
            id: true,
            subject: true,
            status: true,
            priority: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    })

    return tickets.map((ticket: any) => ({
        id: ticket.id,
        type: 'TICKET',
        title: ticket.subject,
        subtitle: `By ${ticket.user.name}`,
        url: `/admin/support?status=${ticket.status}`,
        badge: {
            text: ticket.status,
            variant: ticket.status === 'OPEN' ? 'destructive' : 'default',
        },
    }))
}

export async function searchAll(query: string): Promise<SearchResults> {
    const [users, vendors, products, orders, tickets] = await Promise.all([
        searchUsers(query),
        searchVendors(query),
        searchProducts(query),
        searchOrders(query),
        searchTickets(query),
    ])

    return {
        all: [...users, ...vendors, ...products, ...orders, ...tickets].sort((a, b) => a.title.localeCompare(b.title)),
        users,
        vendors,
        products,
        orders,
        tickets,
    }
}

