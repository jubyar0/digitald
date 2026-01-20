import { UserSidebar } from "@/components/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingCartIcon,
    HeartIcon,
    DollarSignIcon,
    TrendingUpIcon,
    PackageIcon,
    BellIcon,
    EyeIcon,
    PlusIcon
} from "lucide-react"

export const dynamic = 'force-dynamic'

export default function UserDashboardPage() {
    return (
        <SidebarProvider>
            <UserSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="dashboard-grid dashboard-grid-cols-4 dashboard-padding">
                            {/* Header Section */}
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                <div className="sm:col-span-2 dashboard-card p-6">
                                    <div className="dashboard-card-header">
                                        <h3 className="dashboard-card-title">User Dashboard</h3>
                                        <p className="dashboard-card-description">
                                            Welcome back! Here's what's happening with your account today.
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 pt-4">
                                        <Button className="btn-primary">
                                            <ShoppingCartIcon className="mr-2 h-4 w-4" />
                                            View Orders
                                        </Button>
                                        <Button variant="outline" className="btn-secondary">
                                            <HeartIcon className="mr-2 h-4 w-4" />
                                            Wishlist
                                        </Button>
                                    </div>
                                </div>

                                <div className="dashboard-card p-6">
                                    <div className="dashboard-card-header">
                                        <h3 className="dashboard-card-title">Active Orders</h3>
                                    </div>
                                    <div className="dashboard-card-content">
                                        <div className="text-2xl font-bold">3</div>
                                        <p className="text-xs text-muted-foreground">
                                            2 being processed
                                        </p>
                                    </div>
                                </div>

                                <div className="dashboard-card p-6">
                                    <div className="dashboard-card-header">
                                        <h3 className="dashboard-card-title">Wishlist Items</h3>
                                    </div>
                                    <div className="dashboard-card-content">
                                        <div className="text-2xl font-bold">12</div>
                                        <p className="text-xs text-muted-foreground">
                                            +3 from last week
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">$1,234.56</div>
                                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                                        <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">+24</div>
                                        <p className="text-xs text-muted-foreground">+5 since last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                                        <HeartIcon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">12</div>
                                        <p className="text-xs text-muted-foreground">+3 new items</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Saved</CardTitle>
                                        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">$245.75</div>
                                        <p className="text-xs text-muted-foreground">In wishlist items</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                                <div className="xl:col-span-2 dashboard-card p-6">
                                    <div className="dashboard-card-header flex justify-between">
                                        <div>
                                            <h3 className="dashboard-card-title">Recent Orders</h3>
                                            <p className="dashboard-card-description">Your latest purchases</p>
                                        </div>
                                        <Button variant="ghost" className="p-0 h-auto">
                                            View all
                                        </Button>
                                    </div>
                                    <div className="dashboard-card-content space-y-4">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">Order #{12345 + item}</p>
                                                    <p className="text-sm text-muted-foreground">Product {item}</p>
                                                </div>
                                                <div className="ml-auto font-medium">$12{item}.99</div>
                                                <Badge variant="secondary" className="ml-2">
                                                    Processing
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="dashboard-card p-6">
                                    <div className="dashboard-card-header">
                                        <h3 className="dashboard-card-title">Quick Actions</h3>
                                    </div>
                                    <div className="dashboard-card-content grid gap-4">
                                        <Button className="btn-primary w-full">
                                            <EyeIcon className="mr-2 h-4 w-4" />
                                            Browse Products
                                        </Button>
                                        <Button variant="outline" className="btn-secondary w-full">
                                            <HeartIcon className="mr-2 h-4 w-4" />
                                            View Wishlist
                                        </Button>
                                        <Button variant="outline" className="btn-secondary w-full">
                                            <PackageIcon className="mr-2 h-4 w-4" />
                                            Track Orders
                                        </Button>
                                        <Button variant="outline" className="btn-secondary w-full">
                                            <BellIcon className="mr-2 h-4 w-4" />
                                            Notifications
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
