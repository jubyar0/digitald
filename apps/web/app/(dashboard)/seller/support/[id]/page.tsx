import { getTicket } from '@/actions/tickets'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { SellerTicketDetailsClient } from './seller-ticket-details-client'

export default async function SellerTicketDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login')
    }

    const ticketResult = await getTicket(params.id, session.user.id, session.user.role)

    if (!ticketResult.success || !ticketResult.data) {
        redirect('/seller/support')
    }

    // Ensure user can only view their own tickets
    if (ticketResult.data.userId !== session.user.id && session.user.role !== 'ADMIN') {
        redirect('/seller/support')
    }

    return (
        <SellerTicketDetailsClient
            ticket={ticketResult.data}
            currentUser={session.user}
        />
    )
}
