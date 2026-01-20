import { getConversations } from "@/actions/messages"
import { MessagesClient } from "../_components/messages-client"

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
    const conversations = await getConversations()

    return (
        <div className="flex flex-1 flex-col container mx-auto h-[calc(100vh-6rem)]">
            <div className="dashboard-padding h-full">
                <MessagesClient initialConversations={conversations} />
            </div>
        </div>
    )
}
