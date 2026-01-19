"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
    Search,
    Menu,
    X,
    Heart,
    ShoppingCart,
    Gift,
    User,
    MessageSquare,
    CreditCard,
    Tag,
    Settings,
    LogOut,
    ShoppingBag,
    Star,
    LayoutDashboard,
    Store,
    Globe,
    Bell
} from "lucide-react"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { CartWishlistSidebar } from "@/components/cart/cart-wishlist-sidebar"
import { LocaleSettingsDialog } from "@/components/landing/locale-settings-dialog"
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown"
import { getVendorStoreRedirectUrl } from "@/actions/vendor-store-navigation"

interface NavbarCategory {
    id: string
    name: string
    slug: string
}

interface LandingNavbarProps {
    categories?: NavbarCategory[]
}

export default function LandingNavbar({ categories = [] }: LandingNavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"cart" | "wishlist">("cart")
    const [isLocaleDialogOpen, setIsLocaleDialogOpen] = useState(false)
    const { data: session, status } = useSession()

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    const handleVendorStoreClick = async () => {
        try {
            const redirectUrl = await getVendorStoreRedirectUrl()
            window.location.href = redirectUrl
        } catch (error) {
            console.error('Error navigating to vendor store:', error)
            // Fallback to become-seller page
            window.location.href = '/account/become-seller'
        }
    }

    // Get user initials for avatar
    const getUserInitials = (name: string | null | undefined) => {
        if (!name) return "U"
        const parts = name.split(" ")
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-200",
                    isScrolled ? "shadow-sm" : ""
                )}
            >
                {/* Top Bar */}
                <div className="container mx-auto px-4 lg:px-6 h-[80px] flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <span className="font-serif text-3xl sm:text-4xl text-[#F1641E]">
                            Etsy
                        </span>
                    </Link>

                    {/* Categories Menu Button (Desktop) */}
                    <div className="hidden lg:flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-muted/50 rounded-full transition-colors outline-none">
                                <Menu className="h-5 w-5" />
                                <span>Categories</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <DropdownMenuItem key={cat.id}>
                                            <Link href={`/products?category=${cat.id}`} className="w-full">
                                                {cat.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-2 text-sm text-muted-foreground">No categories found</div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Search Bar - Center */}
                    <div className="flex flex-1 max-w-2xl px-2">
                        <div className="relative w-full group">
                            <div className="flex items-center w-full h-12 rounded-full border-2 border-input bg-muted/10 hover:bg-white hover:shadow-lg focus-within:bg-white focus-within:shadow-lg focus-within:border-foreground/80 transition-all duration-200 overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search for anything"
                                    className="w-full h-full px-6 text-base bg-transparent border-none outline-none text-foreground placeholder-muted-foreground/70"
                                />
                                <button className="h-[calc(100%-8px)] mr-1 aspect-square rounded-full bg-[#F1641E] hover:bg-[#d6581b] flex items-center justify-center text-white transition-colors">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Admin Dashboard Icon */}
                        {status === "authenticated" && session?.user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className="hidden sm:flex p-2.5 rounded-full hover:bg-muted/50 transition-colors"
                                aria-label="Admin Dashboard"
                                title="Admin Dashboard"
                            >
                                <LayoutDashboard className="h-6 w-6 stroke-[1.5]" />
                            </Link>
                        )}

                        {/* Vendor Store Icon with Status Check */}
                        {status === "authenticated" && session?.user?.role === "VENDOR" && (
                            <button
                                onClick={handleVendorStoreClick}
                                className="hidden sm:flex p-2.5 rounded-full hover:bg-muted/50 transition-colors"
                                aria-label="My Store"
                                title="My Store"
                            >
                                <Store className="h-6 w-6 stroke-[1.5]" />
                            </button>
                        )}

                        {/* Notifications Bell - Show for all authenticated users */}
                        {status === "authenticated" && session?.user && (
                            <div className="hidden sm:flex">
                                <NotificationsDropdown />
                            </div>
                        )}

                        {/* User Profile / Sign In */}
                        {status === "authenticated" && session?.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-muted/50 transition-colors outline-none">
                                    {/* User Avatar */}
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-[#2F466C] flex items-center justify-center text-white text-sm font-medium">
                                            {getUserInitials(session.user.name)}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-0">
                                    {/* User Header */}
                                    <div className="p-4 bg-[#2F466C]">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-medium">
                                                {getUserInitials(session.user.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate">
                                                    {session.user.name}
                                                </p>
                                                <Link
                                                    href="/account/profile"
                                                    className="text-white/80 text-sm hover:text-white hover:underline"
                                                >
                                                    View your profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        {session.user.role === "ADMIN" && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                        <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        {session.user.role === "VENDOR" && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/seller" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                        <Store className="h-5 w-5 text-muted-foreground" />
                                                        <span>Seller Dashboard</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/account/purchases" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                                <span>Purchases and reviews</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/messages" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                                <span>Messages</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/account/credits" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                <span>Credit balance: €0.00</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/account/offers" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                <Tag className="h-5 w-5 text-muted-foreground" />
                                                <span>Special offers</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/registry" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                <Gift className="h-5 w-5 text-muted-foreground" />
                                                <span>Etsy Registry</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem asChild>
                                            <Link href="/account/settings" className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                                                <Settings className="h-5 w-5 text-muted-foreground" />
                                                <span>Account settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-red-600 focus:text-red-600"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Sign out</span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex items-center justify-center h-10 px-4 text-sm font-medium hover:bg-muted/50 rounded-full transition-colors whitespace-nowrap"
                            >
                                Sign in
                            </Link>
                        )}

                        {/* Favorites */}
                        <button
                            className="p-2.5 rounded-full hover:bg-muted/50 transition-colors"
                            aria-label="Favorites"
                            onClick={() => {
                                setActiveTab("wishlist")
                                setIsSidebarOpen(true)
                            }}
                        >
                            <Heart className="h-6 w-6 stroke-[1.5]" />
                        </button>

                        {/* Gift / Registry */}
                        <button className="hidden sm:flex p-2.5 rounded-full hover:bg-muted/50 transition-colors" aria-label="Gift Registry">
                            <Gift className="h-6 w-6 stroke-[1.5]" />
                        </button>

                        {/* Cart */}
                        <button
                            className="p-2.5 rounded-full hover:bg-muted/50 transition-colors"
                            aria-label="Cart"
                            onClick={() => {
                                setActiveTab("cart")
                                setIsSidebarOpen(true)
                            }}
                        >
                            <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2.5 rounded-full hover:bg-muted/50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6 stroke-[1.5]" />
                            ) : (
                                <Menu className="h-6 w-6 stroke-[1.5]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Bar - Categories */}
                <div className="block border-b border-border/20">
                    <div className="container mx-auto px-6">
                        <nav className="flex items-center justify-between py-3">
                            {/* Locale Button */}
                            <button
                                onClick={() => setIsLocaleDialogOpen(true)}
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group shrink-0"
                            >
                                <Globe className="h-4 w-4" />
                                <span className="whitespace-nowrap">United States | English (US) | $ (USD)</span>
                            </button>

                            {/* Categories */}
                            <div className="flex items-center gap-6 overflow-x-auto">
                                {categories.slice(0, 8).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.id}`}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap relative group"
                                    >
                                        {cat.name}
                                        <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-background border-t border-border absolute left-0 right-0 h-[calc(100vh-80px)] overflow-y-auto z-40">
                        <div className="p-4 space-y-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for anything"
                                    className="w-full h-12 pl-4 pr-12 rounded-full border border-input bg-muted/10 text-base"
                                />
                                <button className="absolute right-1 top-1 h-10 w-10 bg-[#F1641E] rounded-full flex items-center justify-center text-white">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Mobile User Info */}
                            {status === "authenticated" && session?.user && (
                                <div className="p-4 bg-[#2F466C] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-medium">
                                            {getUserInitials(session.user.name)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{session.user.name}</p>
                                            <p className="text-white/70 text-sm">{session.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Links */}
                            <div className="space-y-1">
                                <div className="font-semibold px-2 py-2 text-lg">Categories</div>
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.id}`}
                                        className="flex items-center justify-between px-2 py-3 text-base text-muted-foreground border-b border-border/40 last:border-0"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {cat.name}
                                        <span className="text-xs">›</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                {status === "authenticated" ? (
                                    <>
                                        <Link
                                            href="/account/purchases"
                                            className="w-full h-12 flex items-center justify-center rounded-full border border-input font-medium hover:bg-muted/50"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            My Purchases
                                        </Link>
                                        <Link
                                            href="/account/settings"
                                            className="w-full h-12 flex items-center justify-center rounded-full border border-input font-medium hover:bg-muted/50"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Account Settings
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full h-12 flex items-center justify-center rounded-full bg-red-500 text-white font-medium hover:bg-red-600"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="w-full h-12 flex items-center justify-center rounded-full border border-input font-medium hover:bg-muted/50"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Cart & Wishlist Sidebar */}
            <CartWishlistSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={activeTab}
            />

            {/* Locale Settings Dialog */}
            <LocaleSettingsDialog
                open={isLocaleDialogOpen}
                onOpenChange={setIsLocaleDialogOpen}
            />
        </>
    )
}
