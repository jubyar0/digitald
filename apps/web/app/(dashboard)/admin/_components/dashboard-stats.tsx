import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import {
    UsersIcon,
    StoreIcon,
    PackageIcon,
    DollarSignIcon,
    TrendingUpIcon,
    AlertCircleIcon,
    CreditCardIcon,
    ActivityIcon
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardStatsProps {
    stats: {
        revenue: { total: number; growth: number }
        users: { total: number; new: number }
        vendors: { total: number; pending: number }
        products: { total: number; pending: number }
        disputes: { active: number }
        payouts: { amount: number; count: number }
    }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <TrendingUpIcon className="mr-1 h-3 w-3 text-green-500" />
                        <span className="text-green-500 font-medium">+{stats.revenue.growth}%</span>
                        <span className="ml-1">from last month</span>
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        +{stats.users.new} new this week
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Seller Applications</CardTitle>
                    <StoreIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.vendors.total.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        {stats.vendors.pending > 0 ? (
                            <span className="text-amber-500 font-medium flex items-center">
                                <AlertCircleIcon className="mr-1 h-3 w-3" />
                                {stats.vendors.pending} pending review
                            </span>
                        ) : (
                            <span>All applications reviewed</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                    <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.payouts.amount)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.payouts.count} requests pending
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
