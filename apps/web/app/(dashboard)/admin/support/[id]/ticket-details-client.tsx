'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TicketStatusBadge } from '@/components/tickets/ticket-status-badge'
import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge'
import { TicketMessageThread } from '@/components/tickets/ticket-message-thread'
import { TicketReplyForm } from '@/components/tickets/ticket-reply-form'
import { assignTicket, updateTicketStatus, updateTicketPriority } from '@/actions/tickets'
import { toast } from 'sonner'
import { TicketStatus, TicketPriority } from '@repo/database'
import { format } from 'date-fns'
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TicketDetailsClientProps {
    ticket: any
    currentUser: any
    admins: any[]
}

export function TicketDetailsClient({ ticket: initialTicket, currentUser, admins }: TicketDetailsClientProps) {
    const [ticket, setTicket] = useState(initialTicket)
    const [updating, setUpdating] = useState(false)
    const router = useRouter()

    const handleAssign = async (adminId: string) => {
        setUpdating(true)
        const result = await assignTicket(ticket.id, adminId)
        if (result.success) {
            toast.success('Ticket assigned successfully')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to assign ticket')
        }
        setUpdating(false)
    }

    const handleStatusChange = async (status: TicketStatus) => {
        setUpdating(true)
        const result = await updateTicketStatus(
            ticket.id,
            status,
            status === 'RESOLVED' ? currentUser.id : undefined
        )
        if (result.success) {
            toast.success('Status updated successfully')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to update status')
        }
        setUpdating(false)
    }

    const handlePriorityChange = async (priority: TicketPriority) => {
        setUpdating(true)
        const result = await updateTicketPriority(ticket.id, priority)
        if (result.success) {
            toast.success('Priority updated successfully')
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to update priority')
        }
        setUpdating(false)
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 dashboard-padding">
                    {/* Back Button */}
                    <Link href="/admin/support">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Tickets
                        </Button>
                    </Link>

                    {/* Ticket Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <TicketStatusBadge status={ticket.status} />
                                        <TicketPriorityBadge priority={ticket.priority} showIcon />
                                        <span className="text-sm text-muted-foreground">
                                            #{ticket.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        <strong>Submitted by:</strong> {ticket.user.name || ticket.user.email}
                                    </span>
                                </div>

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
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <strong>Assigned to:</strong> {ticket.assignee.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Controls</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Assign To</label>
                                    <Select
                                        defaultValue={ticket.assignedTo || 'unassigned'}
                                        onValueChange={handleAssign}
                                        disabled={updating}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {admins.map((admin) => (
                                                <SelectItem key={admin.id} value={admin.id}>
                                                    {admin.name || admin.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        defaultValue={ticket.status}
                                        onValueChange={handleStatusChange}
                                        disabled={updating}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPEN">Open</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                                            <SelectItem value="CLOSED">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Priority</label>
                                    <Select
                                        defaultValue={ticket.priority}
                                        onValueChange={handlePriorityChange}
                                        disabled={updating}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Conversation</h3>
                        <TicketMessageThread
                            messages={ticket.messages}
                            currentUserId={currentUser.id}
                            isAdmin={true}
                        />
                    </div>

                    {/* Reply Form */}
                    <TicketReplyForm
                        ticketId={ticket.id}
                        userId={currentUser.id}
                        isAdmin={true}
                        onMessageAdded={() => router.refresh()}
                    />
                </div>
            </div>
        </div>
    )
}
