import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { TrendingUpIcon, DollarSignIcon, ShoppingCartIcon, UsersIcon } from "lucide-react"
import { getSellerAnalytics } from "@/actions/seller"
import { SalesChart } from "./sales-chart"

export default async function AnalyticsPage() {
    const {
        salesData,
        topProducts,
        stats = { totalRevenue: 0, revenueGrowth: 0, totalSales: 0, salesGrowth: 0, totalCustomers: 0, customersGrowth: 0, conversionRate: 0, conversionGrowth: 0 },
        customerInsights = { newCustomers: 0, returningCustomers: 0, averageOrderValue: 0 }
    } = await getSellerAnalytics()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Sales Analytics</h3>
                            <p className="dashboard-card-description">Track your store performance and insights</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">+{stats.revenueGrowth.toFixed(1)}% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalSales}</div>
                                <p className="text-xs text-muted-foreground">+{stats.salesGrowth.toFixed(1)}% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                                <p className="text-xs text-muted-foreground">+{stats.customersGrowth.toFixed(1)}% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground">+{stats.conversionGrowth.toFixed(1)}% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <SalesChart data={salesData} />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No sales yet.</p>
                                    ) : (
                                        topProducts.map((product) => (
                                            <div key={product.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted relative">
                                                        <Image
                                                            src={product.image || '/placeholder.png'}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-sm">${product.revenue.toFixed(2)}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">New Customers</p>
                                        <p className="font-medium">+{customerInsights.newCustomers}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Returning Customers</p>
                                        <p className="font-medium">{customerInsights.returningCustomers}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Average Order Value</p>
                                        <p className="font-medium">${customerInsights.averageOrderValue.toFixed(2)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
