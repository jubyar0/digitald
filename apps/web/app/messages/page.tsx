import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import LandingNavbar from "@/components/landing/navbar"
import FooterSection from "@/components/landing/footer"
import { getCustomerConversations } from '@/actions/messages'
import { CustomerMessagesClient } from './_components/messages-client'

export default async function MessagesPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const conversations = await getCustomerConversations()

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navbar */}
            <LandingNavbar />

            {/* Spacer for fixed navbar */}
            <div className="h-[140px]" />

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 lg:px-6 py-6">
                <CustomerMessagesClient initialConversations={conversations} />
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    )
}
