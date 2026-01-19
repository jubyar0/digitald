"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
    Search,
    ShoppingBag,
    Loader2,
    ChevronRight,
    CreditCard,
    Wallet,
    Bitcoin,
    Clock,
    Globe,
    Truck,
    BarChart,
    Mail,
    Zap
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AppCard } from "@/components/apps/app-card"
import { InstallModal } from "@/components/apps/install-modal"
import { getAvailableApps, installApp, getInstalledApps } from "@/actions/app-actions"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

// Category definitions with icons
const categories = [
    { id: 'payments', name: 'Payments', icon: CreditCard, description: 'Accept payments from customers worldwide' },
    { id: 'shipping', name: 'Shipping & Delivery', icon: Truck, description: 'Manage shipping and fulfillment' },
    { id: 'marketing', name: 'Marketing', icon: Mail, description: 'Grow your audience and sales' },
    { id: 'analytics', name: 'Analytics', icon: BarChart, description: 'Track and analyze your business' },
]

// App category section component
function AppCategorySection({
    title,
    description,
    apps,
    installedApps,
    showAll = false
}: {
    title: string
    description?: string
    apps: any[]
    installedApps: Set<string>
    showAll?: boolean
}) {
    const displayApps = showAll ? apps : apps.slice(0, 4)

    if (apps.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {apps.length > 4 && !showAll && (
                    <Button variant="ghost" size="sm" className="text-sm gap-1">
                        View all <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Horizontal grid layout like Shopify */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-muted/30 rounded-xl border p-1">
                {displayApps.map((app) => (
                    <AppCard
                        key={app.id}
                        app={app}
                        isInstalled={installedApps.has(app.id)}
                        variant="compact"
                    />
                ))}
            </div>
        </div>
    )
}

export default function AppStorePage() {
    const [apps, setApps] = useState<any[]>([])
    const [installedApps, setInstalledApps] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedApp, setSelectedApp] = useState<any | null>(null)
    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryFilter = searchParams.get('category')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [availableApps, installed] = await Promise.all([
                getAvailableApps(),
                getInstalledApps()
            ])
            setApps(availableApps)
            setInstalledApps(new Set(installed.map((i: any) => i.appId)))
        } catch (error) {
            console.error("Failed to load apps:", error)
            toast.error("Failed to load apps")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInstallClick = (appId: string) => {
        const app = apps.find(a => a.id === appId)
        if (app) {
            setSelectedApp(app)
            setIsInstallModalOpen(true)
        }
    }

    const handleConfirmInstall = async () => {
        if (!selectedApp) return

        try {
            const result = await installApp(selectedApp.id)

            if (result.success) {
                toast.success(`${selectedApp.name} installed successfully`)
                setInstalledApps(prev => new Set(prev).add(selectedApp.id))
                setIsInstallModalOpen(false)
                router.refresh()
            } else {
                toast.error((result as any).error || "Failed to install app")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        }
    }

    // Filter and group apps
    const { filteredApps, groupedApps, paymentApps } = useMemo(() => {
        let filtered = apps

        // Apply search filter
        if (searchQuery) {
            filtered = apps.filter(app =>
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply category filter from URL
        if (categoryFilter) {
            filtered = filtered.filter(app => app.category === categoryFilter)
        }

        // Group apps by category
        const grouped = filtered.reduce((acc, app) => {
            const category = app.category || 'other'
            if (!acc[category]) acc[category] = []
            acc[category].push(app)
            return acc
        }, {} as Record<string, any[]>)

        return {
            filteredApps: filtered,
            groupedApps: grouped,
            paymentApps: grouped['payments'] || []
        }
    }, [apps, searchQuery, categoryFilter]) as { filteredApps: any[], groupedApps: Record<string, any[]>, paymentApps: any[] }

    return (
        <div className="flex-1 w-full bg-background min-h-screen flex flex-col">
            {/* Header / Search Section */}
            <div className="border-b bg-background sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <ShoppingBag className="h-6 w-6" />
                        <span>App Store</span>
                    </div>
                    <div className="flex-1 max-w-2xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search apps..."
                            className="pl-10 bg-muted/50 border-none w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <Link href="/seller/apps" className="hover:text-primary">My Apps</Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1">
                {/* Category Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href="/seller/app-store"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryFilter
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        All Apps
                    </Link>
                    {categories.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/seller/app-store?category=${cat.id}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${categoryFilter === cat.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            <cat.icon className="h-4 w-4" />
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredApps.length > 0 ? (
                    <>
                        {/* Show all apps in category if filtered */}
                        {categoryFilter ? (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    {categories.find(c => c.id === categoryFilter)?.name || 'Apps'}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        ({filteredApps.length} apps)
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-muted/30 rounded-xl border p-1">
                                    {(filteredApps as any[]).map((app) => (
                                        <AppCard
                                            key={app.id}
                                            app={app}
                                            isInstalled={installedApps.has(app.id)}
                                            variant="compact"
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Popular apps */}
                                {apps.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-orange-500" />
                                            <h2 className="text-lg font-semibold">Popular with stores like yours</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-muted/30 rounded-xl border p-1">
                                            {apps.slice(0, 4).map((app) => (
                                                <AppCard
                                                    key={app.id}
                                                    app={app}
                                                    isInstalled={installedApps.has(app.id)}
                                                    variant="compact"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Payments Section */}
                                {paymentApps.length > 0 && (
                                    <AppCategorySection
                                        title="Payments"
                                        description="Accept payments through cards, wallets, crypto, and more"
                                        apps={paymentApps}
                                        installedApps={installedApps}
                                    />
                                )}

                                {/* Other categories */}
                                {Object.entries(groupedApps)
                                    .filter(([cat]) => cat !== 'payments')
                                    .map(([category, categoryApps]) => (
                                        <AppCategorySection
                                            key={category}
                                            title={categories.find(c => c.id === category)?.name || category}
                                            apps={categoryApps}
                                            installedApps={installedApps}
                                        />
                                    ))
                                }
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No apps found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search or check back later for new apps.
                        </p>
                    </div>
                )}

                {/* Footer CTA */}
                <div className="text-center py-12 space-y-6 border-t">
                    <h2 className="text-2xl font-bold">Need a custom solution?</h2>
                    <Button variant="link" className="text-blue-600 text-lg">
                        Contact Developer Support
                    </Button>
                </div>
            </div>

            <InstallModal
                isOpen={isInstallModalOpen}
                onClose={() => setIsInstallModalOpen(false)}
                onConfirm={handleConfirmInstall}
                app={selectedApp}
            />
        </div >
    )
}
