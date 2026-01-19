import { Badge } from '@/components/ui/badge'

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

interface TicketStatusBadgeProps {
    status: TicketStatus
    className?: string
}

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
    OPEN: {
        label: 'Open',
        variant: 'secondary',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    },
    IN_PROGRESS: {
        label: 'In Progress',
        variant: 'default',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    },
    RESOLVED: {
        label: 'Resolved',
        variant: 'outline',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    CLOSED: {
        label: 'Closed',
        variant: 'outline',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    },
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <Badge
            variant={config.variant}
            className={`${config.color} ${className || ''}`}
        >
            {config.label}
        </Badge>
    )
}
