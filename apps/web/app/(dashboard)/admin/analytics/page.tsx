import { getAnalytics } from '@/actions/admin'
import { AnalyticsClient } from '../_components/analytics-client'

export default async function AnalyticsPage() {
    const analytics = await getAnalytics()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Platform Analytics</h3>
                            <p className="dashboard-card-description">
                                Overview of platform performance and metrics
                            </p>
                        </div>
                    </div>

                    <AnalyticsClient initialAnalytics={analytics} />
                </div>
            </div>
        </div>
    )
}
