import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CreditCard, DollarSign, Users, ArrowUpRight, ArrowDownRight, Megaphone, Target, BarChart3, Mail } from "lucide-react"
import Link from "next/link"
import { getMarketingStats } from "@/actions/marketing"

export default async function MarketingPage() {
    const statsResult = await getMarketingStats()
    const stats = statsResult.success && statsResult.data ? statsResult.data : {
        sessions: 0,
        sales: 0,
        orders: 0,
        conversionRate: "0%",
        aov: "DZD 0"
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="dashboard-card p-6 w-full">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Marketing</h3>
                                <p className="dashboard-card-description">Manage your marketing campaigns and automations</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/seller/marketing/campaigns/new">
                                <Button>Create campaign</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Summary Metrics */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x">
                                <div className="px-4 first:pl-0">
                                    <div className="text-sm font-medium text-muted-foreground">Sessions</div>
                                    <div className="text-2xl font-bold">{stats.sessions}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className="text-emerald-500 flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            0%
                                        </span>
                                        <span className="ml-1">vs last period</span>
                                    </div>
                                </div>
                                <div className="px-4">
                                    <div className="text-sm font-medium text-muted-foreground">Sales attributed to marketing</div>
                                    <div className="text-2xl font-bold">DZD {stats.sales}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className="text-emerald-500 flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            0%
                                        </span>
                                        <span className="ml-1">vs last period</span>
                                    </div>
                                </div>
                                <div className="px-4">
                                    <div className="text-sm font-medium text-muted-foreground">Orders attributed to marketing</div>
                                    <div className="text-2xl font-bold">{stats.orders}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className="text-emerald-500 flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            0%
                                        </span>
                                        <span className="ml-1">vs last period</span>
                                    </div>
                                </div>
                                <div className="px-4">
                                    <div className="text-sm font-medium text-muted-foreground">Conversion rate</div>
                                    <div className="text-2xl font-bold">{stats.conversionRate}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className="text-rose-500 flex items-center">
                                            <ArrowDownRight className="h-3 w-3 mr-1" />
                                            0%
                                        </span>
                                        <span className="ml-1">vs last period</span>
                                    </div>
                                </div>
                                <div className="px-4">
                                    <div className="text-sm font-medium text-muted-foreground">AOV attributed to marketing</div>
                                    <div className="text-2xl font-bold">{stats.aov}</div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <span className="text-emerald-500 flex items-center">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            0%
                                        </span>
                                        <span className="ml-1">vs last period</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Marketing Apps */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Marketing apps</CardTitle>
                                <CardDescription>
                                    Install apps to help you reach more customers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Email Marketing</h4>
                                            <p className="text-sm text-muted-foreground">Create and send email campaigns</p>
                                        </div>
                                        <Button variant="outline" size="sm">Install</Button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Megaphone className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">Social Media Ads</h4>
                                            <p className="text-sm text-muted-foreground">Run ads on Facebook and Instagram</p>
                                        </div>
                                        <Button variant="outline" size="sm">Install</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Channels */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top marketing channels</CardTitle>
                                <CardDescription>
                                    Where your customers are coming from
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="text-sm font-medium">Direct</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">0%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-sm font-medium">Social</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">0%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                                            <span className="text-sm font-medium">Search</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">0%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                                            <span className="text-sm font-medium">Email</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">0%</span>
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
