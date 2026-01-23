import { Suspense } from 'react'
import { SetupGuide } from '@/components/dashboard/seller/setup-guide'
import { Configuration } from '@/components/dashboard/seller/configuration'
import { PromotionalBanner } from '@/components/dashboard/seller/promotional-banner'
import { FooterBanner } from '@/components/dashboard/seller/footer-banner'
import { getSellerDashboardStats } from '@/actions/seller'
import { DashboardStats } from '@/components/dashboard/seller/dashboard-stats'

// Route Segment Config - Enable ISR with 30 second revalidation
export const revalidate = 30
export const dynamic = 'force-dynamic'

export default async function SellerDashboardPage() {
  const stats = await getSellerDashboardStats()

  return (
    <div className="flex flex-1 flex-col container mx-auto">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="dashboard-padding space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <DashboardStats stats={stats} />

          <div className="grid gap-6">
            <SetupGuide
              storeName={stats.storeName ?? null}
              latestProduct={stats.latestProduct}
            />
            <Configuration />
            <PromotionalBanner />
            <FooterBanner />
          </div>
        </div>
      </div>
    </div>
  )
}
