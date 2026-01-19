import { redirect } from "next/navigation"

/**
 * Seller Dashboard Route
 * Redirects /seller/dashboard to /seller
 */
export default function SellerDashboardPage() {
    redirect("/seller")
}
