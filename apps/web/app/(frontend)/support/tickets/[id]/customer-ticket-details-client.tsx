'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TicketStatusBadge } from '@/components/tickets/ticket-status-badge'
import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge'
import { TicketMessageThread } from '@/components/tickets/ticket-message-thread'
import { TicketReplyForm } from '@/components/tickets/ticket-reply-form'
import { closeTicket } from '@/actions/tickets'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Tag, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CustomerTicketDetailsClientProps {
    ticket: any
    currentUser: any
}

export function CustomerTicketDetailsClient({ ticket, currentUser }: CustomerTicketDetailsClientProps) {
    const [isClosing, setIsClosing] = useState(false)
    const router = useRouter()

    const handleClose = async () => {
        if (ticket.status === 'CLOSED') {
            toast.error('Ticket is already closed')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to close this ticket? You won\'t be able to add more messages.'
        )

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
    const isResolved = ticket.status === 'RESOLVED'

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Back Button */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/support">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Support
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

            {/* Resolved Banner */}
            {isResolved && (
                <div className="mb-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="font-semibold text-green-900 dark:text-green-100">
                                Ticket Resolved
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                This ticket has been marked as resolved by our support team.
                                {ticket.resolvedAt && ` on ${format(new Date(ticket.resolvedAt), 'PPp')}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ticket Header */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <TicketStatusBadge status={ticket.status} />
                            <TicketPriorityBadge priority={ticket.priority} showIcon />
                            <span className="text-sm text-muted-foreground">
                                Ticket #{ticket.id.slice(0, 8)}
                            </span>
                        </div>
                        <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                <strong>Submitted:</strong> {format(new Date(ticket.createdAt), 'PPp')}
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
                                    <strong>Assigned to:</strong> {ticket.assignee.name} (Support Team)
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
                        <div className="bg-muted p-4 rounded-lg mt-4">
                            <p className="text-sm text-muted-foreground">
                                This ticket has been closed. You cannot add new messages.
                                If you have a new issue, please submit a new ticket.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Conversation</h3>
                <TicketMessageThread
                    messages={ticket.messages}
                    currentUserId={currentUser.id}
                    isAdmin={false}
                />
            </div>

            {/* Reply Form - Only shown if ticket is not closed */}
            {ticket.status !== 'CLOSED' && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Add a Reply</h3>
                    <TicketReplyForm
                        ticketId={ticket.id}
                        userId={currentUser.id}
                        isAdmin={false}
                        onMessageAdded={() => router.refresh()}
                    />
                </div>
            )}

            {/* Help Text */}
            <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                        Need more help?
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Our support team is here to help! You&apos;ll receive a notification when we reply to your ticket.
                        Average response time is within 24 hours.
                    </p>
                    <Link href="/support">
                        <Button variant="outline" size="sm">
                            Submit Another Ticket
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
