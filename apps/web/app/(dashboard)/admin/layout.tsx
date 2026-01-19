import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Server-side role validation
    const session = await getCurrentSession()

    // Redirect unauthenticated users to signin
    if (!session) {
        redirect("/signin")
    }

    // Only ADMIN role can access admin dashboard
    if (session.user.role !== "ADMIN") {
        redirect("/unauthorized")
    }

    return <DashboardLayout layoutRole="admin">{children}</DashboardLayout>
}
