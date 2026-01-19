import { Card, CardContent } from '@/components/ui/card'
import { TicketStatusBadge, TicketStatus } from './ticket-status-badge'
import { TicketPriorityBadge, TicketPriority } from './ticket-priority-badge'
import { Button } from '@/components/ui/button'
import { Eye, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface TicketCardProps {
    ticket: {
        id: string
        subject: string
        description: string
        status: TicketStatus
        priority: TicketPriority
        category: string
        createdAt: Date
        user?: {
            name: string | null
            email: string
        }
        assignee?: {
            name: string | null
        } | null
        _count?: {
            messages: number
        }
    }
    viewPath: string
    showUser?: boolean
}

export function TicketCard({ ticket, viewPath, showUser = false }: TicketCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <TicketStatusBadge status={ticket.status} />
                            <TicketPriorityBadge priority={ticket.priority} showIcon />
                            <span className="text-xs text-muted-foreground">
                                #{ticket.id.slice(0, 8)}
                            </span>
                        </div>

                        <h3 className="font-semibold text-lg">{ticket.subject}</h3>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                        </p>

                        <div className="flex gap-4 text-sm flex-wrap">
                            <span>
                                <strong className="text-muted-foreground">Category:</strong> {ticket.category}
                            </span>
                            {showUser && ticket.user && (
                                <span>
                                    <strong className="text-muted-foreground">User:</strong> {ticket.user.name || ticket.user.email}
                                </span>
                            )}
                            {ticket.assignee && (
                                <span>
                                    <strong className="text-muted-foreground">Assigned to:</strong> {ticket.assignee.name}
                                </span>
                            )}
                            {ticket._count && (
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {ticket._count.messages}
                                </span>
                            )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Created {format(new Date(ticket.createdAt), 'PPp')}
                        </div>
                    </div>

                    <Link href={`${viewPath}/${ticket.id}`}>
                        <Button>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
