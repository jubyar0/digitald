import { getTicket, getAdmins } from '@/actions/tickets'
import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TicketDetailsClient } from './ticket-details-client'

export default async function AdminTicketDetailsPage({ params }: { params: { id: string } }) {
    const { user } = await requireAdmin()

    const [ticketResult, adminsResult] = await Promise.all([
        getTicket(params.id, user.id, user.role),
        getAdmins()
    ])

    if (!ticketResult.success || !ticketResult.data) {
        redirect('/admin/support')
    }

    const admins: { name: string | null; id: string; email: string }[] = adminsResult.success && adminsResult.data ? adminsResult.data : []

    return (
        <TicketDetailsClient
            ticket={ticketResult.data}
            currentUser={user}
            admins={admins}
        />
    )
}
