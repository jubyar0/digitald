import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const category = await prisma.category.findUnique({
            where: { id: params.id },
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
                        children: true,
                    },
                },
            }
        })

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(category)
    } catch (error) {
        console.error('Error fetching category:', error)
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, slug, parentId, isActive } = body

        // Check if category exists
        const existing = await prisma.category.findUnique({
            where: { id: params.id }
        })

        if (!existing) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            )
        }

        // If slug is being changed, check if new slug is available
        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug }
            })

            if (slugExists) {
                return NextResponse.json(
                    { error: 'Category with this slug already exists' },
                    { status: 400 }
                )
            }
        }

        // Prevent setting self as parent
        if (parentId === params.id) {
            return NextResponse.json(
                { error: 'Category cannot be its own parent' },
                { status: 400 }
            )
        }

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (slug !== undefined) updateData.slug = slug
        if (parentId !== undefined) updateData.parentId = parentId || null
        if (isActive !== undefined) updateData.isActive = isActive

        const category = await prisma.category.update({
            where: { id: params.id },
            data: updateData,
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
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Category updated successfully',
            category
        })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        products: true,
                        children: true,
                    }
                }
            }
        })

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            )
        }

        // Check if category has products
        if (category._count.products > 0) {
            return NextResponse.json(
                { error: `Cannot delete category with ${category._count.products} products. Please reassign or delete the products first.` },
                { status: 400 }
            )
        }

        // Check if category has children
        if (category._count.children > 0) {
            return NextResponse.json(
                { error: `Cannot delete category with ${category._count.children} subcategories. Please reassign or delete the subcategories first.` },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        )
    }
}
