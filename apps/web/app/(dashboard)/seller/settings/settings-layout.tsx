
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Search,
    Settings,
    CreditCard,
    Users,
    Wallet,
    ShoppingCart,
    UserCircle,
    Truck,
    Receipt,
    MapPin,
    AppWindow,
    Store,
    Globe,
    Activity,
    Bell,
    Database,
    Languages,
    Shield,
    FileText,
    ChevronRight,
    Palette,
} from "lucide-react"

interface SettingsLayoutProps {
    children: React.ReactNode
    storeName?: string
    storeLocation?: string
    storeAvatar?: string
    userEmail?: string
    userName?: string
    userAvatar?: string
}

interface SettingsMenuItem {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    indent?: boolean
}

const settingsMenuItems: SettingsMenuItem[] = [
    { title: "General", href: "/seller/settings/general", icon: Settings },
    { title: "Brand", href: "/seller/settings/brand", icon: Palette },
    { title: "Plan", href: "/seller/settings/plan", icon: CreditCard },
    { title: "Billing", href: "/seller/settings/billing", icon: Receipt },
    { title: "Users", href: "/seller/settings/users", icon: Users },
    { title: "Roles", href: "/seller/settings/users/roles", indent: true },
    { title: "Security", href: "/seller/settings/users/security", indent: true },
    { title: "Payments", href: "/seller/settings/payments", icon: Wallet },
    { title: "Checkout", href: "/seller/settings/checkout", icon: ShoppingCart },
    { title: "Customer accounts", href: "/seller/settings/customer-accounts", icon: UserCircle },
    { title: "Shipping and delivery", href: "/seller/settings/shipping", icon: Truck },
    { title: "Taxes and duties", href: "/seller/settings/tax", icon: Receipt },
    { title: "Locations", href: "/seller/settings/locations", icon: MapPin },
    { title: "Apps", href: "/seller/settings/apps", icon: AppWindow },
    { title: "Sales channels", href: "/seller/settings/sales-channels", icon: Store },

    { title: "Customer events", href: "/seller/settings/customer-events", icon: Activity },
    { title: "Notifications", href: "/seller/settings/notifications", icon: Bell },
    { title: "Metafields and metaobjects", href: "/seller/settings/metafields", icon: Database },
    { title: "Languages", href: "/seller/settings/languages", icon: Languages },
    { title: "Customer privacy", href: "/seller/settings/customer-privacy", icon: Shield },
    { title: "Policies", href: "/seller/settings/policies", icon: FileText },
]

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SettingsLayout({
    children,
    storeName = "My Store",
    storeLocation = "Location not set",
    storeAvatar,
    userEmail = "user@example.com",
    userName = "Store Owner",
    userAvatar,
}: SettingsLayoutProps) {
    const pathname = usePathname()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredMenuItems = settingsMenuItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-1 flex-col container mx-auto p-6">
            <div className="flex flex-1 gap-4 items-start">
                {/* Settings Sidebar */}
                {pathname !== "/seller/settings" && pathname !== "/seller/settings/" && (
                    <Card className="w-[250px] flex flex-col sticky top-6 max-h-[calc(100vh-6rem)]">
                        {/* Store Header */}
                        <CardHeader className="p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-lg">
                                    <AvatarImage src={storeAvatar} alt={storeName} />
                                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                                        {storeName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{storeName}</p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                        <p className="truncate">{storeLocation}</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex flex-col min-h-0">
                            {/* Search */}
                            <div className="p-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#262626] dark:text-gray-300" />
                                    <Input
                                        id="settings-search"
                                        name="settings-search"
                                        placeholder="Search"
                                        className="pl-9 h-9 bg-muted/50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <ScrollArea className="flex-1 overflow-y-auto">
                                <nav className="p-2 space-y-0.5">
                                    {filteredMenuItems.map((item) => {
                                        const isActive = pathname === item.href
                                        const Icon = item.icon
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                                    item.indent && "pl-9",
                                                    isActive
                                                        ? "bg-accent text-accent-foreground font-medium"
                                                        : "text-[#262626] dark:text-gray-300 hover:bg-accent/50 hover:text-accent-foreground"
                                                )}
                                            >
                                                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                                                <span className="truncate">{item.title}</span>
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </ScrollArea>
                        </CardContent>

                        {/* User Profile at Bottom */}
                        <CardFooter className="p-3 border-t mt-auto">
                            <Link
                                href="/seller/settings/profile"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
                                    pathname === "/seller/settings/profile"
                                        ? "bg-accent"
                                        : "hover:bg-accent/50"
                                )}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userAvatar} alt={userName} />
                                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs">
                                        {userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{userName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                </div>
                            </Link>
                        </CardFooter>
                    </Card>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
