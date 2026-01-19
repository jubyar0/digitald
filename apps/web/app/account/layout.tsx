import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getCurrentSession()

    if (!session?.user) {
        redirect("/signin")
    }

    // Simple passthrough - navbar and footer will show from root layout
    return <>{children}</>
}
