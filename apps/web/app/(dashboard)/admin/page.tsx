import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getDashboardAnalytics, getDashboardStats } from '@/actions/admin'
import { DashboardStats } from './_components/dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    Users,
    Package,
    Wallet,
    AlertTriangle,
    CreditCard,
    Settings,
    ShieldCheck,
    FileText,
    ShoppingBag
} from 'lucide-react'

// ✅ Dynamic imports for heavy chart components
const RevenueChart = dynamic(() =>
    import('./_components/revenue-chart').then(mod => ({ default: mod.RevenueChart })),
    {
        loading: () => <ChartSkeleton />,
        ssr: false // Charts don't need SSR, can load on client
    }
)

const OrdersChart = dynamic(() =>
    import('./_components/orders-chart').then(mod => ({ default: mod.OrdersChart })),
    {
        loading: () => <ChartSkeleton />,
        ssr: false
    }
)

const RecentActivity = dynamic(() =>
    import('./_components/recent-activity').then(mod => ({ default: mod.RecentActivity })),
    {
        loading: () => <ActivitySkeleton />
    }
)

// Chart loading skeleton
function ChartSkeleton() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
            <CardContent>
                <div className="h-[350px] bg-muted animate-pulse rounded" />
            </CardContent>
        </Card>
    )
}

// Activity loading skeleton
function ActivitySkeleton() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
        </div>
    )
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                <Skeleton className="col-span-3 h-[400px] rounded-xl" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                <Skeleton className="col-span-3 h-[400px] rounded-xl" />
            </div>
        </div>
    )
}

// 1. Static Component - Renders Immediately
function QuickActions() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/users">
                                <Users className="h-5 w-5" />
                                <span className="text-xs">Users</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/vendors">
                                <ShieldCheck className="h-5 w-5" />
                                <span className="text-xs">Vendors</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/seller-applications">
                                <Users className="h-5 w-5" />
                                <span className="text-xs">Applications</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/products">
                                <Package className="h-5 w-5" />
                                <span className="text-xs">Products</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/orders">
                                <FileText className="h-5 w-5" />
                                <span className="text-xs">Orders</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/escrow">
                                <Wallet className="h-5 w-5" />
                                <span className="text-xs">Escrow</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/withdrawals">
                                <CreditCard className="h-5 w-5" />
                                <span className="text-xs">Withdrawals</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/disputes">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="text-xs">Disputes</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/settings">
                                <Settings className="h-5 w-5" />
                                <span className="text-xs">Settings</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                            <Link href="/admin/apps">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="text-xs">Apps</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// 2. Async Stats Component
async function StatsSection() {
    const stats = await getDashboardStats()

    // Merge stats for the cards
    const mergedStats = {
        ...stats,
        revenue: {
            ...stats.revenue,
            growth: 20.1
        }
    }

    return <DashboardStats stats={mergedStats} />
}

// 3. Async Analytics Component
async function AnalyticsSection() {
    const analytics = await getDashboardAnalytics()

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart data={analytics.revenue} />
                <OrdersChart data={analytics.orders} />
            </div>

            <RecentActivity
                recentOrders={analytics.recentOrders}
                newUsers={analytics.newUsers}
            />
        </div>
    )
}

export default function AdminDashboardPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome to the admin control panel</p>
                </div>
            </div>

            {/* 1. Stats Grid - Loads independently */}
            <Suspense fallback={<StatsSkeleton />}>
                <StatsSection />
            </Suspense>

            {/* 2. Quick Actions - Static, loads IMMEDIATELY */}
            <QuickActions />

            {/* 3. Analytics Charts - Loads independently */}
            <Suspense fallback={<AnalyticsSkeleton />}>
                <AnalyticsSection />
            </Suspense>
        </div>
    )
}
