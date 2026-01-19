import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SellerDashboardLayout({
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

  // Only VENDOR and ADMIN roles can access seller dashboard
  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
    redirect("/unauthorized")
  }

  return <DashboardLayout layoutRole="seller">{children}</DashboardLayout>
}
