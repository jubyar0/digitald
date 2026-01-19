'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { DiscountType } from '@repo/database'

export async function getCategoryDiscounts(page = 1, pageSize = 15, search = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.name = { contains: search, mode: 'insensitive' }
        }

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { name: 'asc' },
                include: {
                    parent: {
                        select: { name: true },
                    },
                    _count: {
                        select: { products: true },
                    },
                    // We need to distinguish between in-house and seller products.
                    // This is complex without a clear "in-house" flag on products or vendors.
                    // For now, we will fetch all products and filter in memory or use a raw query if performance is an issue.
                    // However, Prisma doesn't support filtering relation counts easily in the same query without raw SQL or complex where clauses.
                    // Let's try to approximate:
                    // In-house products = products where vendor.user.role == 'ADMIN' (Assumption)
                    // Seller products = products where vendor.user.role != 'ADMIN'
                    products: {
                        select: {
                            vendor: {
                                select: {
                                    user: {
                                        select: {
                                            role: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }),
            prisma.category.count({ where }),
        ])

        // Process categories to count in-house vs seller products
        const processedCategories = categories.map((cat) => {
            let inHouseProducts = 0
            let sellerProducts = 0

            cat.products.forEach((prod) => {
                if (prod.vendor.user.role === 'ADMIN') {
                    inHouseProducts++
                } else {
                    sellerProducts++
                }
            })

            return {
                id: cat.id,
                // icon: cat.icon,
                name: cat.name,
                parentCategory: cat.parent?.name || '—',
                inHouseProducts,
                sellerProducts,
                // presentDiscount: cat.discountAmount || 0,
                // discountType: cat.discountType || 'PERCENTAGE',
                // discountStartDate: cat.discountStartDate,
                // discountEndDate: cat.discountEndDate,
                // isSellerProductDiscountEnabled: cat.isSellerProductDiscountEnabled,
            }
        })

        return {
            data: processedCategories,
            total,
            page,
            pageSize,
        }
    } catch (error) {
        console.error('Error fetching category discounts:', error)
        throw new Error('Failed to fetch category discounts')
    }
}

export async function updateCategoryDiscount(
    categoryId: string,
    data: {
        discountAmount: number
        discountType: DiscountType
        discountStartDate?: Date
        discountEndDate?: Date
        isSellerProductDiscountEnabled?: boolean
    }
) {
    try {
        await prisma.category.update({
            where: { id: categoryId },
            data: {
                // discountAmount: data.discountAmount,
                // discountType: data.discountType,
                // discountStartDate: data.discountStartDate,
                // discountEndDate: data.discountEndDate,
                // isSellerProductDiscountEnabled: data.isSellerProductDiscountEnabled,
            },
        })

        revalidatePath('/admin/products/category-discounts')
        return { success: true }
    } catch (error) {
        console.error('Error updating category discount:', error)
        throw new Error('Failed to update category discount')
    }
}
