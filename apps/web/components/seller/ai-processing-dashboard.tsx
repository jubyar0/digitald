'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Sparkles,
    Image as ImageIcon,
    Network,
    Tags,
    AlertTriangle,
    Layers,
    Grid3x3,
    Loader2,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import {
    generateProductThumbnail,
    suggestProductTags,
    analyzeTopology,
    detectGeometryIssues,
    generateLODs,
    getAIProcessingStatus,
} from '@/actions/ai-actions'
import { toast } from 'sonner'

interface AIProcessingDashboardProps {
    productId: string
}

export function AIProcessingDashboard({ productId }: AIProcessingDashboardProps) {
    const [processing, setProcessing] = useState<Record<string, boolean>>({})
    const [results, setResults] = useState<Record<string, any>>({})

    const handleThumbnailGeneration = async () => {
        setProcessing((prev) => ({ ...prev, thumbnail: true }))
        try {
            const result = await generateProductThumbnail(productId)
            if (result.success) {
                toast.success('Thumbnail generated successfully!')
                setResults((prev) => ({ ...prev, thumbnail: result.thumbnailUrl }))
            } else {
                toast.error(result.error || 'Failed to generate thumbnail')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setProcessing((prev) => ({ ...prev, thumbnail: false }))
        }
    }

    const handleTagSuggestion = async () => {
        setProcessing((prev) => ({ ...prev, tags: true }))
        try {
            const result = await suggestProductTags(productId)
            if (result.success) {
                toast.success(`Generated ${result.tags?.length || 0} tag suggestions!`)
                setResults((prev) => ({ ...prev, tags: result.tags }))
            } else {
                toast.error(result.error || 'Failed to suggest tags')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setProcessing((prev) => ({ ...prev, tags: false }))
        }
    }

    const handleTopologyAnalysis = async () => {
        setProcessing((prev) => ({ ...prev, topology: true }))
        try {
            const result = await analyzeTopology(productId)
            if (result.success) {
                toast.success('Topology analysis complete!')
                setResults((prev) => ({ ...prev, topology: result.analysis }))
            } else {
                toast.error(result.error || 'Failed to analyze topology')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setProcessing((prev) => ({ ...prev, topology: false }))
        }
    }

    const handleIssueDetection = async () => {
        setProcessing((prev) => ({ ...prev, issues: true }))
        try {
            const result = await detectGeometryIssues(productId)
            if (result.success) {
                toast.success(`Detected ${result.issues?.length || 0} issues`)
                setResults((prev) => ({ ...prev, issues: result.issues }))
            } else {
                toast.error(result.error || 'Failed to detect issues')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setProcessing((prev) => ({ ...prev, issues: false }))
        }
    }

    const handleLODGeneration = async () => {
        setProcessing((prev) => ({ ...prev, lod: true }))
        try {
            const result = await generateLODs(productId, 3)
            if (result.success) {
                toast.success('LODs generated successfully!')
                setResults((prev) => ({ ...prev, lod: result.lods }))
            } else {
                toast.error(result.error || 'Failed to generate LODs')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setProcessing((prev) => ({ ...prev, lod: false }))
        }
    }

    const aiTools = [
        {
            id: 'thumbnail',
            title: 'Thumbnail Generator',
            description: 'Auto-generate thumbnails from your 3D model',
            icon: ImageIcon,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            action: handleThumbnailGeneration,
        },
        {
            id: 'topology',
            title: 'Topology Analyzer',
            description: 'Analyze and optimize model topology',
            icon: Network,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            action: handleTopologyAnalysis,
        },
        {
            id: 'tags',
            title: 'Tag Suggester',
            description: 'AI-powered tag suggestions',
            icon: Tags,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            action: handleTagSuggestion,
        },
        {
            id: 'issues',
            title: 'Issue Detector',
            description: 'Detect geometry problems automatically',
            icon: AlertTriangle,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            action: handleIssueDetection,
        },
        {
            id: 'lod',
            title: 'LOD Generator',
            description: 'Generate Level of Detail variations',
            icon: Layers,
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-500/10',
            action: handleLODGeneration,
        },
        {
            id: 'uv',
            title: 'UV Optimizer',
            description: 'Optimize UV maps automatically',
            icon: Grid3x3,
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            action: () => toast.info('UV optimization coming soon!'),
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        AI Processing Tools
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Enhance your 3D models with AI-powered tools
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map((tool) => {
                    const Icon = tool.icon
                    const isProcessing = processing[tool.id]
                    const hasResult = !!results[tool.id]

                    return (
                        <Card key={tool.id} className="relative overflow-hidden">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${tool.color}`} />
                                    </div>
                                    {hasResult && (
                                        <Badge variant="secondary" className="gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Completed
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="mt-4">{tool.title}</CardTitle>
                                <CardDescription>{tool.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={tool.action}
                                    disabled={isProcessing}
                                    className="w-full"
                                    variant={hasResult ? 'outline' : 'default'}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : hasResult ? (
                                        'Run Again'
                                    ) : (
                                        'Run Analysis'
                                    )}
                                </Button>

                                {/* Show results preview */}
                                {hasResult && (
                                    <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                                        {tool.id === 'thumbnail' && (
                                            <p className="text-muted-foreground">Thumbnail generated</p>
                                        )}
                                        {tool.id === 'tags' && (
                                            <p className="text-muted-foreground">
                                                {results.tags?.length || 0} tags suggested
                                            </p>
                                        )}
                                        {tool.id === 'topology' && results.topology && (
                                            <div>
                                                <p className="font-medium">Score: {results.topology.score}/100</p>
                                                <p className="text-muted-foreground text-xs mt-1">
                                                    {results.topology.recommendations?.length || 0} recommendations
                                                </p>
                                            </div>
                                        )}
                                        {tool.id === 'issues' && (
                                            <p className="text-muted-foreground">
                                                {results.issues?.length || 0} issues detected
                                            </p>
                                        )}
                                        {tool.id === 'lod' && (
                                            <p className="text-muted-foreground">
                                                {results.lod?.length || 0} LOD levels generated
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Results Section */}
            {Object.keys(results).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Processing Results</CardTitle>
                        <CardDescription>Detailed results from AI analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {results.tags && (
                            <div>
                                <h4 className="font-medium mb-2">Suggested Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {results.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.topology && (
                            <div>
                                <h4 className="font-medium mb-2">Topology Analysis</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Quality Score</span>
                                        <span className="font-medium">{results.topology.score}/100</span>
                                    </div>
                                    <Progress value={results.topology.score} className="h-2" />
                                    {results.topology.recommendations?.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium mb-1">Recommendations:</p>
                                            <ul className="text-sm text-muted-foreground space-y-1">
                                                {results.topology.recommendations.map((rec: string, index: number) => (
                                                    <li key={index}>• {rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {results.issues && results.issues.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Detected Issues</h4>
                                <div className="space-y-2">
                                    {results.issues.map((issue: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                                        >
                                            <AlertTriangle
                                                className={`h-5 w-5 mt-0.5 ${issue.severity === 'CRITICAL'
                                                    ? 'text-red-500'
                                                    : issue.severity === 'HIGH'
                                                        ? 'text-orange-500'
                                                        : issue.severity === 'MEDIUM'
                                                            ? 'text-yellow-500'
                                                            : 'text-blue-500'
                                                    }`}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{issue.issueType}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {issue.severity}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {issue.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {results.lod && (
                            <div>
                                <h4 className="font-medium mb-2">Generated LODs</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {results.lod.map((lod: any, index: number) => (
                                        <div key={index} className="p-3 bg-muted rounded-lg">
                                            <p className="font-medium text-sm">Level {lod.level}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {lod.polygonCount.toLocaleString()} polygons
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(lod.reductionRatio * 100).toFixed(0)}% of original
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
