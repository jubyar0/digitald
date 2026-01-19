"use client"

import { useState, useEffect } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminAppTable } from "@/components/apps/admin-app-table"
import { AppStatsCard } from "@/components/apps/app-stats-card"
import { getAllApps } from "@/actions/admin-app-actions"
import { toast } from "sonner"

export default function AdminAppsPage() {
    const [apps, setApps] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await getAllApps()
            setApps(data)
        } catch (error) {
            console.error("Failed to load apps:", error)
            toast.error("Failed to load apps")
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate stats
    const stats = {
        totalApps: apps.length,
        activeInstalls: apps.reduce((acc, app) => acc + (app._count?.installations || 0), 0),
        pendingReviews: apps.filter(app => app.status === "PENDING").length,
        totalRevenue: 0 // Mock for now
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">App Management</h2>
                <div className="flex items-center space-x-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create App
                    </Button>
                </div>
            </div>

            <AppStatsCard stats={stats} />

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <AdminAppTable apps={apps} />
                )}
            </div>
        </div>
    )
}
