import { DashboardLayout } from "@/components/dashboard-layout"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}