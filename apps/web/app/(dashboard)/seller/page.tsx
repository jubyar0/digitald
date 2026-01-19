import { Suspense } from 'react'
import { SetupGuide } from '@/components/dashboard/seller/setup-guide'
import { Configuration } from '@/components/dashboard/seller/configuration'
import { PromotionalBanner } from '@/components/dashboard/seller/promotional-banner'
import { FooterBanner } from '@/components/dashboard/seller/footer-banner'

// Route Segment Config - Enable ISR with 30 second revalidation
export const revalidate = 30
export const dynamic = 'force-dynamic'

export default function SellerDashboardPage() {
  return (
    <div className="flex flex-1 flex-col container mx-auto">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="dashboard-padding">
          <SetupGuide />
          <Configuration />
          <PromotionalBanner />
          <FooterBanner />
        </div>
      </div>
    </div>
  )
}
