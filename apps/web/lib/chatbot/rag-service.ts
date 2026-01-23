import { prisma } from '@/lib/db'

export class RAGService {
    /**
     * Simple keyword-based retrieval for now.
     * In a production environment with pgvector, this would use vector similarity search.
     */
    static async findRelevantArticles(query: string, limit = 3) {
        // 1. Extract keywords (very basic implementation)
        const keywords = query
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(' ')
            .filter((w) => w.length > 3)

        if (keywords.length === 0) return []

        // 2. Search in database using OR condition for keywords
        // Note: Prisma full-text search would be better if enabled, but using contains for compatibility
        const articles = await prisma.knowledgeBaseArticle.findMany({
            where: {
                isActive: true,
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive' as any,
                        },
                    },
                    ...keywords.map((k) => ({
                        content: {
                            contains: k,
                            mode: 'insensitive' as any,
                        },
                    })),
                    ...keywords.map((k) => ({
                        tags: {
                            has: k,
                        },
                    })),
                ],
            },
            take: limit,
            orderBy: {
                updatedAt: 'desc',
            },
        })

        return articles
    }

    static async formatContext(articles: any[]) {
        if (!articles.length) return ''

        return `
Here is some relevant information from our knowledge base:
${articles.map((a) => `- ${a.title}: ${a.content.substring(0, 300)}...`).join('\n')}
`
    }
}
