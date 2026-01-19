'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { TicketCard } from '@/components/tickets/ticket-card'
import { TicketFilters } from '@/components/tickets/ticket-filters'
import { getMyTickets } from '@/actions/tickets'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { TicketStatus } from '@repo/database'
import { useSession } from 'next-auth/react'

export default function SellerSupportPage() {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>()
    const pageSize = 10

    const fetchTickets = async () => {
        if (!session?.user?.id) return

        setLoading(true)
        try {
            const result = await getMyTickets(session.user.id, page, pageSize, statusFilter)

            if (result.success) {
                setTickets(result.data || [])
                setTotal(result.total || 0)
            }
        } catch (error) {
            toast.error('Failed to load tickets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [page, statusFilter, session?.user?.id])

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="flex items-center justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Support Tickets</h3>
                                <p className="dashboard-card-description">
                                    View and manage your support tickets
                                </p>
                            </div>
                            <Link href="/seller/support/new">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Ticket
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <TicketFilters
                        onStatusChange={(value) => {
                            setStatusFilter(value === 'all' ? undefined : value as TicketStatus)
                            setPage(1)
                        }}
                    />

                    {/* Tickets List */}
                    <div className="space-y-4">
                        {loading ? (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    Loading your tickets...
                                </CardContent>
                            </Card>
                        ) : tickets.length === 0 ? (
                            <Card>
                                <CardContent className="p-6 text-center space-y-4">
                                    <p className="text-muted-foreground">No tickets found</p>
                                    <Link href="/seller/support/new">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your First Ticket
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            tickets.map((ticket) => (
                                <TicketCard
                                    key={ticket.id}
                                    ticket={ticket}
                                    viewPath="/seller/support"
                                    showUser={false}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {total > pageSize && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} tickets
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * pageSize >= total}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
