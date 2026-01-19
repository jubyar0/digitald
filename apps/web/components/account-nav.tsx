'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    User,
    ShoppingCart,
    Heart,
    Download,
    Shield,
    Store,
    Settings,
    CreditCard,
    Bell,
    HelpCircle
} from "lucide-react"

const accountLinks = [
    {
        title: "Dashboard",
        href: "/account",
        icon: User,
    },
    {
        title: "Profile",
        href: "/account/profile",
        icon: Settings,
    },
    {
        title: "Cart",
        href: "/account/cart",
        icon: ShoppingCart,
    },
    {
        title: "Wishlist",
        href: "/account/wishlist",
        icon: Heart,
    },
    {
        title: "Downloads",
        href: "/account/downloads",
        icon: Download,
    },
    {
        title: "Orders",
        href: "/account/orders",
        icon: CreditCard,
    },
    {
        title: "Security",
        href: "/account/security",
        icon: Shield,
    },
    {
        title: "Notifications",
        href: "/account/notifications",
        icon: Bell,
    },
    {
        title: "Become a Seller",
        href: "/account/become-seller",
        icon: Store,
    },
    {
        title: "Help & Support",
        href: "/account/support",
        icon: HelpCircle,
    },
]

export function AccountNav() {
    const pathname = usePathname()

    return (
        <nav className="space-y-1">
            <div className="px-3 py-2">
                <h2 className="text-lg font-semibold tracking-tight">
                    My Account
                </h2>
            </div>
            <div className="space-y-1">
                {accountLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href ||
                        (link.href !== "/account" && pathname.startsWith(link.href))

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                                isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.title}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
