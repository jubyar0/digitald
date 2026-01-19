'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Sparkles,
    Image as ImageIcon,
    Network,
    Tags,
    AlertTriangle,
    Layers,
    TrendingUp,
    CheckCircle2,
} from 'lucide-react'

interface ProductAIPanelProps {
    productId: string
    aiData?: {
        processingStatus?: string
        thumbnailGenerated?: boolean
        topologyScore?: number
        tagsSuggested?: string[]
        issuesDetected?: {
            total: number
            critical: number
            high: number
            medium: number
            low: number
        }
        lodGenerated?: boolean
        uvQualityScore?: number
    }
}

export function ProductAIPanel({ productId, aiData }: ProductAIPanelProps) {
    const stats = [
        {
            label: 'Topology Score',
            value: aiData?.topologyScore || 0,
            icon: Network,
            color: 'text-purple-500',
            show: !!aiData?.topologyScore,
        },
        {
            label: 'UV Quality',
            value: aiData?.uvQualityScore || 0,
            icon: TrendingUp,
            color: 'text-cyan-500',
            show: !!aiData?.uvQualityScore,
        },
        {
            label: 'Issues Detected',
            value: aiData?.issuesDetected?.total || 0,
            icon: AlertTriangle,
            color: 'text-orange-500',
            show: !!aiData?.issuesDetected,
        },
    ]

    const features = [
        {
            label: 'Thumbnail',
            enabled: aiData?.thumbnailGenerated,
            icon: ImageIcon,
        },
        {
            label: 'AI Tags',
            enabled: aiData?.tagsSuggested && aiData.tagsSuggested.length > 0,
            icon: Tags,
        },
        {
            label: 'LODs',
            enabled: aiData?.lodGenerated,
            icon: Layers,
        },
    ]

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Processing
                        </CardTitle>
                        <CardDescription>AI-powered enhancements for this product</CardDescription>
                    </div>
                    <Badge
                        variant={
                            aiData?.processingStatus === 'COMPLETED'
                                ? 'secondary'
                                : aiData?.processingStatus === 'PROCESSING'
                                    ? 'secondary'
                                    : 'outline'
                        }
                    >
                        {aiData?.processingStatus || 'PENDING'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {stats.map(
                        (stat) =>
                            stat.show && (
                                <div key={stat.label} className="text-center">
                                    <div className="flex justify-center mb-2">
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            )
                    )}
                </div>

                {/* Features */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">AI Features</p>
                    <div className="flex flex-wrap gap-2">
                        {features.map((feature) => (
                            <Badge
                                key={feature.label}
                                variant={feature.enabled ? 'secondary' : 'outline'}
                                className="gap-1"
                            >
                                {feature.enabled && <CheckCircle2 className="h-3 w-3" />}
                                <feature.icon className="h-3 w-3" />
                                {feature.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Suggested Tags */}
                {aiData?.tagsSuggested && aiData.tagsSuggested.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">AI Suggested Tags</p>
                        <div className="flex flex-wrap gap-2">
                            {aiData.tagsSuggested.slice(0, 5).map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                            {aiData.tagsSuggested.length > 5 && (
                                <Badge variant="outline">+{aiData.tagsSuggested.length - 5} more</Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* Topology Score */}
                {aiData?.topologyScore !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Topology Quality</p>
                            <span className="text-sm font-medium">{aiData.topologyScore}/100</span>
                        </div>
                        <Progress value={aiData.topologyScore} className="h-2" />
                    </div>
                )}

                {/* Issues Summary */}
                {aiData?.issuesDetected && aiData.issuesDetected.total > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Issues Detected</p>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {aiData.issuesDetected.critical > 0 && (
                                <div className="p-2 bg-red-500/10 rounded">
                                    <div className="text-lg font-bold text-red-500">
                                        {aiData.issuesDetected.critical}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Critical</div>
                                </div>
                            )}
                            {aiData.issuesDetected.high > 0 && (
                                <div className="p-2 bg-orange-500/10 rounded">
                                    <div className="text-lg font-bold text-orange-500">
                                        {aiData.issuesDetected.high}
                                    </div>
                                    <div className="text-xs text-muted-foreground">High</div>
                                </div>
                            )}
                            {aiData.issuesDetected.medium > 0 && (
                                <div className="p-2 bg-yellow-500/10 rounded">
                                    <div className="text-lg font-bold text-yellow-500">
                                        {aiData.issuesDetected.medium}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Medium</div>
                                </div>
                            )}
                            {aiData.issuesDetected.low > 0 && (
                                <div className="p-2 bg-blue-500/10 rounded">
                                    <div className="text-lg font-bold text-blue-500">
                                        {aiData.issuesDetected.low}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Low</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Button className="w-full" variant="outline" asChild>
                    <a href={`/seller/products/${productId}/ai-tools`}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Open AI Tools Dashboard
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}
