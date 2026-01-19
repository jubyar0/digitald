'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Activity, User, CheckCircle, XCircle, Edit, RotateCcw, Lock, MessageSquare } from 'lucide-react'

const actionIcons: Record<string, any> = {
    CREATED: Activity,
    SUBMITTED: Activity,
    APPROVED: CheckCircle,
    REJECTED: XCircle,
    REVISION_REQUESTED: Edit,
    REVISION_COMPLETED: CheckCircle,
    REOPENED: RotateCcw,
    CLOSED: Lock,
    PERSONA_INITIATED: Activity,
    PERSONA_COMPLETED: CheckCircle,
    PERSONA_FAILED: XCircle,
    PERSONA_OVERRIDDEN: Lock,
    STEP_COMPLETED: CheckCircle,
    STEP_REVISION_REQUESTED: Edit,
    NOTE_ADDED: MessageSquare,
    STATUS_CHANGED: Activity,
}

const actionColors: Record<string, string> = {
    CREATED: 'text-blue-500',
    SUBMITTED: 'text-blue-500',
    APPROVED: 'text-green-500',
    REJECTED: 'text-red-500',
    REVISION_REQUESTED: 'text-orange-500',
    REVISION_COMPLETED: 'text-green-500',
    REOPENED: 'text-blue-500',
    CLOSED: 'text-gray-500',
    PERSONA_INITIATED: 'text-blue-500',
    PERSONA_COMPLETED: 'text-green-500',
    PERSONA_FAILED: 'text-red-500',
    PERSONA_OVERRIDDEN: 'text-purple-500',
    STEP_COMPLETED: 'text-green-500',
    STEP_REVISION_REQUESTED: 'text-orange-500',
    NOTE_ADDED: 'text-blue-500',
    STATUS_CHANGED: 'text-blue-500',
}

export default function ApplicationAuditLog({ logs }: { logs: any[] }) {
    if (logs.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No audit logs yet</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Complete history of all actions taken on this application
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.map((log, index) => {
                        const Icon = actionIcons[log.action] || Activity
                        const color = actionColors[log.action] || 'text-muted-foreground'
                        const isFirst = index === 0
                        const isLast = index === logs.length - 1

                        return (
                            <div key={log.id} className="flex gap-4">
                                {/* Timeline Line */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isFirst ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    >
                                        <Icon className={`h-4 w-4 ${isFirst ? 'text-primary-foreground' : color}`} />
                                    </div>
                                    {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <Badge variant="outline" className="mb-2">
                                                {log.action.replace(/_/g, ' ')}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                                            </p>
                                        </div>

                                        {/* Admin Info */}
                                        {log.admin && (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                        {log.admin.name?.[0] || log.admin.email?.[0] || '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-muted-foreground">
                                                    {log.admin.name || log.admin.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Metadata */}
                                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                                        <div className="mt-2 p-3 bg-muted rounded-lg">
                                            <details className="text-sm">
                                                <summary className="cursor-pointer font-medium mb-2">
                                                    View details
                                                </summary>
                                                <div className="space-y-1">
                                                    {Object.entries(log.metadata).map(([key, value]) => (
                                                        <div key={key} className="flex gap-2">
                                                            <span className="text-muted-foreground font-mono text-xs">
                                                                {key}:
                                                            </span>
                                                            <span className="text-xs">
                                                                {typeof value === 'object'
                                                                    ? JSON.stringify(value, null, 2)
                                                                    : String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        </div>
                                    )}

                                    {/* IP Address (if available) */}
                                    {log.ipAddress && log.ipAddress !== 'unknown' && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            IP: {log.ipAddress}
                                        </p>
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
