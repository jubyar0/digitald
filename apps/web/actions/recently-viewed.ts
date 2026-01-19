'use server'

import { prisma } from '@/lib/db'

/**
 * Get recently viewed products by their IDs
 */
export async function getRecentlyViewedProducts(productIds: string[]) {
    try {
        if (!productIds || productIds.length === 0) {
            return []
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                },
                status: 'PUBLISHED',
                isActive: true,
                isDraft: false
            },
            select: {
                id: true,
                name: true,
                price: true,
                thumbnail: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                createdAt: true
            },
            take: 6
        })

        // Sort products by the order of productIds
        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean)

        return sortedProducts
    } catch (error) {
        console.error('Error fetching recently viewed products:', error)
        return []
    }
}
