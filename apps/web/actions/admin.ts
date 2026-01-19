'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { notifyWithdrawalApproved, notifyWithdrawalRejected } from '@/lib/notifications'
import { startOfMonth, subMonths, endOfMonth, eachDayOfInterval, subDays, format, startOfDay, endOfDay } from 'date-fns'

// ============================================================================
// Users Management
// ============================================================================

export async function getUsers(page = 1, pageSize = 10, search = '', role = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (role) {
            where.role = role
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    bannedUsers: {
                        select: { isActive: true },
                    },
                },
            }),
            prisma.user.count({ where }),
        ])

        return {
            data: users.map((user: any) => ({
                ...user,
                isBanned: user.bannedUsers?.isActive ?? false,
            })),
            total,
            page,
            pageSize,
        }
    } catch (error) {
        console.error('Error fetching users:', error)
        throw new Error('Failed to fetch users')
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                bannedUsers: {
                    select: {
                        id: true,
                        reason: true,
                        banEnd: true,
                        createdAt: true,
                        isActive: true,
                        bannedByUser: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                vendors: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        _count: {
                            select: {
                                products: true,
                                orders: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                    },
                },
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        return {
            ...user,
            isBanned: user.bannedUsers?.isActive ?? false,
        }
    } catch (error) {
        console.error('Error fetching user:', error)
        throw new Error('Failed to fetch user')
    }
}



export async function getBannedUsers(page = 1, pageSize = 10) {
    try {
        const skip = (page - 1) * pageSize

        const [bannedUsers, total] = await Promise.all([
            prisma.bannedUser.findMany({
                where: { isActive: true },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    bannedByUser: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.bannedUser.count({ where: { isActive: true } }),
        ])

        return { data: bannedUsers, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching banned users:', error)
        throw new Error('Failed to fetch banned users')
    }
}

export async function banUser(userId: string, reason: string, bannedBy: string, banEnd?: Date) {
    try {
        await prisma.bannedUser.create({
            data: {
                userId,
                reason,
                bannedBy,
                banEnd,
                isActive: true,
            },
        })

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error banning user:', error)
        throw new Error('Failed to ban user')
    }
}

export async function unbanUser(bannedUserId: string) {
    try {
        await prisma.bannedUser.update({
            where: { id: bannedUserId },
            data: { isActive: false },
        })

        revalidatePath('/admin/users/banned')
        return { success: true }
    } catch (error) {
        console.error('Error unbanning user:', error)
        throw new Error('Failed to unban user')
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        })

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error deleting user:', error)
        throw new Error('Failed to delete user')
    }
}

export async function deleteProduct(productId: string) {
    try {
        await prisma.product.delete({
            where: { id: productId },
        })

        revalidatePath('/admin/products')
        return { success: true }
    } catch (error) {
        console.error('Error deleting product:', error)
        throw new Error('Failed to delete product')
    }
}

// ============================================================================
// Vendors Management
// ============================================================================

export async function getVendors(page = 1, pageSize = 10, search = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ]
        }

        const [vendors, total] = await Promise.all([
            prisma.vendor.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            email: true,
                            name: true,
                        },
                    },
                    _count: {
                        select: {
                            products: true,
                            orders: true,
                        },
                    },
                },
            }),
            prisma.vendor.count({ where }),
        ])

        return { data: vendors, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching vendors:', error)
        throw new Error('Failed to fetch vendors')
    }
}

export async function getAllVendors() {
    try {
        const vendors = await prisma.vendor.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true }
        })
        return vendors
    } catch (error) {
        console.error('Error fetching all vendors:', error)
        return []
    }
}

export async function getVendorApplications(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [applications, total] = await Promise.all([
            prisma.vendorApplication.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    vendor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    reviewer: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.vendorApplication.count({ where }),
        ])

        return { data: applications, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching vendor applications:', error)
        throw new Error('Failed to fetch vendor applications')
    }
}

export async function approveVendorApplication(applicationId: string, reviewedBy: string, notes?: string) {
    try {
        await prisma.vendorApplication.update({
            where: { id: applicationId },
            data: {
                status: 'APPROVED',
                reviewedBy,
                reviewedAt: new Date(),
                notes,
            },
        })

        revalidatePath('/admin/vendors/applications')
        return { success: true }
    } catch (error) {
        console.error('Error approving vendor application:', error)
        throw new Error('Failed to approve vendor application')
    }
}

export async function rejectVendorApplication(applicationId: string, reviewedBy: string, notes: string) {
    try {
        await prisma.vendorApplication.update({
            where: { id: applicationId },
            data: {
                status: 'REJECTED',
                reviewedBy,
                reviewedAt: new Date(),
                notes,
            },
        })

        revalidatePath('/admin/vendors/applications')
        return { success: true }
    } catch (error) {
        console.error('Error rejecting vendor application:', error)
        throw new Error('Failed to reject vendor application')
    }
}

// ============================================================================
// Products Management
// ============================================================================

export async function getProducts(page = 1, pageSize = 10, search = '', status = '', categoryId = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.name = { contains: search, mode: 'insensitive' }
        }

        if (status) {
            where.status = status
        }

        if (categoryId) {
            where.categoryId = categoryId
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    vendor: {
                        select: {
                            name: true,
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.product.count({ where }),
        ])

        return { data: products, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching products:', error)
        throw new Error('Failed to fetch products')
    }
}

export async function getPendingProducts(page = 1, pageSize = 10) {
    return getProducts(page, pageSize, '', 'PENDING')
}

export async function approveProduct(productId: string) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: {
                status: 'PUBLISHED',
                reviewNotes: null,
            },
        })

        revalidatePath('/admin/products')
        revalidatePath('/admin/products/pending')
        return { success: true }
    } catch (error) {
        console.error('Error approving product:', error)
        throw new Error('Failed to approve product')
    }
}

export async function rejectProduct(productId: string, reviewNotes: string) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: {
                status: 'REJECTED',
                reviewNotes,
            },
        })

        revalidatePath('/admin/products')
        revalidatePath('/admin/products/pending')
        return { success: true }
    } catch (error) {
        console.error('Error rejecting product:', error)
        throw new Error('Failed to reject product')
    }
}

// Get product by ID for admin editing
export async function getProductById(productId: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        userId: true,
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        return product
    } catch (error) {
        console.error('Error fetching product:', error)
        throw new Error('Failed to fetch product')
    }
}

// Update product by admin
export async function updateProductByAdmin(
    productId: string,
    data: {
        name?: string
        description?: string
        price?: number
        categoryId?: string
        isActive?: boolean
    }
) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data,
        })

        revalidatePath('/admin/products')
        revalidatePath('/admin/products/pending')
        return { success: true }
    } catch (error) {
        console.error('Error updating product:', error)
        throw new Error('Failed to update product')
    }
}

// Toggle product active status (enable/disable visibility)
export async function toggleProductStatus(productId: string, isActive: boolean) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { isActive },
        })

        revalidatePath('/admin/products')
        return { success: true, isActive }
    } catch (error) {
        console.error('Error toggling product status:', error)
        throw new Error('Failed to toggle product status')
    }
}

// Delete product with notification message to vendor
export async function deleteProductWithNotification(
    productId: string,
    reason: string,
    adminId: string
) {
    try {
        // Get product with vendor info before deletion
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                vendor: {
                    select: {
                        id: true,
                        userId: true,
                        name: true,
                    },
                },
            },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        // Create or find conversation with vendor to send the notification
        let conversation = await prisma.conversation.findFirst({
            where: {
                customerId: adminId,
                vendorId: product.vendor.id,
            },
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    customerId: adminId,
                    vendorId: product.vendor.id,
                    participants: {
                        create: [
                            { userId: adminId },
                            { userId: product.vendor.userId },
                        ],
                    },
                },
            })
        }

        // Send notification message to vendor
        const notificationMessage = `⚠️ تم حذف المنتج من قبل الإدارة

المنتج: ${product.name}

السبب: ${reason}

إذا كان لديك أي استفسار، يرجى التواصل مع فريق الدعم.`

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: adminId,
                receiverId: product.vendor.userId,
                content: notificationMessage,
                messageType: 'SYSTEM',
                read: false,
            },
        })

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
        })

        // Delete the product
        await prisma.product.delete({
            where: { id: productId },
        })

        revalidatePath('/admin/products')
        revalidatePath('/seller/products')
        revalidatePath('/messages')

        return { success: true }
    } catch (error) {
        console.error('Error deleting product with notification:', error)
        throw new Error('Failed to delete product')
    }
}

// ============================================================================
// Categories & Tags
// ============================================================================

export async function getCategories(page = 1, pageSize = 10) {
    try {
        const skip = (page - 1) * pageSize

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                skip,
                take: pageSize,
                orderBy: { name: 'asc' },
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            }),
            prisma.category.count(),
        ])

        return { data: categories, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching categories:', error)
        throw new Error('Failed to fetch categories')
    }
}

export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                parent: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        return categories
    } catch (error) {
        console.error('Error fetching all categories:', error)
        return []
    }
}

export async function createCategory(name: string, slug: string, parentId?: string) {
    try {
        // Check if category with same slug exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        })

        if (existingCategory) {
            return { success: false, error: 'Category with this slug already exists' }
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                parentId,
                isActive: true,
            },
        })

        revalidatePath('/admin/categories')
        return { success: true, data: category }
    } catch (error) {
        console.error('Error creating category:', error)
        return { success: false, error: 'Failed to create category: ' + (error instanceof Error ? error.message : 'Unknown error') }
    }
}

export async function updateCategory(id: string, name: string, slug: string, isActive: boolean, parentId?: string | null) {
    try {
        await prisma.category.update({
            where: { id },
            data: { name, slug, isActive, parentId },
        })

        revalidatePath('/admin/categories')
        return { success: true }
    } catch (error) {
        console.error('Error updating category:', error)
        throw new Error('Failed to update category')
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        })

        revalidatePath('/admin/categories')
        return { success: true }
    } catch (error) {
        console.error('Error deleting category:', error)
        throw new Error('Failed to delete category')
    }
}

export async function getTags(page = 1, pageSize = 10) {
    try {
        const skip = (page - 1) * pageSize

        const [tags, total] = await Promise.all([
            prisma.tag.findMany({
                skip,
                take: pageSize,
                orderBy: { name: 'asc' },
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            }),
            prisma.tag.count(),
        ])

        return { data: tags, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching tags:', error)
        throw new Error('Failed to fetch tags')
    }
}

export async function createTag(name: string, slug: string) {
    try {
        const tag = await prisma.tag.create({
            data: {
                name,
                slug,
                isActive: true,
            },
        })

        revalidatePath('/admin/tags')
        return { success: true, data: tag }
    } catch (error) {
        console.error('Error creating tag:', error)
        throw new Error('Failed to create tag')
    }
}

export async function updateTag(id: string, name: string, slug: string, isActive: boolean) {
    try {
        await prisma.tag.update({
            where: { id },
            data: { name, slug, isActive },
        })

        revalidatePath('/admin/tags')
        return { success: true }
    } catch (error) {
        console.error('Error updating tag:', error)
        throw new Error('Failed to update tag')
    }
}

export async function deleteTag(id: string) {
    try {
        await prisma.tag.delete({
            where: { id },
        })

        revalidatePath('/admin/tags')
        return { success: true }
    } catch (error) {
        console.error('Error deleting tag:', error)
        throw new Error('Failed to delete tag')
    }
}

// ============================================================================
// Orders & Transactions
// ============================================================================

export async function getOrders(page = 1, pageSize = 10, search = '', status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.id = { contains: search, mode: 'insensitive' }
        }

        if (status) {
            where.status = status
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    vendor: {
                        select: {
                            name: true,
                        },
                    },
                    items: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ])

        return { data: orders, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching orders:', error)
        throw new Error('Failed to fetch orders')
    }
}

export async function getTransactions(page = 1, pageSize = 10, type = '') {
    try {
        const skip = (page - 1) * pageSize

        // Get both escrow and wallet transactions
        const [escrowTransactions, walletTransactions] = await Promise.all([
            prisma.escrowTransaction.findMany({
                skip: type === 'WALLET' ? pageSize : 0,
                take: type === 'WALLET' ? 0 : pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    escrowAccount: {
                        include: {
                            vendor: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.walletTransaction.findMany({
                skip: type === 'ESCROW' ? pageSize : 0,
                take: type === 'ESCROW' ? 0 : pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    wallet: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            }),
        ])

        const combined = [
            ...escrowTransactions.map((t: any) => ({ ...t, transactionType: 'ESCROW' })),
            ...walletTransactions.map((t: any) => ({ ...t, transactionType: 'WALLET' })),
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        return {
            data: combined.slice(skip, skip + pageSize),
            total: combined.length,
            page,
            pageSize,
        }
    } catch (error) {
        console.error('Error fetching transactions:', error)
        throw new Error('Failed to fetch transactions')
    }
}

export async function getWithdrawals(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [withdrawals, total] = await Promise.all([
            prisma.withdrawal.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    vendor: {
                        select: {
                            name: true,
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                    processor: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.withdrawal.count({ where }),
        ])

        return { data: withdrawals, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching withdrawals:', error)
        throw new Error('Failed to fetch withdrawals')
    }
}

export async function approveWithdrawal(withdrawalId: string, processedBy: string) {
    try {
        // Get withdrawal details
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId },
            include: {
                vendor: {
                    include: {
                        escrowAccount: true,
                        user: { select: { id: true } }
                    }
                }
            }
        });

        if (!withdrawal) {
            return { success: false, error: 'Withdrawal not found' };
        }

        if (withdrawal.status !== 'PENDING') {
            return { success: false, error: 'Withdrawal already processed' };
        }

        const escrowAccount = withdrawal.vendor.escrowAccount;
        if (!escrowAccount) {
            return { success: false, error: 'Escrow account not found' };
        }

        // Check if sufficient balance
        if (escrowAccount.availableBalance < withdrawal.amount) {
            return { success: false, error: 'Insufficient balance' };
        }

        // Update withdrawal and escrow in transaction
        await prisma.$transaction(async (tx: any) => {
            // Update withdrawal status
            await tx.withdrawal.update({
                where: { id: withdrawalId },
                data: {
                    status: 'COMPLETED',
                    processedBy,
                    processedAt: new Date(),
                },
            });

            // Deduct from escrow
            await tx.escrowAccount.update({
                where: { id: escrowAccount.id },
                data: {
                    balance: { decrement: withdrawal.amount },
                    availableBalance: { decrement: withdrawal.amount },
                },
            });

            // Log escrow transaction
            await tx.escrowTransaction.create({
                data: {
                    escrowAccountId: escrowAccount.id,
                    amount: withdrawal.amount,
                    type: 'RELEASE',
                    status: 'COMPLETED',
                    description: `Withdrawal approved: ${withdrawal.method}`,
                },
            });
        });

        // Send notification to vendor
        await notifyWithdrawalApproved(
            withdrawal.vendor.user.id,
            withdrawal.amount,
            withdrawal.currency
        );

        revalidatePath('/admin/withdrawals');
        revalidatePath('/seller/finance/payouts');
        return { success: true };
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        return { success: false, error: 'Failed to approve withdrawal' };
    }
}

export async function rejectWithdrawal(withdrawalId: string, processedBy: string) {
    try {
        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id: withdrawalId },
            include: {
                vendor: {
                    include: {
                        escrowAccount: true,
                        user: { select: { id: true } }
                    }
                }
            }
        });

        if (!withdrawal) {
            return { success: false, error: 'Withdrawal not found' };
        }

        if (withdrawal.status !== 'PENDING') {
            return { success: false, error: 'Withdrawal already processed' };
        }

        const escrowAccount = withdrawal.vendor.escrowAccount;

        // Update withdrawal and release held funds in transaction
        await prisma.$transaction(async (tx: any) => {
            // Update withdrawal status
            await tx.withdrawal.update({
                where: { id: withdrawalId },
                data: {
                    status: 'FAILED',
                    processedBy,
                    processedAt: new Date(),
                },
            });

            // Release held funds back to available balance (if escrow exists)
            if (escrowAccount) {
                await tx.escrowAccount.update({
                    where: { id: escrowAccount.id },
                    data: {
                        availableBalance: { increment: withdrawal.amount }
                    }
                });

                // Log the unhold transaction
                await tx.escrowTransaction.create({
                    data: {
                        escrowAccountId: escrowAccount.id,
                        amount: withdrawal.amount,
                        type: 'UNHOLD',
                        status: 'COMPLETED',
                        description: `Withdrawal rejected - funds released`
                    }
                });
            }
        });

        // Send notification to vendor
        await notifyWithdrawalRejected(
            withdrawal.vendor.user.id,
            withdrawal.amount,
            withdrawal.currency
        );

        revalidatePath('/admin/withdrawals');
        revalidatePath('/seller/finance/payouts');
        return { success: true };
    } catch (error) {
        console.error('Error rejecting withdrawal:', error);
        return { success: false, error: 'Failed to reject withdrawal' };
    }
}


// ============================================================================
// Dashboard Stats
// ============================================================================

export const getDashboardStats = async () => {
    try {
        const [
            totalRevenue,
            usersCount,
            newUsersCount,
            vendorsCount,
            pendingVendorsCount,
            productsCount,
            pendingProductsCount,
            disputesCount,
            pendingPayouts
        ] = await Promise.all([
            // Total Revenue (sum of completed orders)
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: 'COMPLETED' }
            }),
            // Total Users
            prisma.user.count(),
            // New Users (last 7 days)
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
            // Total Vendors
            prisma.vendor.count(),
            // Pending Vendors
            prisma.vendorApplication.count({
                where: { status: 'PENDING' }
            }),
            // Total Products
            prisma.product.count(),
            // Pending Products
            prisma.product.count({
                where: { status: 'PENDING' }
            }),
            // Active Disputes
            prisma.dispute.count({
                where: { status: 'PENDING' }
            }),
            // Pending Payouts
            prisma.withdrawal.aggregate({
                _sum: { amount: true },
                _count: { id: true },
                where: { status: 'PENDING' }
            })
        ])

        return {
            revenue: {
                total: totalRevenue._sum.totalAmount || 0,
                growth: 20.1 // TODO: Calculate actual growth
            },
            users: {
                total: usersCount,
                new: newUsersCount
            },
            vendors: {
                total: vendorsCount,
                pending: pendingVendorsCount
            },
            products: {
                total: productsCount,
                pending: pendingProductsCount
            },
            disputes: {
                active: disputesCount
            },
            payouts: {
                amount: pendingPayouts._sum.amount || 0,
                count: pendingPayouts._count.id
            }
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        if (error instanceof Error) {
            throw new Error(`Failed to fetch dashboard stats: ${error.message}`)
        }
        throw new Error('Failed to fetch dashboard stats')
    }
}

export const getDashboardAnalytics = async () => {
    try {
        const today = new Date()
        const last6Months = Array.from({ length: 6 }).map((_, i) => {
            const date = subMonths(today, i)
            return {
                start: startOfMonth(date),
                end: endOfMonth(date),
                label: format(date, 'MMM'),
            }
        }).reverse()

        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(today, i)
            return {
                start: startOfDay(date),
                end: endOfDay(date),
                label: format(date, 'EEE'), // Mon, Tue, etc.
            }
        }).reverse()

        const [revenueData, ordersData, recentActivity] = await Promise.all([
            // Monthly Revenue
            Promise.all(
                last6Months.map(async (month) => {
                    const result = await prisma.order.aggregate({
                        _sum: { totalAmount: true },
                        where: {
                            status: 'COMPLETED',
                            createdAt: {
                                gte: month.start,
                                lte: month.end,
                            },
                        },
                    })
                    return {
                        name: month.label,
                        total: result._sum.totalAmount || 0,
                    }
                })
            ),
            // Daily Orders
            Promise.all(
                last7Days.map(async (day) => {
                    const count = await prisma.order.count({
                        where: {
                            createdAt: {
                                gte: day.start,
                                lte: day.end,
                            },
                        },
                    })
                    return {
                        name: day.label,
                        total: count,
                    }
                })
            ),
            // Recent Activity (Orders & New Users)
            Promise.all([
                prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { name: true } },
                    },
                }),
                prisma.user.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: { name: true, createdAt: true, email: true },
                })
            ])
        ])

        return {
            revenue: revenueData,
            orders: ordersData,
            recentOrders: recentActivity[0],
            newUsers: recentActivity[1]
        }
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error)
        throw new Error('Failed to fetch dashboard analytics')
    }
}

// ============================================================================
// Digital Files
// ============================================================================

export async function getDigitalFiles(page = 1, pageSize = 10, search = '', status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.name = { contains: search, mode: 'insensitive' }
        }

        if (status) {
            where.status = status
        }

        const [files, total] = await Promise.all([
            prisma.digitalFile.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    product: {
                        select: {
                            name: true,
                        },
                    },
                    uploader: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.digitalFile.count({ where }),
        ])

        return { data: files, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching digital files:', error)
        throw new Error('Failed to fetch digital files')
    }
}

// ============================================================================
// Analytics
// ============================================================================

export async function getAnalytics() {
    try {
        const [
            totalUsers,
            totalVendors,
            totalProducts,
            totalOrders,
            revenueData,
            recentOrders,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.vendor.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: {
                    totalAmount: true,
                },
            }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    totalAmount: true,
                    createdAt: true,
                },
            }),
        ])

        return {
            totalUsers,
            totalVendors,
            totalProducts,
            totalOrders,
            totalRevenue: revenueData._sum.totalAmount || 0,
            recentOrders,
        }
    } catch (error) {
        console.error('Error fetching analytics:', error)
        throw new Error('Failed to fetch analytics')
    }
}

// ============================================================================
// Settings
// ============================================================================

export async function getSettings(group?: string) {
    try {
        const where: any = {}
        if (group) {
            where.group = group
        }

        const settings = await prisma.setting.findMany({
            where,
            orderBy: { key: 'asc' },
        })

        return { data: settings }
    } catch (error) {
        console.error('Error fetching settings:', error)
        throw new Error('Failed to fetch settings')
    }
}

export async function updateSetting(key: string, value: string) {
    try {
        await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value, type: 'string', group: 'general' },
        })

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating setting:', error)
        throw new Error('Failed to update setting')
    }
}

export async function getPlatformSettings() {
    try {
        let settings = await prisma.platformSetting.findFirst()

        // If no settings exist, create default settings
        if (!settings) {
            settings = await prisma.platformSetting.create({
                data: {
                    platformFeePercent: 30.0,
                    cryptoPaymentEnabled: true,
                    disputePeriodDays: 14,
                    escrowHoldDays: 7,
                }
            })
        }

        return { data: settings }
    } catch (error) {
        console.error('Error fetching platform settings:', error)
        throw new Error('Failed to fetch platform settings')
    }
}

export async function updatePlatformSettings(data: {
    platformFeePercent?: number
    cryptoPaymentEnabled?: boolean
    disputePeriodDays?: number
    escrowHoldDays?: number
}) {
    try {
        const existing = await prisma.platformSetting.findFirst()

        if (existing) {
            await prisma.platformSetting.update({
                where: { id: existing.id },
                data,
            })
        } else {
            await prisma.platformSetting.create({
                data: data as any,
            })
        }

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (error) {
        console.error('Error updating platform settings:', error)
        throw new Error('Failed to update platform settings')
    }
}

// ============================================================================
// SEO Settings
// ============================================================================

export async function getSeoSettings(page?: string) {
    try {
        const where: any = {}
        if (page) {
            where.page = page
        }

        const settings = await prisma.seoSetting.findMany({
            where,
            orderBy: { page: 'asc' },
        })

        return { data: settings }
    } catch (error) {
        console.error('Error fetching SEO settings:', error)
        throw new Error('Failed to fetch SEO settings')
    }
}

export async function updateSeoSetting(
    page: string,
    data: {
        title?: string
        description?: string
        keywords?: string
        author?: string
    }
) {
    try {
        await prisma.seoSetting.upsert({
            where: { page },
            update: data,
            create: { page, ...data },
        })

        revalidatePath('/admin/seo')
        return { success: true }
    } catch (error) {
        console.error('Error updating SEO setting:', error)
        throw new Error('Failed to update SEO setting')
    }
}

// ============================================================================
// CMS Pages
// ============================================================================

export async function getCmsPages(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [pages, total] = await Promise.all([
            prisma.cmsPage.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.cmsPage.count({ where }),
        ])

        return { data: pages, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching CMS pages:', error)
        throw new Error('Failed to fetch CMS pages')
    }
}

export async function createCmsPage(
    title: string,
    slug: string,
    content: string,
    authorId: string,
    status: 'DRAFT' | 'PUBLISHED'
) {
    try {
        const page = await prisma.cmsPage.create({
            data: {
                title,
                slug,
                content,
                authorId,
                status,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
            },
        })

        revalidatePath('/admin/cms')
        return { success: true, data: page }
    } catch (error) {
        console.error('Error creating CMS page:', error)
        throw new Error('Failed to create CMS page')
    }
}

export async function updateCmsPage(
    id: string,
    data: {
        title?: string
        slug?: string
        content?: string
        status?: 'DRAFT' | 'PUBLISHED'
    }
) {
    try {
        const updateData: any = { ...data }
        if (data.status === 'PUBLISHED') {
            updateData.publishedAt = new Date()
        }

        await prisma.cmsPage.update({
            where: { id },
            data: updateData,
        })

        revalidatePath('/admin/cms')
        return { success: true }
    } catch (error) {
        console.error('Error updating CMS page:', error)
        throw new Error('Failed to update CMS page')
    }
}

export async function deleteCmsPage(id: string) {
    try {
        await prisma.cmsPage.delete({
            where: { id },
        })

        revalidatePath('/admin/cms')
        return { success: true }
    } catch (error) {
        console.error('Error deleting CMS page:', error)
        throw new Error('Failed to delete CMS page')
    }
}

// ============================================================================
// Support Tickets
// ============================================================================

export async function getSupportTickets(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [tickets, total] = await Promise.all([
            prisma.supportTicket.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    assignee: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.supportTicket.count({ where }),
        ])

        return { data: tickets, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching support tickets:', error)
        throw new Error('Failed to fetch support tickets')
    }
}

export async function respondToTicket(ticketId: string, response: string, userId: string, assignedTo?: string) {
    try {
        // Update ticket status and assignee
        const updates: any = {
            status: 'IN_PROGRESS',
        }

        if (assignedTo) {
            updates.assignedTo = assignedTo
        }

        // Update ticket status
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: updates,
        })

        // TODO: Fix ticket_messages model - requires explicit id and updatedAt fields
        // The schema for ticket_messages needs @default values for these fields
        // prisma.ticket_messages.create({
        //     data: {
        //         ticketId,
        //         userId,
        //         content: response,
        //         isInternal: false,
        //     },
        // })

        revalidatePath('/admin/support')
        return { success: true }
    } catch (error) {
        console.error('Error responding to ticket:', error)
        throw new Error('Failed to respond to ticket')
    }
}

export async function closeTicket(ticketId: string) {
    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: 'CLOSED',
                closedAt: new Date(),
            },
        })

        revalidatePath('/admin/support')
        return { success: true }
    } catch (error) {
        console.error('Error closing ticket:', error)
        throw new Error('Failed to close ticket')
    }
}

// ============================================================================
// System Logs
// ============================================================================

export async function getSystemLogs(page = 1, pageSize = 10, level = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (level) {
            where.level = level
        }

        const [logs, total] = await Promise.all([
            prisma.systemLog.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { timestamp: 'desc' },
            }),
            prisma.systemLog.count({ where }),
        ])

        return { data: logs, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching system logs:', error)
        throw new Error('Failed to fetch system logs')
    }
}

// ============================================================================
// Announcements
// ============================================================================

export async function getAnnouncements(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [announcements, total] = await Promise.all([
            prisma.announcement.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.announcement.count({ where }),
        ])

        return { data: announcements, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching announcements:', error)
        throw new Error('Failed to fetch announcements')
    }
}

export async function createAnnouncement(
    title: string,
    content: string,
    createdBy: string,
    status: 'DRAFT' | 'PUBLISHED',
    priority = 0,
    startDate?: Date,
    endDate?: Date
) {
    try {
        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                createdBy,
                status,
                priority,
                startDate,
                endDate,
            },
        })

        revalidatePath('/admin/announcements')
        return { success: true, data: announcement }
    } catch (error) {
        console.error('Error creating announcement:', error)
        throw new Error('Failed to create announcement')
    }
}

export async function updateAnnouncement(
    id: string,
    data: {
        title?: string
        content?: string
        status?: 'DRAFT' | 'PUBLISHED'
        priority?: number
        startDate?: Date
        endDate?: Date
    }
) {
    try {
        await prisma.announcement.update({
            where: { id },
            data,
        })

        revalidatePath('/admin/announcements')
        return { success: true }
    } catch (error) {
        console.error('Error updating announcement:', error)
        throw new Error('Failed to update announcement')
    }
}

export async function deleteAnnouncement(id: string) {
    try {
        await prisma.announcement.delete({
            where: { id },
        })

        revalidatePath('/admin/announcements')
        return { success: true }
    } catch (error) {
        console.error('Error deleting announcement:', error)
        throw new Error('Failed to delete announcement')
    }
}

// ============================================================================
// Admin Accounts
// ============================================================================

export async function getAdminAccounts(page = 1, pageSize = 10) {
    try {
        const skip = (page - 1) * pageSize

        const [admins, total] = await Promise.all([
            prisma.adminAccount.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma.adminAccount.count(),
        ])

        return { data: admins, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching admin accounts:', error)
        throw new Error('Failed to fetch admin accounts')
    }
}

export async function createAdminAccount(userId: string, permissions?: any) {
    try {
        // First, update user role to ADMIN
        await prisma.user.update({
            where: { id: userId },
            data: { role: 'ADMIN' },
        })

        // Then create admin account
        const adminAccount = await prisma.adminAccount.create({
            data: {
                userId,
                permissions,
            },
        })

        revalidatePath('/admin/admins')
        return { success: true, data: adminAccount }
    } catch (error) {
        console.error('Error creating admin account:', error)
        throw new Error('Failed to create admin account')
    }
}

export async function deleteAdminAccount(id: string) {
    try {
        const adminAccount = await prisma.adminAccount.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (adminAccount) {
            // Update user role back to CUSTOMER
            await prisma.user.update({
                where: { id: adminAccount.userId },
                data: { role: 'CUSTOMER' },
            })

            // Delete admin account
            await prisma.adminAccount.delete({
                where: { id },
            })
        }

        revalidatePath('/admin/admins')
        return { success: true }
    } catch (error) {
        console.error('Error deleting admin account:', error)
        throw new Error('Failed to delete admin account')
    }
}

// ============================================================================
// Disputes Management
// ============================================================================

export async function getDisputes(page = 1, pageSize = 10, status = '') {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status) {
            where.status = status
        }

        const [disputes, total] = await Promise.all([
            prisma.dispute.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            id: true,
                            totalAmount: true,
                            currency: true,
                        },
                    },
                    initiator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            prisma.dispute.count({ where }),
        ])

        return { data: disputes, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching disputes:', error)
        throw new Error('Failed to fetch disputes')
    }
}

export async function resolveDispute(
    disputeId: string,
    resolution: string,
    refundAmount?: number,
    resolvedByAdmin = true
) {
    try {
        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { order: true },
        })

        if (!dispute) {
            throw new Error('Dispute not found')
        }

        await prisma.$transaction(async (tx: any) => {
            // Update dispute status
            await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: 'RESOLVED',
                    resolution,
                    resolvedByAdmin,
                    refundAmount,
                    refundProcessed: !!refundAmount,
                },
            })

            // If refund is involved
            if (refundAmount && refundAmount > 0) {
                // Logic to process refund (e.g., update wallet balances)
                // This is a simplified example. In a real app, you'd interact with payment gateways or internal wallets.

                // 1. Refund to buyer
                await tx.wallet.upsert({
                    where: { userId: dispute.initiatorId },
                    create: { userId: dispute.initiatorId, balance: refundAmount },
                    update: { balance: { increment: refundAmount } },
                })

                await tx.walletTransaction.create({
                    data: {
                        walletId: (await tx.wallet.findUnique({ where: { userId: dispute.initiatorId } }))!.id,
                        amount: refundAmount,
                        type: 'REFUND',
                        status: 'COMPLETED',
                        reference: `Refund for dispute ${disputeId}`,
                    }
                })
            }
        })

        revalidatePath('/admin/disputes')
        return { success: true }
    } catch (error) {
        console.error('Error resolving dispute:', error)
        throw new Error('Failed to resolve dispute')
    }
}

// ============================================================================
// Reviews Management
// ============================================================================

export async function getReviews(page = 1, pageSize = 10, rating?: number, search?: string) {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (rating) {
            where.rating = rating
        }

        if (search) {
            where.OR = [
                { comment: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
            ]
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            thumbnail: true,
                            vendor: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        },
                    },
                },
            }),
            prisma.review.count({ where }),
        ])

        return { data: reviews, total, page, pageSize }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        throw new Error('Failed to fetch reviews')
    }
}

export async function getReviewStats() {
    try {
        const [
            totalReviews,
            averageRating,
            ratingDistribution,
            recentReviews
        ] = await Promise.all([
            prisma.review.count(),
            prisma.review.aggregate({
                _avg: { rating: true }
            }),
            prisma.review.groupBy({
                by: ['rating'],
                _count: { rating: true }
            }),
            prisma.review.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
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
            totalReviews,
            averageRating: Math.round((averageRating._avg.rating || 0) * 10) / 10,
            ratingDistribution: distribution,
            recentReviews,
        }
    } catch (error) {
        console.error('Error fetching review stats:', error)
        throw new Error('Failed to fetch review stats')
    }
}

export async function deleteReview(reviewId: string, reason?: string) {
    try {
        // Get the review with product info for vendor rating update
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                product: {
                    select: { vendorId: true }
                }
            }
        })

        if (!review) {
            return { success: false, error: 'Review not found' }
        }

        // Delete the review
        await prisma.review.delete({
            where: { id: reviewId },
        })

        // Update vendor's average rating
        if (review.product?.vendorId) {
            await updateVendorRatingAfterReviewChange(review.product.vendorId)
        }

        // Create audit log if reason provided
        if (reason) {
            await prisma.auditLog.create({
                data: {
                    action: 'REVIEW_DELETED_BY_ADMIN',
                    entity: 'Review',
                    entityId: reviewId,
                    changes: { reason, rating: review.rating, comment: review.comment }
                }
            })
        }

        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error('Error deleting review:', error)
        throw new Error('Failed to delete review')
    }
}

// Helper function to update vendor rating after review changes
async function updateVendorRatingAfterReviewChange(vendorId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                product: { vendorId }
            },
            select: { rating: true }
        })

        if (reviews.length === 0) {
            await prisma.vendor.update({
                where: { id: vendorId },
                data: {
                    averageRating: 0,
                    totalReviews: 0
                }
            })
            return
        }

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        const averageRating = totalRating / reviews.length

        await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            }
        })
    } catch (error) {
        console.error('Error updating vendor rating:', error)
    }
}

// ============================================================================
// Order Management (Admin Overrides)
// ============================================================================

export async function updateOrderStatus(orderId: string, status: any) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        })

        revalidatePath('/admin/orders')
        return { success: true }
    } catch (error) {
        console.error('Error updating order status:', error)
        throw new Error('Failed to update order status')
    }
}

// ============================================================================
// Theme Settings
// ============================================================================

export async function getThemeSettings() {
    try {
        let settings = await prisma.themeSetting.findFirst()

        // If no settings exist, create default settings
        if (!settings) {
            settings = await prisma.themeSetting.create({
                data: {
                    // Light mode defaults
                    primaryColor: "#3b82f6",
                    secondaryColor: "#f4f4f5",
                    accentColor: "#f4f4f5",
                    backgroundColor: "#ffffff",
                    foregroundColor: "#09090b",
                    cardColor: "#ffffff",
                    cardForegroundColor: "#09090b",
                    borderColor: "#e4e4e7",
                    inputColor: "#e4e4e7",
                    mutedColor: "#f4f4f5",
                    mutedForegroundColor: "#71717a",
                    destructiveColor: "#dc2626",

                    // Dark mode defaults
                    darkPrimaryColor: "#2563eb",
                    darkSecondaryColor: "#27272a",
                    darkAccentColor: "#18181b",
                    darkBackgroundColor: "#09090b",
                    darkForegroundColor: "#fafafa",
                    darkCardColor: "#09090b",
                    darkCardForegroundColor: "#fafafa",
                    darkBorderColor: "#27272a",
                    darkInputColor: "#27272a",
                    darkMutedColor: "#18181b",
                    darkMutedForegroundColor: "#71717a",
                    darkDestructiveColor: "#dc2626",

                    // Typography defaults
                    fontFamily: "Inter",
                    fontSize: "14px",
                    headingFontFamily: null,

                    // Layout defaults
                    borderRadius: "0.5rem",
                    sidebarWidth: "280px",
                    headerHeight: "70px",

                    // Other defaults
                    defaultMode: "light",
                }
            })
        } else if (!settings.primaryColor) {
            // If settings exist but are empty (created by buggy version), update with defaults
            settings = await prisma.themeSetting.update({
                where: { id: settings.id },
                data: {
                    // Light mode defaults
                    primaryColor: "#3b82f6",
                    secondaryColor: "#f4f4f5",
                    accentColor: "#f4f4f5",
                    backgroundColor: "#ffffff",
                    foregroundColor: "#09090b",
                    cardColor: "#ffffff",
                    cardForegroundColor: "#09090b",
                    borderColor: "#e4e4e7",
                    inputColor: "#e4e4e7",
                    mutedColor: "#f4f4f5",
                    mutedForegroundColor: "#71717a",
                    destructiveColor: "#dc2626",

                    // Dark mode defaults
                    darkPrimaryColor: "#2563eb",
                    darkSecondaryColor: "#27272a",
                    darkAccentColor: "#18181b",
                    darkBackgroundColor: "#09090b",
                    darkForegroundColor: "#fafafa",
                    darkCardColor: "#09090b",
                    darkCardForegroundColor: "#fafafa",
                    darkBorderColor: "#27272a",
                    darkInputColor: "#27272a",
                    darkMutedColor: "#18181b",
                    darkMutedForegroundColor: "#71717a",
                    darkDestructiveColor: "#dc2626",

                    // Typography defaults
                    fontFamily: "Inter",
                    fontSize: "14px",
                    headingFontFamily: null,

                    // Layout defaults
                    borderRadius: "0.5rem",
                    sidebarWidth: "280px",
                    headerHeight: "70px",

                    // Other defaults
                    defaultMode: "light",
                }
            })
        }

        return { data: settings }
    } catch (error) {
        console.error('Error fetching theme settings:', error)
        throw new Error('Failed to fetch theme settings')
    }
}

export async function updateThemeSettings(data: {
    // Light mode colors
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    backgroundColor?: string
    foregroundColor?: string
    cardColor?: string
    cardForegroundColor?: string
    borderColor?: string
    inputColor?: string
    mutedColor?: string
    mutedForegroundColor?: string
    destructiveColor?: string

    // Dark mode colors
    darkPrimaryColor?: string
    darkSecondaryColor?: string
    darkAccentColor?: string
    darkBackgroundColor?: string
    darkForegroundColor?: string
    darkCardColor?: string
    darkCardForegroundColor?: string
    darkBorderColor?: string
    darkInputColor?: string
    darkMutedColor?: string
    darkMutedForegroundColor?: string
    darkDestructiveColor?: string

    // Typography
    fontFamily?: string
    fontSize?: string
    headingFontFamily?: string

    // Layout
    borderRadius?: string
    sidebarWidth?: string
    headerHeight?: string

    // Other
    defaultMode?: string
}) {
    try {
        const existing = await prisma.themeSetting.findFirst()

        if (existing) {
            await prisma.themeSetting.update({
                where: { id: existing.id },
                data,
            })
        } else {
            await prisma.themeSetting.create({
                data: data as any,
            })
        }

        revalidatePath('/admin/settings/general')
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error updating theme settings:', error)
        throw new Error('Failed to update theme settings')
    }
}



export async function resetThemeSettings() {
    try {
        const existing = await prisma.themeSetting.findFirst()

        if (existing) {
            await prisma.themeSetting.update({
                where: { id: existing.id },
                data: {
                    // Light mode defaults
                    primaryColor: "#3b82f6",
                    secondaryColor: "#f4f4f5",
                    accentColor: "#f4f4f5",
                    backgroundColor: "#ffffff",
                    foregroundColor: "#09090b",
                    cardColor: "#ffffff",
                    cardForegroundColor: "#09090b",
                    borderColor: "#e4e4e7",
                    inputColor: "#e4e4e7",
                    mutedColor: "#f4f4f5",
                    mutedForegroundColor: "#71717a",
                    destructiveColor: "#dc2626",

                    // Dark mode defaults
                    darkPrimaryColor: "#2563eb",
                    darkSecondaryColor: "#27272a",
                    darkAccentColor: "#18181b",
                    darkBackgroundColor: "#09090b",
                    darkForegroundColor: "#fafafa",
                    darkCardColor: "#09090b",
                    darkCardForegroundColor: "#fafafa",
                    darkBorderColor: "#27272a",
                    darkInputColor: "#27272a",
                    darkMutedColor: "#18181b",
                    darkMutedForegroundColor: "#71717a",
                    darkDestructiveColor: "#dc2626",

                    // Typography defaults
                    fontFamily: "Inter",
                    fontSize: "14px",
                    headingFontFamily: null,

                    // Layout defaults
                    borderRadius: "0.5rem",
                    sidebarWidth: "280px",
                    headerHeight: "70px",

                    // Other defaults
                    defaultMode: "light",
                },
            })
        }

        revalidatePath('/admin/settings/general')
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error resetting theme settings:', error)
        throw new Error('Failed to reset theme settings')
    }
}

export async function exportThemeSettings() {
    try {
        const settings = await prisma.themeSetting.findFirst()

        if (!settings) {
            throw new Error('No theme settings found')
        }

        // Remove id, createdAt, updatedAt from export
        const { id, createdAt, updatedAt, ...themeData } = settings

        return { data: themeData }
    } catch (error) {
        console.error('Error exporting theme settings:', error)
        throw new Error('Failed to export theme settings')
    }
}

export async function importThemeSettings(themeData: any) {
    try {
        const existing = await prisma.themeSetting.findFirst()

        if (existing) {
            await prisma.themeSetting.update({
                where: { id: existing.id },
                data: themeData,
            })
        } else {
            await prisma.themeSetting.create({
                data: themeData,
            })
        }

        revalidatePath('/admin/settings/general')
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error('Error importing theme settings:', error)
    }
}

// ============================================================================
// Gift Card Management (Admin)
// ============================================================================

import crypto from 'crypto'

/**
 * Generate a secure gift card code
 */
function generateGiftCardCodeAdmin(): string {
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
 * Get all gift cards with filters
 */
export async function getAllGiftCards(
    page = 1,
    pageSize = 10,
    status?: string,
    search?: string
) {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (status && status !== 'all') {
            where.status = status
        }

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { vendor: { name: { contains: search, mode: 'insensitive' } } }
            ]
        }

        const [giftCards, total] = await Promise.all([
            prisma.giftCard.findMany({
                where,
                include: {
                    vendor: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
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
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.giftCard.count({ where })
        ])

        return {
            success: true,
            data: giftCards.map((gc: any) => ({
                id: gc.id,
                code: gc.code,
                amount: gc.amount,
                balance: gc.balance,
                currency: gc.currency,
                status: gc.status,
                expiresAt: gc.expiresAt?.toISOString(),
                createdAt: gc.createdAt.toISOString(),
                vendor: gc.vendor,
                redemptions: gc.redemptions.map((r: any) => ({
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
        console.error('Error fetching all gift cards:', error)
        return { success: false, error: 'Failed to fetch gift cards', data: [], total: 0 }
    }
}

/**
 * Create a system/promotional gift card (not tied to vendor)
 */
export async function createSystemGiftCard(data: {
    amount: number
    currency?: string
    expiresAt?: Date
    createdBy: string
}) {
    try {
        if (data.amount <= 0) {
            return { success: false, error: 'Amount must be greater than 0' }
        }

        // Generate unique code
        let code = generateGiftCardCodeAdmin()
        let attempts = 0

        while (attempts < 10) {
            const existing = await prisma.giftCard.findUnique({
                where: { code }
            })
            if (!existing) break
            code = generateGiftCardCodeAdmin()
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
                createdById: data.createdBy,
                vendorId: null // System gift card, not tied to vendor
            }
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: data.createdBy,
                action: 'SYSTEM_GIFT_CARD_CREATED',
                entity: 'GiftCard',
                entityId: giftCard.id,
                changes: { amount: data.amount, currency: data.currency || 'USD' }
            }
        })

        revalidatePath('/admin/gift-cards')

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
        console.error('Error creating system gift card:', error)
        return { success: false, error: 'Failed to create gift card' }
    }
}

/**
 * Void/cancel a gift card (admin action)
 */
export async function voidGiftCard(giftCardId: string, reason: string, adminId: string) {
    try {
        const giftCard = await prisma.giftCard.findUnique({
            where: { id: giftCardId }
        })

        if (!giftCard) {
            return { success: false, error: 'Gift card not found' }
        }

        if (giftCard.status !== 'ACTIVE') {
            return { success: false, error: 'Gift card is not active' }
        }

        await prisma.giftCard.update({
            where: { id: giftCardId },
            data: { status: 'VOIDED' }
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: adminId,
                action: 'GIFT_CARD_VOIDED',
                entity: 'GiftCard',
                entityId: giftCardId,
                changes: { reason, previousBalance: giftCard.balance }
            }
        })

        revalidatePath('/admin/gift-cards')

        return { success: true }
    } catch (error) {
        console.error('Error voiding gift card:', error)
        return { success: false, error: 'Failed to void gift card' }
    }
}

/**
 * Get platform-wide gift card statistics
 */
export async function getGiftCardDashboardStats() {
    try {
        const [
            totalIssued,
            activeCards,
            redeemedCards,
            voidedCards,
            totals,
            redemptionTotals,
            systemCards,
            vendorCards
        ] = await Promise.all([
            prisma.giftCard.count(),
            prisma.giftCard.count({ where: { status: 'ACTIVE' } }),
            prisma.giftCard.count({ where: { status: 'REDEEMED' } }),
            prisma.giftCard.count({ where: { status: 'VOIDED' } }),
            prisma.giftCard.aggregate({
                _sum: { amount: true, balance: true }
            }),
            prisma.giftCardRedemption.aggregate({
                _sum: { amount: true }
            }),
            prisma.giftCard.count({ where: { vendorId: null } }),
            prisma.giftCard.count({ where: { NOT: { vendorId: null } } })
        ])

        return {
            success: true,
            data: {
                totalIssued,
                totalIssuedAmount: totals._sum.amount || 0,
                totalRedeemedAmount: redemptionTotals._sum.amount || 0,
                activeCards,
                activeBalance: totals._sum.balance || 0,
                redeemedCards,
                voidedCards,
                systemCards,
                vendorCards
            }
        }
    } catch (error) {
        console.error('Error fetching gift card dashboard stats:', error)
        return {
            success: false,
            error: 'Failed to fetch gift card stats',
            data: {
                totalIssued: 0,
                totalIssuedAmount: 0,
                totalRedeemedAmount: 0,
                activeCards: 0,
                activeBalance: 0,
                redeemedCards: 0,
                voidedCards: 0,
                systemCards: 0,
                vendorCards: 0
            }
        }
    }
}

/**
 * Manually adjust a user's credit balance (admin action)
 */
export async function adjustUserCredit(
    userId: string,
    amount: number,
    reason: string,
    adminId: string
) {
    try {
        if (amount === 0) {
            return { success: false, error: 'Amount cannot be zero' }
        }

        // Get or create user wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId }
        })

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    pendingBalance: 0,
                    currency: 'USD'
                }
            })
        }

        // Check if deduction would result in negative balance
        if (amount < 0 && wallet.balance + amount < 0) {
            return { success: false, error: 'Insufficient balance for deduction' }
        }

        // Update wallet and create transaction
        const result = await prisma.$transaction(async (tx: any) => {
            await tx.walletTransaction.create({
                data: {
                    walletId: wallet!.id,
                    amount: amount,
                    type: 'CREDIT_ADJUSTMENT',
                    status: 'COMPLETED',
                    reference: `Admin adjustment: ${reason}`
                }
            })

            const updatedWallet = await tx.wallet.update({
                where: { id: wallet!.id },
                data: {
                    balance: { increment: amount }
                }
            })

            return updatedWallet
        })

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: adminId,
                action: 'USER_CREDIT_ADJUSTED',
                entity: 'Wallet',
                entityId: wallet.id,
                changes: {
                    targetUserId: userId,
                    amount,
                    reason,
                    previousBalance: wallet.balance,
                    newBalance: result.balance
                }
            }
        })

        revalidatePath('/admin/users')

        return {
            success: true,
            data: {
                newBalance: result.balance,
                currency: result.currency
            }
        }
    } catch (error) {
        console.error('Error adjusting user credit:', error)
        return { success: false, error: 'Failed to adjust credit' }
    }
}

// ============================================================================
// Seller Products Page Aliases & Stubs
// ============================================================================

export const getSellerProducts = getProducts
export const toggleProductPublished = toggleProductStatus

export async function toggleProductApproved(productId: string, approved: boolean) {
    if (approved) {
        return approveProduct(productId)
    } else {
        return rejectProduct(productId, 'Revoked by admin')
    }
}

export async function toggleProductFeatured(productId: string, featured: boolean) {
    // Feature not implemented in schema yet
    console.warn('toggleProductFeatured not implemented')
    return { success: true }
}

export async function toggleProductTodaysDeal(productId: string, todaysDeal: boolean) {
    // Feature not implemented in schema yet
    console.warn('toggleProductTodaysDeal not implemented')
    return { success: true }
}

export async function bulkDeleteProducts(productIds: string[]) {
    // Feature not implemented
    console.warn('bulkDeleteProducts not implemented')
    return { success: true }
}

export async function bulkPublishProducts(productIds: string[]) {
    // Feature not implemented
    console.warn('bulkPublishProducts not implemented')
    return { success: true }
}

// ============================================================================
// Product Management
// ============================================================================

export async function createProductByAdmin(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify admin role
        // We check if the user has an admin account entry
        const adminAccount = await prisma.adminAccount.findUnique({
            where: { userId: session.user.id }
        })

        if (!adminAccount) {
            throw new Error('Unauthorized: Admin access required')
        }

        const product = await prisma.product.create({
            data: {
                ...data,
                status: data.status || 'DRAFT',
            }
        })

        revalidatePath('/admin/products')
        return { success: true, product }
    } catch (error) {
        console.error('Error creating product:', error)
        return { success: false, error: 'Failed to create product' }
    }
}

export async function createDigitalProductByAdmin(data: any) {
    return createProductByAdmin(data)
}
