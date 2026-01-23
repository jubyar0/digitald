'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getLivechatStats } from '@/actions/chatbot'
import { getTicketStats } from '@/actions/tickets'
import {
    BarChart3, MessageCircle, Users, Clock, Star,
    TrendingUp, TrendingDown, Calendar, Download
} from 'lucide-react'

export default function ReportsPage() {
    const [period, setPeriod] = useState('7d')
    const [chatStats, setChatStats] = useState<any>(null)
    const [ticketStats, setTicketStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [chatResult, ticketResult] = await Promise.all([
                    getLivechatStats(),
                    getTicketStats(),
                ])

                if (chatResult.success) setChatStats(chatResult.data)
                if (ticketResult.success) setTicketStats(ticketResult.data)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const metrics = [
        {
            title: 'Total Chat Sessions',
            value: chatStats?.totalSessions || 0,
            change: '+12%',
            trend: 'up',
            icon: MessageCircle,
            color: 'text-blue-500',
        },
        {
            title: 'Average Rating',
            value: chatStats?.avgRating ? chatStats.avgRating.toFixed(1) : '—',
            change: '+0.3',
            trend: 'up',
            icon: Star,
            color: 'text-yellow-500',
        },
        {
            title: 'Open Tickets',
            value: ticketStats?.open || 0,
            change: '-5%',
            trend: 'down',
            icon: Clock,
            color: 'text-orange-500',
        },
        {
            title: 'Resolution Rate',
            value: ticketStats?.total
                ? Math.round((ticketStats.resolved / ticketStats.total) * 100) + '%'
                : '—',
            change: '+8%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-green-500',
        },
    ]

    const dailyData = [
        { day: 'Mon', chats: 45, tickets: 12 },
        { day: 'Tue', chats: 52, tickets: 15 },
        { day: 'Wed', chats: 38, tickets: 8 },
        { day: 'Thu', chats: 65, tickets: 20 },
        { day: 'Fri', chats: 58, tickets: 18 },
        { day: 'Sat', chats: 30, tickets: 5 },
        { day: 'Sun', chats: 22, tickets: 3 },
    ]

    const maxValue = Math.max(...dailyData.map(d => Math.max(d.chats, d.tickets)))

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-orange-500" />
                        Support Reports
                    </h1>
                    <p className="text-muted-foreground">
                        Analyze your support performance
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <Card key={metric.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <p className={`text-xs flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {metric.trend === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {metric.change} from last period
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity Overview</CardTitle>
                    <CardDescription>
                        Chat sessions and tickets over the past week
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {dailyData.map((day) => (
                            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 h-48 items-end">
                                    <div
                                        className="flex-1 bg-blue-500 rounded-t"
                                        style={{ height: `${(day.chats / maxValue) * 100}%` }}
                                        title={`Chats: ${day.chats}`}
                                    />
                                    <div
                                        className="flex-1 bg-orange-500 rounded-t"
                                        style={{ height: `${(day.tickets / maxValue) * 100}%` }}
                                        title={`Tickets: ${day.tickets}`}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">{day.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded" />
                            <span className="text-sm">Chat Sessions</span>
                        </div>
                        <div className="flex items-center gap.2">
                            <div className="w-3 h-3 bg-orange-500 rounded" />
                            <span className="text-sm">Support Tickets</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Chat Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            Live Chat Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Today&apos;s Sessions</span>
                            <span className="font-medium">{chatStats?.todaySessions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Currently Waiting</span>
                            <span className="font-medium">{chatStats?.waiting || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Currently Active</span>
                            <span className="font-medium">{chatStats?.active || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Online Visitors</span>
                            <span className="font-medium">{chatStats?.onlineVisitors || 0}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            Ticket Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Tickets</span>
                            <span className="font-medium">{ticketStats?.total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Open</span>
                            <span className="font-medium">{ticketStats?.open || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">In Progress</span>
                            <span className="font-medium">{ticketStats?.inProgress || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Resolved</span>
                            <span className="font-medium">{ticketStats?.resolved || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Urgent</span>
                            <span className="font-medium text-red-500">{ticketStats?.urgent || 0}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
