import { prisma } from '@/lib/db'

export class ContextService {
    static async getUserContext(userId?: string) {
        if (!userId) return null

        try {
            // Fetch user basic info and recent orders
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    orders: {
                        take: 3,
                        orderBy: { createdAt: 'desc' },
                        select: {
                            id: true,
                            status: true,
                            totalAmount: true,
                            createdAt: true,
                            items: {
                                select: {
                                    product: {
                                        select: { name: true },
                                    },
                                },
                            },
                        },
                    },
                },
            })

            if (!user) return null

            return {
                name: user.name,
                email: user.email,
                role: (user as any).role || 'USER', // Fallback if role is not typed yet
                recentOrders: user.orders.map((o: any) => ({
                    id: o.id,
                    status: o.status,
                    total: o.totalAmount,
                    date: o.createdAt.toISOString().split('T')[0],
                    items: o.items.map((i: any) => i.product.name).join(', '),
                })),
            }
        } catch (error) {
            console.error('Error fetching user context:', error)
            return null
        }
    }

    static async getProductContext(productId?: string) {
        if (!productId) return null

        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: {
                    name: true,
                    price: true,
                    description: true,
                    category: true,
                },
            })

            return product
        } catch (error) {
            console.error('Error fetching product context:', error)
            return null
        }
    }
}
