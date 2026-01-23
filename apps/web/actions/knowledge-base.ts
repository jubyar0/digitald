'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const articleSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    content: z.string().min(10, 'Content is required'),
    category: z.string().optional(),
    tags: z.string().optional(), // Comma separated
    isActive: z.boolean().default(true),
})

export async function getArticles(page = 1, pageSize = 20, search?: string) {
    try {
        const skip = (page - 1) * pageSize
        const where: any = {}

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ]
        }

        const [articles, total] = await Promise.all([
            prisma.knowledgeBaseArticle.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.knowledgeBaseArticle.count({ where }),
        ])

        return { success: true, data: articles, total }
    } catch (error) {
        console.error('Error fetching articles:', error)
        return { success: false, error: 'Failed to fetch articles' }
    }
}

export async function createArticle(data: z.infer<typeof articleSchema>) {
    try {
        const validated = articleSchema.parse(data)

        // Process tags
        const tags = validated.tags
            ? validated.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : []

        const article = await prisma.knowledgeBaseArticle.create({
            data: {
                title: validated.title,
                content: validated.content,
                category: validated.category || 'General',
                tags,
                isActive: validated.isActive,
            },
        })

        revalidatePath('/admin/support/knowledge-base')
        return { success: true, data: article }
    } catch (error) {
        console.error('Error creating article:', error)
        return { success: false, error: 'Failed to create article' }
    }
}

export async function updateArticle(id: string, data: z.infer<typeof articleSchema>) {
    try {
        const validated = articleSchema.parse(data)

        // Process tags
        const tags = validated.tags
            ? validated.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : []

        const article = await prisma.knowledgeBaseArticle.update({
            where: { id },
            data: {
                title: validated.title,
                content: validated.content,
                category: validated.category,
                tags,
                isActive: validated.isActive,
            },
        })

        revalidatePath('/admin/support/knowledge-base')
        return { success: true, data: article }
    } catch (error) {
        console.error('Error updating article:', error)
        return { success: false, error: 'Failed to update article' }
    }
}

export async function deleteArticle(id: string) {
    try {
        await prisma.knowledgeBaseArticle.delete({
            where: { id },
        })

        revalidatePath('/admin/support/knowledge-base')
        return { success: true }
    } catch (error) {
        console.error('Error deleting article:', error)
        return { success: false, error: 'Failed to delete article' }
    }
}
