'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid3X3, List, Maximize2, Activity } from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import dynamic from 'next/dynamic'

// Dynamically import the Globe component to avoid SSR issues
const Globe3D = dynamic(() => import('./globe-3d'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
    )
})

// Sample data for mini chart
const sessionsData = [
    { time: '1', value: 2 },
    { time: '2', value: 5 },
    { time: '3', value: 3 },
    { time: '4', value: 8 },
    { time: '5', value: 4 },
    { time: '6', value: 6 },
]

export default function LiveViewPage() {
    const [lastUpdated, setLastUpdated] = useState('Just now')
    const [visitorsNow, setVisitorsNow] = useState(0)
    const [totalSales, setTotalSales] = useState(0)
    const [sessions, setSessions] = useState(0)
    const [orders, setOrders] = useState(0)
    const [activeCarts, setActiveCarts] = useState(0)
    const [checkingOut, setCheckingOut] = useState(0)
    const [purchased, setPurchased] = useState(0)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated('Just now')
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Panel */}
            <div className="w-80 border-r flex flex-col overflow-auto shrink-0">
                {/* Header */}
                <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        <h1 className="text-lg font-semibold">Live View</h1>
                        <div className="flex items-center gap-1.5 ml-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">{lastUpdated}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4 space-y-4">
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="shadow-none border">
                            <CardContent className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Visitors right now</p>
                                <p className="text-2xl font-bold">{visitorsNow}</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none border">
                            <CardContent className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Total sales</p>
                                <p className="text-lg font-bold">DZD {totalSales} —</p>
                                <p className="text-xs text-muted-foreground">—</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Card className="shadow-none border">
                            <CardContent className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Sessions</p>
                                <p className="text-lg font-bold">{sessions} —</p>
                                <div className="h-8 mt-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={sessionsData}>
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3b82f6"
                                                fill="#3b82f6"
                                                fillOpacity={0.2}
                                                strokeWidth={1.5}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none border">
                            <CardContent className="p-3">
                                <p className="text-xs text-muted-foreground mb-1">Orders</p>
                                <p className="text-lg font-bold">{orders} —</p>
                                <p className="text-xs text-muted-foreground">—</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer Behavior */}
                    <Card className="shadow-none border">
                        <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-sm font-medium">Customer behavior</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-muted-foreground">Active carts</p>
                                    <p className="text-lg font-bold">{activeCarts}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Checking out</p>
                                    <p className="text-lg font-bold text-blue-600">{checkingOut}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Purchased</p>
                                    <p className="text-lg font-bold">{purchased}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sessions by Location */}
                    <Card className="shadow-none border">
                        <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-sm font-medium">Sessions by location</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <p className="text-xs text-muted-foreground mb-2">United States - Iowa - Council Bluffs</p>
                            <div className="bg-cyan-400 h-16 rounded-sm relative">
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-sm font-medium">1</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* New vs Returning */}
                    <Card className="shadow-none border">
                        <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-sm font-medium">New vs returning customers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="h-16 flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">No data for this date range</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Sales by Product */}
                    <Card className="shadow-none border">
                        <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-sm font-medium">Total sales by product</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="h-16 flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">No data for this date range</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Panel - 3D Globe */}
            <div className="flex-1 relative bg-slate-50 dark:bg-zinc-900 overflow-hidden">
                {/* Top Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search location"
                            className="pl-9 w-48 h-9 bg-background/80 backdrop-blur-sm"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-background/80 backdrop-blur-sm">
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-background/80 backdrop-blur-sm">
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-background/80 backdrop-blur-sm">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* 3D Globe */}
                <div className="absolute inset-0">
                    <Globe3D />
                </div>

                {/* Bottom Legend */}
                <div className="absolute bottom-4 right-4 flex items-center gap-4 z-10">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-muted-foreground">Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-cyan-400" />
                        <span className="text-sm text-muted-foreground">Visitors right now</span>
                    </div>
                </div>

                {/* Zoom indicator */}
                <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                    +
                </div>
            </div>
        </div>
    )
}
