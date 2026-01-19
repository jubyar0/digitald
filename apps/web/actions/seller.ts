'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import crypto from 'crypto'

// ============================================================================
// Dashboard Stats
// ============================================================================

export async function getSellerDashboardStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const userId = session.user.id

        // Get vendor ID for the user
        const vendor = await prisma.vendor.findUnique({
            where: { userId },
            select: { id: true }
        })

        if (!vendor) {
            // Return empty stats if user is not a vendor yet
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
            // Total Sales (Revenue) - optimized with single field
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: {
                    vendorId,
                    status: 'COMPLETED'
                }
            }),
            // Total Orders
            prisma.order.count({
                where: { vendorId }
            }),
            // Pending Orders
            prisma.order.count({
                where: {
                    vendorId,
                    status: { in: ['PENDING', 'PAID'] }
                }
            }),
            // Total Products
            prisma.product.count({
                where: { vendorId }
            }),
            // Unpublished Products
            prisma.product.count({
                where: {
                    vendorId,
                    status: { not: 'PUBLISHED' }
                }
            }),
            // Unique Customers (optimized)
            prisma.order.groupBy({
                by: ['userId'],
                where: { vendorId },
                _count: { userId: true }
            }),
            // Total Earnings (Commission Seller)
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    userId,
                    type: 'COMMISSION_SELLER',
                    status: 'COMPLETED'
                }
            }),
            // Recent Orders - optimized with minimal fields
            prisma.order.findMany({
                where: { vendorId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    totalAmount: true,
                    status: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            })
        ])

        const totalRevenue = totalSales._sum.totalAmount || 0
        const totalEarnings = earnings._sum.amount || 0

        return {
            storeId: vendorId,
            sales: {
                total: totalRevenue,
                growth: 12 // TODO: Calculate actual growth
            },
            orders: {
                total: ordersCount,
                pending: pendingOrdersCount
            },
            products: {
                total: productsCount,
                unpublished: unpublishedProductsCount
            },
            customers: {
                total: customersCount.length,
                new: 0 // TODO: Calculate new customers
            },
            revenue: {
                total: totalEarnings, // Changed to Earnings
                growth: 19 // TODO: Calculate actual growth
            },
            conversionRate: {
                value: 3.2, // TODO: Calculate actual conversion rate
                growth: 0.5
            },
            recentOrders: recentOrders.map((order: any) => ({
                id: order.id,
                customer: order.user.name || order.user.email,
                amount: order.totalAmount,
                status: order.status,
                date: order.createdAt
            }))
        }
    } catch (error) {
        console.error('Error fetching seller dashboard stats:', error)
        // Return safe fallback data instead of throwing to prevent app crashes
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


export async function getSellerStoreId() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return null

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        return vendor?.id || null
    } catch (error) {
        return null
    }
}


// ============================================================================
// Payment History
// ============================================================================

export async function getSellerPayments(
    page: number = 1,
    pageSize: number = 10,
    status?: string
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { data: [], total: 0 }
        }

        const where: any = {
            order: {
                vendorId: vendor.id
            }
        }

        if (status && status !== 'ALL') {
            where.status = status
        }

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            id: true,
                            totalAmount: true,
                            user: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                }
            }),
            prisma.payment.count({ where })
        ])

        return {
            data: payments.map((payment: any) => ({
                id: payment.id,
                orderId: payment.orderId,
                orderIdShort: payment.orderId.slice(-6),
                amount: payment.amount,
                currency: payment.currency,
                provider: payment.provider,
                status: payment.status,
                transactionId: payment.transactionId,
                customer: payment.order.user.name || payment.order.user.email,
                createdAt: payment.createdAt
            })),
            total
        }
    } catch (error) {
        console.error('Error fetching seller payments:', error)
        return { data: [], total: 0 }
    }
}

// ============================================================================
// Order Management
// ============================================================================

export async function getSellerOrders(
    page: number = 1,
    pageSize: number = 10,
    status?: string
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { data: [], total: 0 }
        }

        const where: any = {
            vendorId: vendor.id
        }

        if (status && status !== 'ALL') {
            where.status = status
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            }),
            prisma.order.count({ where })
        ])

        return {
            data: orders.map((order: any) => ({
                id: order.id,
                customer: order.user.name || order.user.email,
                total: order.totalAmount,
                status: order.status,
                date: order.createdAt,
                items: order.items.length,
                itemsDetails: order.items // detailed items for potential expansion
            })),
            total
        }
    } catch (error) {
        console.error('Error fetching seller orders:', error)
        throw new Error('Failed to fetch orders')
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { vendorId: true }
        })

        if (!order || order.vendorId !== vendor.id) {
            throw new Error('Order not found or unauthorized')
        }

        // Update status
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus as any }
        })

        revalidatePath('/seller/orders')
        return { success: true }
    } catch (error) {
        console.error('Error updating order status:', error)
        return { success: false, error: 'Failed to update status' }
    }
}

export async function bulkUpdateOrderStatus(orderIds: string[], newStatus: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify all orders belong to this vendor
        const orders = await prisma.order.findMany({
            where: {
                id: { in: orderIds },
                vendorId: vendor.id
            },
            select: { id: true }
        })

        if (orders.length !== orderIds.length) {
            return { success: false, error: 'Some orders not found or unauthorized' }
        }

        // Update all orders
        await prisma.order.updateMany({
            where: {
                id: { in: orderIds },
                vendorId: vendor.id
            },
            data: { status: newStatus as any }
        })

        revalidatePath('/seller/orders')
        revalidatePath('/seller/orders/pending')
        revalidatePath('/seller/orders/completed')
        return { success: true, count: orders.length }
    } catch (error) {
        console.error('Error bulk updating order status:', error)
        return { success: false, error: 'Failed to update orders' }
    }
}

export async function getSellerOrderById(orderId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return null
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                thumbnail: true,
                                price: true
                            }
                        }
                    }
                }
            }
        })

        // Verify the order belongs to this vendor
        if (!order || order.vendorId !== vendor.id) {
            return null
        }

        return {
            id: order.id,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            customer: {
                id: order.user.id,
                name: order.user.name || 'Unknown',
                email: order.user.email,
                avatar: null
            },
            items: order.items.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    thumbnail: item.product.thumbnail,
                    price: item.product.price
                }
            }))
        }
    } catch (error) {
        console.error('Error fetching order:', error)
        return null
    }
}

// ============================================================================
// Discount Management
// ============================================================================

export async function getSellerDiscounts() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return []
        }

        const discounts = await prisma.discount.findMany({
            where: { vendorId: vendor.id },
            orderBy: { createdAt: 'desc' }
        })

        return discounts
    } catch (error) {
        console.error('Error fetching seller discounts:', error)
        return []
    }
}

export async function createDiscount(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        await prisma.discount.create({
            data: {
                ...data,
                vendorId: vendor.id,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                value: parseFloat(data.value),
                minPurchase: data.minPurchase ? parseFloat(data.minPurchase) : null,
                maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
                usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
            }
        })

        revalidatePath('/seller/marketing/discounts')
        return { success: true }
    } catch (error) {
        console.error('Error creating discount:', error)
        return { success: false, error: 'Failed to create discount' }
    }
}

export async function deleteDiscount(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const discount = await prisma.discount.findUnique({
            where: { id },
            select: { vendorId: true }
        })

        if (!discount || discount.vendorId !== vendor.id) {
            throw new Error('Discount not found or unauthorized')
        }

        await prisma.discount.delete({
            where: { id }
        })

        revalidatePath('/seller/marketing/discounts')
        return { success: true }
    } catch (error) {
        console.error('Error deleting discount:', error)
        return { success: false, error: 'Failed to delete discount' }
    }
}

export async function toggleDiscountStatus(id: string, isActive: boolean) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const discount = await prisma.discount.findUnique({
            where: { id },
            select: { vendorId: true }
        })

        if (!discount || discount.vendorId !== vendor.id) {
            throw new Error('Discount not found or unauthorized')
        }

        await prisma.discount.update({
            where: { id },
            data: { isActive }
        })

        revalidatePath('/seller/marketing/discounts')
        return { success: true }
    } catch (error) {
        console.error('Error toggling discount status:', error)
        return { success: false, error: 'Failed to update status' }
    }
}

export async function getSellerAnalytics() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { salesData: [], topProducts: [] }
        }

        // Get orders from the last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const orders = await prisma.order.findMany({
            where: {
                vendorId: vendor.id,
                status: 'COMPLETED',
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                totalAmount: true,
                createdAt: true
            }
        })

        // Group by month
        const monthlyData = new Map<string, number>()

        // Initialize last 6 months with 0
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

        // Calculate overall statistics
        const [totalSales, ordersCount, customersCount] = await Promise.all([
            // Total Sales (Revenue) - all completed orders
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: {
                    vendorId: vendor.id,
                    status: 'COMPLETED'
                }
            }),
            // Total Orders count
            prisma.order.count({
                where: {
                    vendorId: vendor.id,
                    status: 'COMPLETED'
                }
            }),
            // Unique Customers
            prisma.order.groupBy({
                by: ['userId'],
                where: {
                    vendorId: vendor.id,
                    status: 'COMPLETED'
                }
            })
        ])

        // âœ… OPTIMIZED: Get Top Products with single query using include
        // Instead of N+1 queries, fetch all data at once
        const topProductsData = await prisma.orderItem.groupBy({
            by: ['productId'],
            where: {
                order: {
                    vendorId: vendor.id,
                    status: 'COMPLETED'
                }
            },
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        })

        // âœ… OPTIMIZED: Fetch all product details and order items in parallel
        const productIds = topProductsData.map(item => item.productId)

        const [productsMap, orderItemsByProduct] = await Promise.all([
            // Fetch all product details in one query
            prisma.product.findMany({
                where: { id: { in: productIds } },
                select: {
                    id: true,
                    name: true,
                    thumbnail: true,
                    images: true
                }
            }).then(products =>
                new Map(products.map((p: any) => [p.id, p]))
            ),

            // Fetch all order items for revenue calculation in one query
            prisma.orderItem.findMany({
                where: {
                    productId: { in: productIds },
                    order: {
                        vendorId: vendor.id,
                        status: 'COMPLETED'
                    }
                },
                select: {
                    productId: true,
                    quantity: true,
                    price: true
                }
            }).then(items => {
                // Group by productId for easy lookup
                const grouped = new Map<string, Array<{ quantity: number; price: number }>>()
                items.forEach((item: { productId: string; quantity: number; price: number }) => {
                    if (!grouped.has(item.productId)) {
                        grouped.set(item.productId, [])
                    }
                    grouped.get(item.productId)!.push({
                        quantity: item.quantity,
                        price: item.price
                    })
                })
                return grouped
            })
        ])

        // Build top products array with all data fetched
        const topProducts = topProductsData.map((item: any) => {
            const product = productsMap.get(item.productId) as { id: string; name: string; thumbnail: string | null; images: string[] } | undefined
            const items = orderItemsByProduct.get(item.productId) || []

            // Calculate total revenue
            const totalRevenue = items.reduce((acc: number, curr: { quantity: number; price: number }) =>
                acc + (curr.quantity * curr.price), 0
            )

            let image = product?.thumbnail
            if (!image && product?.images && Array.isArray(product.images) && product.images.length > 0) {
                image = product.images[0] as string
            }

            return {
                id: item.productId,
                name: product?.name || 'Unknown Product',
                sales: item._sum.quantity || 0,
                revenue: totalRevenue,
                image: image || '/placeholder.png'
            }
        })

        return {
            salesData: Array.from(monthlyData.entries()).map(([name, total]) => ({
                name,
                total
            })),
            topProducts,
            stats: {
                totalRevenue: totalSales._sum.totalAmount || 0,
                revenueGrowth: 0, // TODO: Calculate actual growth
                totalSales: ordersCount,
                salesGrowth: 0, // TODO: Calculate actual growth
                totalCustomers: customersCount.length,
                customersGrowth: 0, // TODO: Calculate actual growth
                conversionRate: 0, // TODO: Calculate actual conversion rate
                conversionGrowth: 0
            },
            customerInsights: {
                newCustomers: 0, // TODO: Calculate new customers this month
                returningCustomers: customersCount.length, // Approximate
                averageOrderValue: ordersCount > 0 ? (totalSales._sum.totalAmount || 0) / ordersCount : 0
            }
        }
    } catch (error) {
        console.error('Error fetching seller analytics:', error)
        return {
            salesData: [],
            topProducts: [],
            stats: {
                totalRevenue: 0,
                revenueGrowth: 0,
                totalSales: 0,
                salesGrowth: 0,
                totalCustomers: 0,
                customersGrowth: 0,
                conversionRate: 0,
                conversionGrowth: 0
            },
            customerInsights: {
                newCustomers: 0,
                returningCustomers: 0,
                averageOrderValue: 0
            }
        }
    }
}

// ============================================================================
// Payout Management
// ============================================================================

export async function getSellerBalance() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { balance: 0, availableBalance: 0 }
        }

        const escrowAccount = await prisma.escrowAccount.findUnique({
            where: { vendorId: vendor.id },
            select: {
                balance: true,
                availableBalance: true,
                currency: true
            }
        })

        return {
            balance: escrowAccount?.balance || 0,
            availableBalance: escrowAccount?.availableBalance || 0,
            currency: escrowAccount?.currency || 'USD'
        }
    } catch (error) {
        console.error('Error fetching seller balance:', error)
        return { balance: 0, availableBalance: 0, currency: 'USD' }
    }
}

export async function getSellerWithdrawals(page: number = 1, pageSize: number = 10) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { data: [], total: 0 }
        }

        const [withdrawals, total] = await Promise.all([
            prisma.withdrawal.findMany({
                where: { vendorId: vendor.id },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.withdrawal.count({
                where: { vendorId: vendor.id }
            })
        ])

        return { data: withdrawals, total }
    } catch (error) {
        console.error('Error fetching seller withdrawals:', error)
        throw new Error('Failed to fetch withdrawals')
    }
}

export async function requestWithdrawal(data: {
    amount: number
    method?: string
    details?: string
    payoutMethodId?: string
}) {
    const MINIMUM_WITHDRAWAL = 10 // Minimum $10 withdrawal

    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true, name: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found. Please complete your seller profile first.' }
        }

        // Check minimum withdrawal amount
        if (data.amount < MINIMUM_WITHDRAWAL) {
            return { success: false, error: `Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL}` }
        }

        // Validate amount
        if (data.amount <= 0) {
            return { success: false, error: 'Amount must be greater than 0' }
        }

        // Get or create escrow account
        let escrowAccount = await prisma.escrowAccount.findUnique({
            where: { vendorId: vendor.id },
            select: { id: true, balance: true, availableBalance: true, currency: true }
        })

        // Auto-create escrow account if it doesn't exist
        if (!escrowAccount) {
            escrowAccount = await prisma.escrowAccount.create({
                data: {
                    vendorId: vendor.id,
                    balance: 0,
                    availableBalance: 0,
                    currency: 'USD'
                },
                select: { id: true, balance: true, availableBalance: true, currency: true }
            })
        }

        // Check if sufficient available balance
        if (data.amount > escrowAccount.availableBalance) {
            return {
                success: false,
                error: `Insufficient available balance. You have $${escrowAccount.availableBalance.toFixed(2)} available.`
            }
        }

        let withdrawalMethod = data.method
        let withdrawalDetails = data.details

        // If payoutMethodId is provided, fetch details
        if (data.payoutMethodId) {
            const payoutMethod = await prisma.vendorPayoutMethod.findUnique({
                where: { id: data.payoutMethodId }
            })

            if (!payoutMethod || payoutMethod.vendorId !== vendor.id) {
                return { success: false, error: 'Invalid payout method' }
            }

            withdrawalMethod = payoutMethod.type
            withdrawalDetails = JSON.stringify(payoutMethod.details)
        } else {
            // Validate manual details
            if (!withdrawalMethod || !withdrawalDetails) {
                return { success: false, error: 'Payment method and details are required' }
            }
        }

        // Use transaction to create withdrawal and hold the amount
        await prisma.$transaction(async (tx) => {
            // Create withdrawal request
            await tx.withdrawal.create({
                data: {
                    vendorId: vendor.id,
                    amount: data.amount,
                    currency: escrowAccount!.currency,
                    method: withdrawalMethod!,
                    details: withdrawalDetails!,
                    status: 'PENDING'
                }
            })

            // Hold the amount (reduce available balance but not total balance)
            await tx.escrowAccount.update({
                where: { id: escrowAccount!.id },
                data: {
                    availableBalance: { decrement: data.amount }
                }
            })

            // Log the hold transaction
            await tx.escrowTransaction.create({
                data: {
                    escrowAccountId: escrowAccount!.id,
                    amount: data.amount,
                    type: 'HOLD',
                    status: 'COMPLETED',
                    description: `Withdrawal request hold: ${withdrawalMethod}`
                }
            })
        })

        revalidatePath('/seller/finance/payouts')
        return { success: true, message: 'Withdrawal request submitted successfully' }
    } catch (error) {
        console.error('Error requesting withdrawal:', error)
        return { success: false, error: 'Failed to request withdrawal. Please try again.' }
    }
}

// ============================================================================
// Payout Methods Management
// ============================================================================

export async function getPayoutMethods() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return []
        }

        const methods = await prisma.vendorPayoutMethod.findMany({
            where: { vendorId: vendor.id, isActive: true },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return methods
    } catch (error) {
        console.error('Error fetching payout methods:', error)
        return []
    }
}

export async function createPayoutMethod(data: {
    type: any // PaymentType
    label: string
    details: any
    isDefault?: boolean
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await prisma.vendorPayoutMethod.updateMany({
                where: { vendorId: vendor.id, isDefault: true },
                data: { isDefault: false }
            })
        }

        // Check if this is the first method, make it default automatically
        const count = await prisma.vendorPayoutMethod.count({
            where: { vendorId: vendor.id, isActive: true }
        })
        const isDefault = data.isDefault || count === 0

        await prisma.vendorPayoutMethod.create({
            data: {
                vendorId: vendor.id,
                type: data.type,
                label: data.label,
                details: data.details,
                isDefault
            }
        })

        revalidatePath('/seller/settings/payout-methods')
        return { success: true }
    } catch (error) {
        console.error('Error creating payout method:', error)
        return { success: false, error: 'Failed to create payout method' }
    }
}

export async function updatePayoutMethod(id: string, data: {
    label?: string
    details?: any
    isDefault?: boolean
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findUnique({
            where: { id }
        })

        if (!method || method.vendorId !== vendor.id) {
            throw new Error('Payout method not found')
        }

        // If setting as default, unset other defaults
        if (data.isDefault) {
            await prisma.vendorPayoutMethod.updateMany({
                where: { vendorId: vendor.id, isDefault: true },
                data: { isDefault: false }
            })
        }

        await prisma.vendorPayoutMethod.update({
            where: { id },
            data: {
                label: data.label,
                details: data.details,
                isDefault: data.isDefault
            }
        })

        revalidatePath('/seller/settings/payout-methods')
        return { success: true }
    } catch (error) {
        console.error('Error updating payout method:', error)
        return { success: false, error: 'Failed to update payout method' }
    }
}

export async function deletePayoutMethod(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findUnique({
            where: { id }
        })

        if (!method || method.vendorId !== vendor.id) {
            throw new Error('Payout method not found')
        }

        await prisma.vendorPayoutMethod.delete({
            where: { id }
        })

        revalidatePath('/seller/settings/payout-methods')
        return { success: true }
    } catch (error) {
        console.error('Error deleting payout method:', error)
        return { success: false, error: 'Failed to delete payout method' }
    }
}

export async function setDefaultPayoutMethod(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findUnique({
            where: { id }
        })

        if (!method || method.vendorId !== vendor.id) {
            throw new Error('Payout method not found')
        }

        // Unset current default
        await prisma.vendorPayoutMethod.updateMany({
            where: { vendorId: vendor.id, isDefault: true },
            data: { isDefault: false }
        })

        // Set new default
        await prisma.vendorPayoutMethod.update({
            where: { id },
            data: { isDefault: true }
        })

        revalidatePath('/seller/settings/payout-methods')
        return { success: true }
    } catch (error) {
        console.error('Error setting default payout method:', error)
        return { success: false, error: 'Failed to set default payout method' }
    }
}

// ============================================================================
// Customer Management
// ============================================================================

export async function getSellerCustomers(page: number = 1, pageSize: number = 10) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { data: [], total: 0, stats: { total: 0, new: 0, returning: 0 } }
        }

        // Get unique customers who have ordered from this vendor
        // Since we can't easily do distinct on user with pagination in one query with Prisma + relations
        // We'll fetch orders grouped by user

        // 1. Get total count of unique customers
        const uniqueCustomersCount = await prisma.order.groupBy({
            by: ['userId'],
            where: { vendorId: vendor.id },
            _count: { userId: true }
        })
        const total = uniqueCustomersCount.length

        // 2. Get paginated customers
        // This is tricky with Prisma. We'll fetch distinct userIds from orders first
        // Note: This might be inefficient for large datasets, but works for now
        const distinctUserIds = await prisma.order.findMany({
            where: { vendorId: vendor.id },
            select: { userId: true },
            distinct: ['userId'],
            orderBy: { createdAt: 'desc' }, // Most recent customers first
            skip: (page - 1) * pageSize,
            take: pageSize
        })

        const userIds = distinctUserIds.map((o: { userId: string }) => o.userId)

        // 3. Fetch user details and their stats for this vendor
        const customersData = await Promise.all(userIds.map(async (userId: string) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { name: true, email: true, createdAt: true }
            })

            const orderStats = await prisma.order.aggregate({
                where: { vendorId: vendor.id, userId },
                _count: { id: true },
                _sum: { totalAmount: true }
            })

            return {
                id: userId,
                name: user?.name || 'Unknown',
                email: user?.email,
                orders: orderStats._count.id,
                totalSpent: orderStats._sum.totalAmount || 0,
                joined: user?.createdAt // Platform join date
            }
        }))

        // Calculate stats
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        // New customers this month (first order this month)
        // This is an approximation. Ideally we check the date of their FIRST order with this vendor.
        // For now, let's just return placeholders or simple counts

        return {
            data: customersData,
            total,
            stats: {
                total,
                new: 0, // TODO: Implement complex query for new vs returning
                returning: total // Simplified
            }
        }
    } catch (error) {
        console.error('Error fetching seller customers:', error)
        return { data: [], total: 0, stats: { total: 0, new: 0, returning: 0 } }
    }
}

// ============================================================================
// Seller Profile Management
// ============================================================================

export async function getSellerProfile() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                name: true,
                description: true,
                bio: true,
                location: true,
                specializations: true,
                socialLinks: true,
                avatar: true,
                coverImage: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        if (!vendor) {
            // Return default values if vendor doesn't exist yet
            return {
                vendorName: '',
                description: '',
                bio: '',
                location: '',
                specializations: [],
                socialLinks: {},
                userName: session.user.name || '',
                email: session.user.email || '',
                avatar: '',
                coverImage: ''
            }
        }

        return {
            vendorName: vendor.name,
            description: vendor.description || '',
            bio: vendor.bio || '',
            location: vendor.location || '',
            specializations: (vendor.specializations as string[]) || [],
            socialLinks: (vendor.socialLinks as Record<string, string>) || {},
            userName: vendor.user.name || '',
            email: vendor.user.email || '',
            avatar: vendor.avatar || '',
            userAvatar: vendor.user.image || '',
            coverImage: vendor.coverImage || ''
        }
    } catch (error) {
        console.error('Error fetching seller profile:', error)
        // Return default values on error instead of throwing
        return {
            vendorName: '',
            description: '',
            bio: '',
            location: '',
            specializations: [],
            socialLinks: {},
            userName: '',
            email: '',
            avatar: '',
            coverImage: ''
        }
    }
}

export async function updateSellerProfile(data: {
    vendorName: string
    description: string
    bio?: string
    location?: string
    specializations?: string[]
    socialLinks?: Record<string, string>
    avatar?: string
    coverImage?: string
    userName: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            console.error('[updateSellerProfile] No session found')
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            console.error('[updateSellerProfile] Vendor not found for user:', session.user.id)
            throw new Error('Vendor not found')
        }

        // Update vendor and user in parallel
        await Promise.all([
            prisma.vendor.update({
                where: { id: vendor.id },
                data: {
                    name: data.vendorName,
                    description: data.description,
                    bio: data.bio,
                    location: data.location,
                    specializations: data.specializations,
                    socialLinks: data.socialLinks,
                    avatar: data.avatar,
                    coverImage: data.coverImage
                }
            }),
            prisma.user.update({
                where: { id: session.user.id },
                data: {
                    name: data.userName,
                    image: data.avatar
                }
            })
        ])

        revalidatePath('/seller/settings/profile')
        return { success: true }
    } catch (error) {
        console.error('Error updating seller profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

// ============================================================================
// Invoice Management
// ============================================================================

export async function getSellerInvoices(page: number = 1, pageSize: number = 10) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { data: [], total: 0 }
        }

        const [invoices, total] = await Promise.all([
            prisma.invoice.findMany({
                where: { vendorId: vendor.id },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.invoice.count({
                where: { vendorId: vendor.id }
            })
        ])

        return { data: invoices, total }
    } catch (error) {
        console.error('Error fetching seller invoices:', error)
        throw new Error('Failed to fetch invoices')
    }
}

export async function getOrdersWithoutInvoices() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return []
        }

        // Get all completed/paid orders that don't have invoices
        const orders = await prisma.order.findMany({
            where: {
                vendorId: vendor.id,
                status: { in: ['COMPLETED', 'PAID'] }
            },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Filter out orders that already have invoices
        const invoices = await prisma.invoice.findMany({
            where: { vendorId: vendor.id },
            select: { orderId: true }
        })

        const invoicedOrderIds = new Set(invoices.map((inv: any) => inv.orderId))
        const ordersWithoutInvoices = orders.filter((order: any) => !invoicedOrderIds.has(order.id))

        return ordersWithoutInvoices.map((order: any) => ({
            id: order.id,
            customer: order.user.name || order.user.email,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt
        }))
    } catch (error) {
        console.error('Error fetching orders without invoices:', error)
        throw new Error('Failed to fetch orders')
    }
}

export async function createInvoice(orderId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify the order belongs to this vendor
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: {
                vendorId: true,
                totalAmount: true,
                status: true
            }
        })

        if (!order || order.vendorId !== vendor.id) {
            return { success: false, error: 'Order not found or unauthorized' }
        }

        // Check if order is completed or paid
        if (order.status !== 'COMPLETED' && order.status !== 'PAID') {
            return { success: false, error: 'Can only create invoices for completed or paid orders' }
        }

        // Check if invoice already exists for this order
        const existingInvoice = await prisma.invoice.findUnique({
            where: { orderId }
        })

        if (existingInvoice) {
            return { success: false, error: 'Invoice already exists for this order' }
        }

        // Get vendor's tax settings or use default
        const taxSetting = await prisma.taxSetting.findUnique({
            where: { vendorId: vendor.id },
            select: { taxRate: true }
        })

        const taxRate = taxSetting?.taxRate || 0
        const amount = order.totalAmount
        const tax = amount * (taxRate / 100)
        const total = amount + tax

        // Generate unique invoice number (format: INV-YYYYMMDD-XXXXX)
        const now = new Date()
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')

        // Get count of invoices created today to generate unique number
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const todayEnd = new Date(todayStart)
        todayEnd.setDate(todayEnd.getDate() + 1)

        const todayInvoicesCount = await prisma.invoice.count({
            where: {
                vendorId: vendor.id,
                createdAt: {
                    gte: todayStart,
                    lt: todayEnd
                }
            }
        })

        const invoiceNumber = `INV-${dateStr}-${String(todayInvoicesCount + 1).padStart(5, '0')}`

        // Create the invoice
        await prisma.invoice.create({
            data: {
                vendorId: vendor.id,
                orderId,
                invoiceNumber,
                amount,
                tax,
                total,
                status: 'PENDING'
            }
        })

        revalidatePath('/seller/finance/invoices')
        return { success: true }
    } catch (error) {
        console.error('Error creating invoice:', error)
        return { success: false, error: 'Failed to create invoice' }
    }
}

// ============================================================================
// Seller Product Reviews
// ============================================================================

/**
 * Get reviews for seller's products
 */
export async function getSellerProductReviews(
    page: number = 1,
    pageSize: number = 10,
    productId?: string,
    rating?: number
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found', data: [], total: 0 }
        }

        const skip = (page - 1) * pageSize

        const whereClause: any = {
            product: { vendorId: vendor.id }
        }

        if (productId) {
            whereClause.productId = productId
        }

        if (rating) {
            whereClause.rating = rating
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            thumbnail: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.review.count({ where: whereClause })
        ])

        return {
            success: true,
            data: reviews.map((review: any) => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt.toISOString(),
                user: review.user,
                product: review.product
            })),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching seller product reviews:', error)
        return { success: false, error: 'Failed to fetch reviews', data: [], total: 0 }
    }
}

/**
 * Get seller review statistics
 */
export async function getSellerReviewStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true, averageRating: true, totalReviews: true }
        })

        if (!vendor) {
            return {
                success: false,
                error: 'Vendor not found',
                data: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    recentReviewsCount: 0
                }
            }
        }

        const [ratingDistribution, recentReviewsCount] = await Promise.all([
            prisma.review.groupBy({
                by: ['rating'],
                where: {
                    product: { vendorId: vendor.id }
                },
                _count: { rating: true }
            }),
            prisma.review.count({
                where: {
                    product: { vendorId: vendor.id },
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                }
            })
        ])

        // Format rating distribution
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        ratingDistribution.forEach((item: any) => {
            distribution[item.rating] = item._count.rating
        })

        return {
            success: true,
            data: {
                totalReviews: vendor.totalReviews,
                averageRating: vendor.averageRating,
                ratingDistribution: distribution,
                recentReviewsCount,
            }
        }
    } catch (error) {
        console.error('Error fetching seller review stats:', error)
        return {
            success: false,
            error: 'Failed to fetch review stats',
            data: {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                recentReviewsCount: 0
            }
        }
    }
}

/**
 * Get products with reviews summary for seller
 */
export async function getSellerProductsWithReviews() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found', data: [] }
        }

        const products = await prisma.product.findMany({
            where: { vendorId: vendor.id },
            select: {
                id: true,
                name: true,
                thumbnail: true,
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return {
            success: true,
            data: products.map((product: { id: string; name: string; thumbnail: string | null; reviews: { rating: number }[] }) => ({
                id: product.id,
                name: product.name,
                thumbnail: product.thumbnail,
                reviewCount: product.reviews.length,
                averageRating: product.reviews.length > 0
                    ? Math.round((product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length) * 10) / 10
                    : 0
            }))
        }
    } catch (error) {
        console.error('Error fetching seller products with reviews:', error)
        return { success: false, error: 'Failed to fetch products', data: [] }
    }
}

// ============================================================================
// Vendor Gift Card Management
// ============================================================================

/**
 * Generate a secure gift card code
 */
function generateGiftCardCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    const randomBytes = crypto.randomBytes(16)

    for (let i = 0; i < 16; i++) {
        code += chars[randomBytes[i] % chars.length]
        if ((i + 1) % 4 === 0 && i < 15) {
            code += '-'
        }
    }

    return code
}

/**
 * Create a gift card for customers
 */
export async function createVendorGiftCard(data: {
    amount: number
    currency?: string
    expiresAt?: Date
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        if (data.amount <= 0) {
            return { success: false, error: 'Amount must be greater than 0' }
        }

        // Generate unique code
        let code = generateGiftCardCode()
        let attempts = 0

        // Ensure code is unique
        while (attempts < 10) {
            const existing = await prisma.giftCard.findUnique({
                where: { code }
            })
            if (!existing) break
            code = generateGiftCardCode()
            attempts++
        }

        const giftCard = await prisma.giftCard.create({
            data: {
                code,
                amount: data.amount,
                balance: data.amount,
                currency: data.currency || 'USD',
                status: 'ACTIVE',
                expiresAt: data.expiresAt,
                createdById: session.user.id,
                vendorId: vendor.id
            }
        })

        revalidatePath('/seller/gift-cards')

        return {
            success: true,
            data: {
                id: giftCard.id,
                code: giftCard.code,
                amount: giftCard.amount,
                currency: giftCard.currency,
                expiresAt: giftCard.expiresAt
            }
        }
    } catch (error) {
        console.error('Error creating vendor gift card:', error)
        return { success: false, error: 'Failed to create gift card' }
    }
}

/**
 * Get list of gift cards created by vendor
 */
export async function getVendorGiftCards(
    page: number = 1,
    pageSize: number = 10,
    status?: string
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found', data: [], total: 0 }
        }

        const skip = (page - 1) * pageSize

        const whereClause: any = {
            vendorId: vendor.id
        }

        if (status && status !== 'all') {
            whereClause.status = status
        }

        const [giftCards, total] = await Promise.all([
            prisma.giftCard.findMany({
                where: whereClause,
                include: {
                    redemptions: {
                        select: {
                            id: true,
                            amount: true,
                            createdAt: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.giftCard.count({ where: whereClause })
        ])

        return {
            success: true,
            data: giftCards.map((gc: { id: string; code: string; amount: number; balance: number; currency: string; status: string; expiresAt: Date | null; createdAt: Date; redemptions: { id: string; amount: number; createdAt: Date; user: { name: string | null; email: string | null } }[] }) => ({
                id: gc.id,
                code: gc.code,
                amount: gc.amount,
                balance: gc.balance,
                currency: gc.currency,
                status: gc.status,
                expiresAt: gc.expiresAt?.toISOString(),
                createdAt: gc.createdAt.toISOString(),
                redemptions: gc.redemptions.map((r: { id: string; amount: number; createdAt: Date; user: { name: string | null; email: string | null } }) => ({
                    id: r.id,
                    amount: r.amount,
                    createdAt: r.createdAt.toISOString(),
                    user: r.user
                }))
            })),
            total,
            pagination: {
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    } catch (error) {
        console.error('Error fetching vendor gift cards:', error)
        return { success: false, error: 'Failed to fetch gift cards', data: [], total: 0 }
    }
}

/**
 * Deactivate/void a gift card
 */
export async function deactivateVendorGiftCard(giftCardId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        // Verify ownership
        const giftCard = await prisma.giftCard.findUnique({
            where: { id: giftCardId }
        })

        if (!giftCard || giftCard.vendorId !== vendor.id) {
            return { success: false, error: 'Gift card not found' }
        }

        if (giftCard.status !== 'ACTIVE') {
            return { success: false, error: 'Gift card is not active' }
        }

        await prisma.giftCard.update({
            where: { id: giftCardId },
            data: { status: 'VOIDED' }
        })

        revalidatePath('/seller/gift-cards')

        return { success: true }
    } catch (error) {
        console.error('Error deactivating gift card:', error)
        return { success: false, error: 'Failed to deactivate gift card' }
    }
}

/**
 * Get gift card statistics for vendor
 */
export async function getVendorGiftCardStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return {
                success: false,
                error: 'Vendor not found',
                data: {
                    totalIssued: 0,
                    totalIssuedAmount: 0,
                    totalRedeemed: 0,
                    totalRedeemedAmount: 0,
                    activeCards: 0,
                    activeBalance: 0
                }
            }
        }

        const [
            totalIssued,
            activeCards,
            redeemedCards,
            totals,
            redemptionTotals
        ] = await Promise.all([
            prisma.giftCard.count({ where: { vendorId: vendor.id } }),
            prisma.giftCard.count({ where: { vendorId: vendor.id, status: 'ACTIVE' } }),
            prisma.giftCard.count({ where: { vendorId: vendor.id, status: 'REDEEMED' } }),
            prisma.giftCard.aggregate({
                where: { vendorId: vendor.id },
                _sum: { amount: true, balance: true }
            }),
            prisma.giftCardRedemption.aggregate({
                where: { giftCard: { vendorId: vendor.id } },
                _sum: { amount: true }
            })
        ])

        return {
            success: true,
            data: {
                totalIssued,
                totalIssuedAmount: totals._sum.amount || 0,
                totalRedeemed: redeemedCards,
                totalRedeemedAmount: redemptionTotals._sum.amount || 0,
                activeCards,
                activeBalance: totals._sum.balance || 0
            }
        }
    } catch (error) {
        console.error('Error fetching vendor gift card stats:', error)
        return {
            success: false,
            error: 'Failed to fetch gift card stats',
            data: {
                totalIssued: 0,
                totalIssuedAmount: 0,
                totalRedeemed: 0,
                totalRedeemedAmount: 0,
                activeCards: 0,
                activeBalance: 0
            }
        }
    }
}

// ============================================================================
// Brand Settings
// ============================================================================

export async function getBrandSettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: {
                name: true,
                description: true, // Slogan
                bio: true, // Short description
                avatar: true,
                coverImage: true,
                themeColor: true,
                socialLinks: true
            }
        })

        if (!vendor) {
            return null
        }

        return {
            name: vendor.name,
            description: vendor.description,
            bio: vendor.bio,
            avatar: vendor.avatar,
            coverImage: vendor.coverImage,
            themeColor: vendor.themeColor,
            socialLinks: vendor.socialLinks
        }
    } catch (error) {
        console.error('Error fetching brand settings:', error)
        return null
    }
}

export async function updateBrandSettings(data: {
    name: string
    description?: string
    bio?: string
    avatar?: string
    coverImage?: string
    themeColor?: string
    socialLinks?: any
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        await prisma.vendor.update({
            where: { id: vendor.id },
            data: {
                name: data.name,
                description: data.description,
                bio: data.bio,
                avatar: data.avatar,
                coverImage: data.coverImage,
                themeColor: data.themeColor,
                socialLinks: data.socialLinks
            }
        })

        revalidatePath('/seller/settings/brand')
        return { success: true }
    } catch (error) {
        console.error('Error updating brand settings:', error)
        return { success: false, error: 'Failed to update brand settings' }
    }
}

export async function updateStoreDetails(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) throw new Error('Unauthorized')

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) throw new Error('Vendor not found')

        await prisma.vendor.update({
            where: { id: vendor.id },
            data: {
                name: data.name,
                description: data.description,
                location: data.location,
            }
        })

        revalidatePath('/seller/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating store details:', error)
        return { success: false, error: 'Failed to update store details' }
    }
}

export async function updateStoreDefaults(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) throw new Error('Unauthorized')

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) throw new Error('Vendor not found')

        await prisma.vendor.update({
            where: { id: vendor.id },
            data: {
                // Map data to schema fields if they exist
            }
        })

        revalidatePath('/seller/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating store defaults:', error)
        return { success: false, error: 'Failed to update store defaults' }
    }
}

export async function updateOrderProcessing(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) throw new Error('Unauthorized')

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) throw new Error('Vendor not found')

        // Update logic here

        revalidatePath('/seller/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating order processing:', error)
        return { success: false, error: 'Failed to update order processing' }
    }
}

export async function updateOrderIdFormat(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) throw new Error('Unauthorized')

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) throw new Error('Vendor not found')

        // Update logic here

        revalidatePath('/seller/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating order ID format:', error)
        return { success: false, error: 'Failed to update order ID format' }
    }
}
