'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ============================================================================
// Canned Responses CRUD
// ============================================================================

export async function getCannedResponses(category?: string) {
    try {
        const where: any = { isActive: true }
        if (category) {
            where.category = category
        }

        const responses = await prisma.cannedResponse.findMany({
            where,
            orderBy: { title: 'asc' },
        })

        return { success: true, data: responses }
    } catch (error) {
        console.error('Error fetching canned responses:', error)
        return { success: false, error: 'Failed to fetch canned responses' }
    }
}

export async function getCannedResponseByShortcut(shortcut: string) {
    try {
        const response = await prisma.cannedResponse.findUnique({
            where: { shortcut },
        })

        return { success: true, data: response }
    } catch (error) {
        console.error('Error fetching canned response:', error)
        return { success: false, error: 'Failed to fetch canned response' }
    }
}

export async function createCannedResponse(data: {
    title: string
    shortcut: string
    content: string
    category?: string
    createdBy?: string
}) {
    try {
        const response = await prisma.cannedResponse.create({
            data: {
                title: data.title,
                shortcut: data.shortcut.toLowerCase().replace(/\s+/g, '_'),
                content: data.content,
                category: data.category,
                createdBy: data.createdBy,
            },
        })

        revalidatePath('/admin/support/canned-responses')
        return { success: true, data: response }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'Shortcut already exists' }
        }
        console.error('Error creating canned response:', error)
        return { success: false, error: 'Failed to create canned response' }
    }
}

export async function updateCannedResponse(
    id: string,
    data: {
        title?: string
        shortcut?: string
        content?: string
        category?: string
        isActive?: boolean
    }
) {
    try {
        const response = await prisma.cannedResponse.update({
            where: { id },
            data: {
                ...data,
                shortcut: data.shortcut?.toLowerCase().replace(/\s+/g, '_'),
            },
        })

        revalidatePath('/admin/support/canned-responses')
        return { success: true, data: response }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: 'Shortcut already exists' }
        }
        console.error('Error updating canned response:', error)
        return { success: false, error: 'Failed to update canned response' }
    }
}

export async function deleteCannedResponse(id: string) {
    try {
        await prisma.cannedResponse.delete({
            where: { id },
        })

        revalidatePath('/admin/support/canned-responses')
        return { success: true }
    } catch (error) {
        console.error('Error deleting canned response:', error)
        return { success: false, error: 'Failed to delete canned response' }
    }
}

export async function getCannedResponseCategories() {
    try {
        const categories = await prisma.cannedResponse.groupBy({
            by: ['category'],
            where: { category: { not: null } },
        })

        return {
            success: true,
            data: categories.map((c) => c.category).filter(Boolean) as string[],
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
        return { success: false, error: 'Failed to fetch categories' }
    }
}
