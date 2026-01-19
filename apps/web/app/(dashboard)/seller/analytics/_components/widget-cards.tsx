'use client'

import React, { memo, lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AVAILABLE_WIDGETS } from './widget-definitions'

// Lazy load chart components for code splitting
const SalesOverTimeChart = lazy(() =>
    import('../analytics-charts').then(mod => ({ default: mod.SalesOverTimeChart }))
)

function ChartSkeleton() {
    return <Skeleton className="w-full h-[200px] rounded" />
}

// Stat Card Component
interface StatCardProps {
    title: string
    value: string
    subtitle?: string
}

const StatCard = memo(function StatCard({ title, value, subtitle }: StatCardProps) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </CardContent>
        </Card>
    )
})

// Sales Breakdown Card
const SalesBreakdownCard = memo(function SalesBreakdownCard() {
    const items = [
        'Gross sales', 'Discounts', 'Returns', 'Net sales',
        'Shipping charges', 'Return fees', 'Taxes', 'Total sales'
    ]

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Total sales breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 text-sm">
                    {items.map((label, i) => (
                        <div
                            key={label}
                            className={cn(
                                "flex justify-between items-center",
                                i < 7 && "border-b pb-2"
                            )}
                        >
                            <span className="text-blue-600">{label}</span>
                            <span>DZD 0.00 —</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
})

// Main widget renderer
export const renderWidgetContent = (id: string): React.ReactNode => {
    switch (id) {
        case 'gross_sales':
            return <StatCard title="Gross sales" value="DZD 0 —" subtitle="DZD 0" />
        case 'returning_rate':
            return <StatCard title="Returning customer rate" value="0% —" subtitle="—" />
        case 'orders_fulfilled':
            return <StatCard title="Orders fulfilled" value="0 —" subtitle="—" />
        case 'orders':
            return <StatCard title="Orders" value="0 —" subtitle="—" />
        case 'net_sales':
            return <StatCard title="Net sales" value="DZD 0 —" subtitle="DZD 0" />
        case 'avg_order_value':
            return <StatCard title="Average order value" value="DZD 0 —" subtitle="—" />
        case 'returns':
            return <StatCard title="Returns" value="0 —" subtitle="—" />
        case 'discounts':
            return <StatCard title="Discounts" value="DZD 0 —" subtitle="—" />
        case 'conversion_rate':
            return <StatCard title="Conversion rate" value="0% —" subtitle="—" />
        case 'sales_breakdown':
            return <SalesBreakdownCard />
        case 'sales_over_time':
            return (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total sales over time</CardTitle>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">DZD 0 —</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<ChartSkeleton />}>
                            <SalesOverTimeChart />
                        </Suspense>
                    </CardContent>
                </Card>
            )
        default:
            const widget = AVAILABLE_WIDGETS.find(w => w.id === id)
            return (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">{widget?.title || id}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[150px]">
                        <p className="text-sm text-muted-foreground">No data available</p>
                    </CardContent>
                </Card>
            )
    }
}
