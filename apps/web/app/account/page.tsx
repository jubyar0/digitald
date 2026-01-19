import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getUserProfile, getUserStats } from "@/actions/user-profile"
import { Card, CardContent } from "@/components/ui/card"
import { AccountNav } from "@/components/account-nav"
import {
    User,
    ShoppingCart,
    Heart,
    Download,
    Shield,
    Store,
    Package,
    DollarSign
} from "lucide-react"
import Link from "next/link"

export default async function AccountDashboard() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const [profile, stats] = await Promise.all([
        getUserProfile(),
        getUserStats()
    ])

    const menuItems = [
        {
            title: "Profile",
            description: "Manage your personal information",
            icon: User,
            href: "/account/profile",
            color: "text-blue-500"
        },
        {
            title: "Cart",
            description: `${stats.cartItemsCount} items in cart`,
            icon: ShoppingCart,
            href: "/account/cart",
            color: "text-green-500"
        },
        {
            title: "Wishlist",
            description: `${stats.wishlistCount} saved items`,
            icon: Heart,
            href: "/account/wishlist",
            color: "text-red-500"
        },
        {
            title: "Downloads",
            description: "Your purchased products",
            icon: Download,
            href: "/account/downloads",
            color: "text-purple-500"
        },
        {
            title: "Security",
            description: "Manage your security settings",
            icon: Shield,
            href: "/account/security",
            color: "text-orange-500"
        },
        {
            title: "Become a Seller",
            description: "Sell your digital products",
            icon: Store,
            href: "/account/become-seller",
            color: "text-cyan-500"
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar Navigation */}
                <aside className="col-span-12 md:col-span-3">
                    <AccountNav />
                </aside>

                {/* Main Content */}
                <main className="col-span-12 md:col-span-9 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold">Your Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {profile.name || profile.email}!
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
                                    </div>
                                    <Package className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                        <h3 className="text-2xl font-bold mt-1">${stats.totalSpent.toFixed(2)}</h3>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Wishlist</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.wishlistCount}</h3>
                                    </div>
                                    <Heart className="h-8 w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                                        <h3 className="text-2xl font-bold mt-1">{stats.cartItemsCount}</h3>
                                    </div>
                                    <ShoppingCart className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Menu Grid */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="rounded-lg bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                                                        <Icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
