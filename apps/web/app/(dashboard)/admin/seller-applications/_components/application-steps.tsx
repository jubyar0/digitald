'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, AlertCircle, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const statusIcons = {
    PENDING: Circle,
    IN_PROGRESS: Circle,
    COMPLETED: CheckCircle2,
    NEEDS_REVISION: AlertCircle,
    SKIPPED: Circle,
}

const statusColors = {
    PENDING: 'text-muted-foreground',
    IN_PROGRESS: 'text-blue-500',
    COMPLETED: 'text-green-500',
    NEEDS_REVISION: 'text-orange-500',
    SKIPPED: 'text-gray-500',
}

export default function ApplicationSteps({
    applicationId,
    steps,
    currentStep,
}: {
    applicationId: string
    steps: any[]
    currentStep: number
}) {
    if (!steps || steps.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <p>No steps configured for this application</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Steps</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const Icon = statusIcons[step.status as keyof typeof statusIcons] || Circle
                        const isActive = step.stepNumber === currentStep

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    'flex gap-4 p-4 rounded-lg border transition-colors',
                                    isActive ? 'bg-primary/5 border-primary' : 'bg-muted/50'
                                )}
                            >
                                <div className="flex-shrink-0">
                                    <Icon
                                        className={cn(
                                            'h-6 w-6',
                                            statusColors[step.status as keyof typeof statusColors]
                                        )}
                                    />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="font-medium">
                                                Step {step.stepNumber}: {step.stepName}
                                            </h4>
                                            {isActive && (
                                                <Badge variant="outline" className="mt-1">
                                                    Current Step
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge
                                            variant={step.status === 'COMPLETED' ? 'default' : 'secondary'}
                                            className={cn(
                                                step.status === 'NEEDS_REVISION' && 'bg-orange-500/10 text-orange-500'
                                            )}
                                        >
                                            {step.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    {step.completedAt && (
                                        <p className="text-sm text-muted-foreground">
                                            Completed {format(new Date(step.completedAt), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    )}

                                    {step.revisionRequired && step.revisionNotes && (
                                        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                            <p className="text-sm font-medium text-orange-500 mb-1 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4" />
                                                Revision Required
                                            </p>
                                            <p className="text-sm">{step.revisionNotes}</p>
                                        </div>
                                    )}

                                    {step.data && Object.keys(step.data).length > 0 && (
                                        <details className="text-sm">
                                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                                View step data
                                            </summary>
                                            <pre className="mt-2 p-3 bg-muted rounded-lg overflow-auto max-h-48 text-xs">
                                                {JSON.stringify(step.data, null, 2)}
                                            </pre>
                                        </details>
                                    )}

                                    {step.files && step.files.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Attached Files:</p>
                                            <ul className="text-sm space-y-1">
                                                {step.files.map((file: any, i: number) => (
                                                    <li key={i}>
                                                        <a
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
