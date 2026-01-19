import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DeveloperLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getCurrentSession()

    if (!session) {
        redirect("/signin")
    }

    return <DashboardLayout layoutRole="developer">{children}</DashboardLayout>
}
