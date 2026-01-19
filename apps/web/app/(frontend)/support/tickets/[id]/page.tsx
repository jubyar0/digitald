import { getTicket } from '@/actions/tickets'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { CustomerTicketDetailsClient } from './customer-ticket-details-client'

export default async function CustomerTicketDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login?callbackUrl=/support/tickets/' + params.id)
    }

    const ticketResult = await getTicket(params.id, session.user.id, session.user.role)

    if (!ticketResult.success || !ticketResult.data) {
        redirect('/support')
    }

    // Ensure user can only view their own tickets
    if (ticketResult.data.userId !== session.user.id && session.user.role !== 'ADMIN') {
        redirect('/support')
    }

    return (
        <CustomerTicketDetailsClient
            ticket={ticketResult.data}
            currentUser={session.user}
        />
    )
}
