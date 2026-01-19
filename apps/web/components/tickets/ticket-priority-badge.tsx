import { Badge } from '@/components/ui/badge'
import { AlertCircle, ArrowUp, Minus, AlertTriangle } from 'lucide-react'

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

interface TicketPriorityBadgeProps {
    priority: TicketPriority
    className?: string
    showIcon?: boolean
}

const priorityConfig: Record<TicketPriority, { label: string; variant: 'default' | 'secondary' | 'destructive'; color: string; icon: React.ElementType }> = {
    LOW: {
        label: 'Low',
        variant: 'secondary',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        icon: Minus
    },
    MEDIUM: {
        label: 'Medium',
        variant: 'secondary',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        icon: AlertCircle
    },
    HIGH: {
        label: 'High',
        variant: 'default',
        color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
        icon: ArrowUp
    },
    URGENT: {
        label: 'Urgent',
        variant: 'destructive',
        color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        icon: AlertTriangle
    },
}

export function TicketPriorityBadge({ priority, className, showIcon = false }: TicketPriorityBadgeProps) {
    const config = priorityConfig[priority]
    const Tag = config.icon as any

    return (
        <Badge
            variant={config.variant}
            className={`${config.color} ${className || ''} flex items-center gap-1`}
        >
            {showIcon && <Tag className="h-3 w-3" />}
            {config.label}
        </Badge>
    )
}
