"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstalledAppCard } from "@/components/apps/installed-app-card"
import { getInstalledApps, uninstallApp } from "@/actions/app-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function InstalledAppsPage() {
    const [installations, setInstallations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await getInstalledApps()
            setInstallations(data)
        } catch (error) {
            console.error("Failed to load installed apps:", error)
            toast.error("Failed to load installed apps")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUninstall = async (installationId: string) => {
        if (!confirm("Are you sure you want to uninstall this app? This action cannot be undone.")) return

        try {
            const result = await uninstallApp(installationId)
            if (result.success) {
                toast.success("App uninstalled successfully")
                setInstallations(prev => prev.filter(i => i.id !== installationId))
                router.refresh()
            } else {
                toast.error(result.error || "Failed to uninstall app")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        }
    }

    return (
        <div className="flex-1 w-full bg-background min-h-screen flex flex-col">
            {/* Header */}
            <div className="border-b bg-background sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <ShoppingBag className="h-6 w-6" />
                        <span>My Apps</span>
                    </div>
                    <Button asChild>
                        <Link href="/seller/app-store">
                            <Plus className="mr-2 h-4 w-4" />
                            Browse App Store
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : installations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {installations.map((installation) => (
                            <InstalledAppCard
                                key={installation.id}
                                installation={installation}
                                onUninstall={handleUninstall}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No apps installed</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven't installed any apps yet. Browse the store to find tools for your business.
                        </p>
                        <Button asChild>
                            <Link href="/seller/app-store">
                                Go to App Store
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
