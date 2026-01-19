'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'
import { AIJobType, AIProcessingStatus, IssueType, IssueSeverity } from '@repo/database'
import { aiService, type ModelAnalysis, type GeometryData } from '@/lib/ai-service'

/**
 * Process product with AI tools
 */
export async function processModelWithAI(
    productId: string,
    jobTypes: AIJobType[]
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get vendor and verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true },
        })

        if (!product || product.vendorId !== vendor.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Create AI processing jobs
        const jobs = await Promise.all(
            jobTypes.map((jobType) =>
                prisma.aIProcessingJob.create({
                    data: {
                        productId,
                        jobType,
                        status: AIProcessingStatus.PENDING,
                    },
                })
            )
        )

        // Update product status
        await prisma.product.update({
            where: { id: productId },
            data: {
                aiProcessingStatus: AIProcessingStatus.PROCESSING,
            },
        })

        revalidatePath('/seller/products')
        return { success: true, jobs }
    } catch (error) {
        console.error('Error processing model with AI:', error)
        return { success: false, error: 'Failed to start AI processing' }
    }
}

/**
 * Get AI processing status for a product
 */
export async function getAIProcessingStatus(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const jobs = await prisma.aIProcessingJob.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        })

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                aiProcessingStatus: true,
                aiProcessedAt: true,
                aiThumbnailGenerated: true,
                aiTagsSuggested: true,
                aiTopologyScore: true,
                aiUvQualityScore: true,
                aiLodGenerated: true,
            },
        })

        return { success: true, jobs, product }
    } catch (error) {
        console.error('Error fetching AI processing status:', error)
        return { success: false, error: 'Failed to fetch status' }
    }
}

/**
 * Get detected issues for a product
 */
export async function getProductIssues(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const issues = await prisma.productIssue.findMany({
            where: { productId },
            orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
        })

        return { success: true, issues }
    } catch (error) {
        console.error('Error fetching product issues:', error)
        return { success: false, error: 'Failed to fetch issues' }
    }
}

/**
 * Generate thumbnail for product
 */
export async function generateProductThumbnail(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get vendor and verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true, fileUrl: true, name: true },
        })

        if (!product || product.vendorId !== vendor.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Create job
        const job = await prisma.aIProcessingJob.create({
            data: {
                productId,
                jobType: AIJobType.THUMBNAIL_GENERATION,
                status: AIProcessingStatus.PROCESSING,
                startedAt: new Date(),
            },
        })

        // Simulate thumbnail generation
        // In production, this would call actual 3D rendering service
        const thumbnailUrl = `/api/placeholder-thumbnail/${productId}`

        // Update job and product
        await Promise.all([
            prisma.aIProcessingJob.update({
                where: { id: job.id },
                data: {
                    status: AIProcessingStatus.COMPLETED,
                    completedAt: new Date(),
                    progress: 100,
                    result: { thumbnailUrl },
                },
            }),
            prisma.product.update({
                where: { id: productId },
                data: {
                    thumbnail: thumbnailUrl,
                    aiThumbnailGenerated: true,
                },
            }),
        ])

        revalidatePath('/seller/products')
        return { success: true, thumbnailUrl }
    } catch (error) {
        console.error('Error generating thumbnail:', error)
        return { success: false, error: 'Failed to generate thumbnail' }
    }
}

/**
 * Suggest tags for product using AI
 */
export async function suggestProductTags(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get vendor and verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { category: true },
        })

        if (!product || product.vendorId !== vendor.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Create job
        const job = await prisma.aIProcessingJob.create({
            data: {
                productId,
                jobType: AIJobType.TAG_SUGGESTION,
                status: AIProcessingStatus.PROCESSING,
                startedAt: new Date(),
            },
        })

        // Prepare model analysis data
        const modelData: ModelAnalysis = {
            name: product.name,
            description: product.description,
            polygonCount: product.polygonCount || undefined,
            verticesCount: product.verticesCount || undefined,
            geometryType: product.geometryType || undefined,
            isRigged: product.isRigged,
            isAnimated: product.isAnimated,
            materialType: product.materialType || undefined,
            category: product.category?.name,
        }

        // Get AI suggestions
        const suggestedTags = await aiService.suggestTags(modelData)

        // Update job and product
        await Promise.all([
            prisma.aIProcessingJob.update({
                where: { id: job.id },
                data: {
                    status: AIProcessingStatus.COMPLETED,
                    completedAt: new Date(),
                    progress: 100,
                    result: { tags: suggestedTags },
                },
            }),
            prisma.product.update({
                where: { id: productId },
                data: {
                    aiTagsSuggested: suggestedTags,
                },
            }),
        ])

        revalidatePath('/seller/products')
        return { success: true, tags: suggestedTags }
    } catch (error) {
        console.error('Error suggesting tags:', error)
        return { success: false, error: 'Failed to suggest tags' }
    }
}

/**
 * Analyze product topology
 */
export async function analyzeTopology(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get vendor and verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true, polygonCount: true, verticesCount: true },
        })

        if (!product || product.vendorId !== vendor.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Create job
        const job = await prisma.aIProcessingJob.create({
            data: {
                productId,
                jobType: AIJobType.TOPOLOGY_OPTIMIZATION,
                status: AIProcessingStatus.PROCESSING,
                startedAt: new Date(),
            },
        })

        // Simulate geometry data (in production, load from file)
        const geometryData: GeometryData = {
            vertices: [],
            faces: [],
        }

        // Analyze topology
        const analysis = await aiService.analyzeTopology(geometryData)

        // Update job and product
        await Promise.all([
            prisma.aIProcessingJob.update({
                where: { id: job.id },
                data: {
                    status: AIProcessingStatus.COMPLETED,
                    completedAt: new Date(),
                    progress: 100,
                    result: JSON.parse(JSON.stringify(analysis)),
                },
            }),
            prisma.product.update({
                where: { id: productId },
                data: {
                    aiTopologyScore: analysis.score,
                },
            }),
        ])

        revalidatePath('/seller/products')
        return { success: true, analysis }
    } catch (error) {
        console.error('Error analyzing topology:', error)
        return { success: false, error: 'Failed to analyze topology' }
    }
}

/**
 * Detect issues in product geometry
 */
export async function detectGeometryIssues(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get vendor and verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true },
        })

        if (!product || product.vendorId !== vendor.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Create job
        const job = await prisma.aIProcessingJob.create({
            data: {
                productId,
                jobType: AIJobType.ISSUE_DETECTION,
                status: AIProcessingStatus.PROCESSING,
                startedAt: new Date(),
            },
        })

        // Simulate geometry data
        const geometryData: GeometryData = {
            vertices: [],
            faces: [],
        }

        // Detect issues
        const detectedIssues = await aiService.detectIssues(geometryData)

        // Save issues to database
        const issueRecords = await Promise.all(
            detectedIssues.map((issue) =>
                prisma.productIssue.create({
                    data: {
                        productId,
                        issueType: issue.type as IssueType,
                        severity: issue.severity as IssueSeverity,
                        description: issue.description,
                        location: issue.location || null,
                    },
                })
            )
        )

        // Update job and product
        await Promise.all([
            prisma.aIProcessingJob.update({
                where: { id: job.id },
                data: {
                    status: AIProcessingStatus.COMPLETED,
                    completedAt: new Date(),
                    progress: 100,
                    result: { issuesCount: detectedIssues.length },
                },
            }),
            prisma.product.update({
                where: { id: productId },
                data: {
                    aiIssuesDetected: {
                        total: detectedIssues.length,
                        critical: detectedIssues.filter((i) => i.severity === 'CRITICAL').length,
                        high: detectedIssues.filter((i) => i.severity === 'HIGH').length,
                        medium: detectedIssues.filter((i) => i.severity === 'MEDIUM').length,
                        low: detectedIssues.filter((i) => i.severity === 'LOW').length,
                    },
                },
            }),
        ])

        revalidatePath('/seller/products')
        return { success: true, issues: issueRecords }
    } catch (error) {
        console.error('Error detecting issues:', error)
        return { success: false, error: 'Failed to detect issues' }
    }
}

/**
 * Generate LODs for product
 */
export async function generateLODs(productId: string, levels: number = 3) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Get vendor and verify ownership
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            return { success: false, error: 'Vendor not found' }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true },
        })

        if (!product || product.vendorId !== vendor.id) {
            return { success: false, error: 'Unauthorized' }
        }

        // Create job
        const job = await prisma.aIProcessingJob.create({
            data: {
                productId,
                jobType: AIJobType.LOD_GENERATION,
                status: AIProcessingStatus.PROCESSING,
                startedAt: new Date(),
            },
        })

        // Simulate LOD generation
        const lods = Array.from({ length: levels }, (_, i) => ({
            level: i + 1,
            polygonCount: Math.floor(10000 / Math.pow(2, i + 1)),
            reductionRatio: 1 / Math.pow(2, i + 1),
            fileUrl: `/api/lod/${productId}/level-${i + 1}`,
        }))

        // Update job and product
        await Promise.all([
            prisma.aIProcessingJob.update({
                where: { id: job.id },
                data: {
                    status: AIProcessingStatus.COMPLETED,
                    completedAt: new Date(),
                    progress: 100,
                    result: { lods },
                },
            }),
            prisma.product.update({
                where: { id: productId },
                data: {
                    aiLodGenerated: true,
                    hasLOD: true,
                    lodLevels: levels,
                },
            }),
        ])

        revalidatePath('/seller/products')
        return { success: true, lods }
    } catch (error) {
        console.error('Error generating LODs:', error)
        return { success: false, error: 'Failed to generate LODs' }
    }
}

/**
 * Cancel AI processing job
 */
export async function cancelAIJob(jobId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' }
        }

        await prisma.aIProcessingJob.update({
            where: { id: jobId },
            data: {
                status: AIProcessingStatus.FAILED,
                error: 'Cancelled by user',
                completedAt: new Date(),
            },
        })

        revalidatePath('/seller/products')
        return { success: true }
    } catch (error) {
        console.error('Error cancelling job:', error)
        return { success: false, error: 'Failed to cancel job' }
    }
}
