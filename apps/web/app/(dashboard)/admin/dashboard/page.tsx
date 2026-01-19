import { redirect } from "next/navigation"

/**
 * Admin Dashboard Route
 * Redirects /admin/dashboard to /admin
 */
export default function AdminDashboardPage() {
    redirect("/admin")
}
