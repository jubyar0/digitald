'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { TicketStatusBadge } from '@/components/tickets/ticket-status-badge'
import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge'
import { TicketMessageThread } from '@/components/tickets/ticket-message-thread'
import { TicketReplyForm } from '@/components/tickets/ticket-reply-form'
import { closeTicket } from '@/actions/tickets'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Tag, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SellerTicketDetailsClientProps {
    ticket: any
    currentUser: any
}

export function SellerTicketDetailsClient({ ticket, currentUser }: SellerTicketDetailsClientProps) {
    const [isClosing, setIsClosing] = useState(false)
    const router = useRouter()

    const handleClose = async () => {
        if (ticket.status === 'CLOSED') {
            toast.error('Ticket is already closed')
            return
        }

        const confirmed = window.confirm('Are you sure you want to close this ticket? This action cannot be undone.')

        if (!confirmed) return

        setIsClosing(true)
        const result = await closeTicket(ticket.id, currentUser.id, currentUser.role)

        if (result.success) {
            toast.success('Ticket closed successfully')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to close ticket')
        }
        setIsClosing(false)
    }

    const canClose = ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED'

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 dashboard-padding">
                    {/* Back Button */}
                    <div className="flex items-center justify-between">
                        <Link href="/seller/support">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Tickets
                            </Button>
                        </Link>

                        {canClose && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleClose}
                                disabled={isClosing}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Close Ticket
                            </Button>
                        )}
                    </div>

                    {/* Ticket Header */}
                    <Card>
                        <CardHeader>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <TicketStatusBadge status={ticket.status} />
                                    <TicketPriorityBadge priority={ticket.priority} showIcon />
                                    <span className="text-sm text-muted-foreground">
                                        #{ticket.id.slice(0, 8)}
                                    </span>
                                </div>
                                <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        <strong>Created:</strong> {format(new Date(ticket.createdAt), 'PPp')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        <strong>Category:</strong> {ticket.category}
                                    </span>
                                </div>

                                {ticket.assignee && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            <strong>Assigned to:</strong> {ticket.assignee.name}
                                        </span>
                                    </div>
                                )}

                                {ticket.updatedAt && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            <strong>Last updated:</strong> {format(new Date(ticket.updatedAt), 'PPp')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {ticket.status === 'CLOSED' && (
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        This ticket has been closed. You cannot add new messages.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Conversation</h3>
                        <TicketMessageThread
                            messages={ticket.messages}
                            currentUserId={currentUser.id}
                            isAdmin={false}
                        />
                    </div>

                    {/* Reply Form - Only shown if ticket is not closed */}
                    {ticket.status !== 'CLOSED' && (
                        <TicketReplyForm
                            ticketId={ticket.id}
                            userId={currentUser.id}
                            isAdmin={false}
                            onMessageAdded={() => router.refresh()}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
