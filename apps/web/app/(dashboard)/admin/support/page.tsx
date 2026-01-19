'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { TicketCard } from '@/components/tickets/ticket-card'
import { TicketFilters } from '@/components/tickets/ticket-filters'
import { getAllTickets, getTicketStats, getAdmins } from '@/actions/tickets'
import { getLivechatStats, getChatSessions } from '@/actions/livechat'
import { toast } from 'sonner'
import { TicketStatus, TicketPriority } from '@repo/database'
import Link from 'next/link'
import {
    AlertCircle, Clock, CheckCircle, XCircle, AlertTriangle,
    MessageSquare, Users, Bot, Mail, Settings, HeadphonesIcon,
    Globe, BarChart3, Zap, MessageCircle
} from 'lucide-react'

export default function AdminSupportPage() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [tickets, setTickets] = useState<any[]>([])
    const [chatSessions, setChatSessions] = useState<any[]>([])
    const [ticketStats, setTicketStats] = useState<any>(null)
    const [chatStats, setChatStats] = useState<any>(null)
    const [admins, setAdmins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState<any>({})
    const pageSize = 10

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [ticketsResult, ticketStatsResult, adminsResult, chatStatsResult] = await Promise.all([
                getAllTickets(page, pageSize, filters),
                getTicketStats(),
                getAdmins(),
                getLivechatStats(),
            ])

            if (ticketsResult.success) {
                setTickets(ticketsResult.data || [])
                setTotal(ticketsResult.total || 0)
            }

            if (ticketStatsResult.success) {
                setTicketStats(ticketStatsResult.data)
            }

            if (adminsResult.success) {
                setAdmins(adminsResult.data || [])
            }

            if (chatStatsResult.success) {
                setChatStats(chatStatsResult.data)
            }
        } catch (error) {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [page, filters])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev: any) => ({
            ...prev,
            [key]: value === 'all' ? undefined : value
        }))
        setPage(1)
    }

    const quickLinks = [
        { href: '/admin/support/livechat', icon: MessageCircle, label: 'Live Chat', color: 'text-green-500', bg: 'bg-green-500/10' },
        { href: '/admin/support/canned-responses', icon: Zap, label: 'Canned Responses', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { href: '/admin/support/visitors', icon: Users, label: 'Live Visitors', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { href: '/admin/support/email-campaign', icon: Mail, label: 'Email Campaign', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { href: '/admin/support/reports', icon: BarChart3, label: 'Reports', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { href: '/admin/support/settings', icon: Settings, label: 'Settings', color: 'text-gray-500', bg: 'bg-gray-500/10' },
    ]

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="flex items-center justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title flex items-center gap-2">
                                    <HeadphonesIcon className="h-6 w-6 text-primary" />
                                    Support Center
                                </h3>
                                <p className="dashboard-card-description">
                                    Manage live chat, tickets, and customer support
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {chatStats?.waiting > 0 && (
                                    <Badge variant="destructive" className="animate-pulse">
                                        {chatStats.waiting} Waiting
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <div className={`p-3 rounded-full ${link.bg} mb-2`}>
                                            <link.icon className={`h-5 w-5 ${link.color}`} />
                                        </div>
                                        <span className="text-sm font-medium">{link.label}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Stats Overview */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Live Chat Stats */}
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                                <MessageCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{chatStats?.active || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    {chatStats?.waiting || 0} waiting
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Online Visitors</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{chatStats?.onlineVisitors || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    {chatStats?.todaySessions || 0} chats today
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{ticketStats?.open || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    {ticketStats?.urgent || 0} urgent
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                                <CheckCircle className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {chatStats?.avgRating ? chatStats.avgRating.toFixed(1) : '—'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {ticketStats?.resolved || 0} resolved
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                            <TabsTrigger value="tickets">Tickets</TabsTrigger>
                        </TabsList>

                        <TabsContent value="dashboard" className="space-y-4 mt-4">
                            {/* Recent Activity */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Waiting Chats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MessageCircle className="h-5 w-5 text-orange-500" />
                                            Waiting for Response
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chatStats?.waiting > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">
                                                    {chatStats.waiting} visitors are waiting for support
                                                </p>
                                                <Link href="/admin/support/livechat">
                                                    <Button variant="default" size="sm" className="w-full">
                                                        Open Live Chat
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No visitors waiting
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Urgent Tickets */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                            Urgent Tickets
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {ticketStats?.urgent > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">
                                                    {ticketStats.urgent} urgent tickets require attention
                                                </p>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => {
                                                        setActiveTab('tickets')
                                                        handleFilterChange('priority', 'URGENT')
                                                    }}
                                                >
                                                    View Urgent Tickets
                                                </Button>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No urgent tickets
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Feature Modules */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Support Modules</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <Link href="/admin/support/settings/appearance">
                                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Settings className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Livechat Appearance</p>
                                                        <p className="text-xs text-muted-foreground">Customize widget look & feel</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link href="/admin/support/settings/ai">
                                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                                        <Bot className="h-5 w-5 text-purple-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">AI ChatBot</p>
                                                        <p className="text-xs text-muted-foreground">Configure AI responses</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link href="/admin/support/settings/integrations">
                                            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                                        <Globe className="h-5 w-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Social Integrations</p>
                                                        <p className="text-xs text-muted-foreground">WhatsApp, Instagram</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="tickets" className="space-y-4 mt-4">
                            {/* Ticket Stats */}
                            {ticketStats && (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{ticketStats.total}</div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Open</CardTitle>
                                            <Clock className="h-4 w-4 text-blue-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{ticketStats.open}</div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{ticketStats.inProgress}</div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{ticketStats.resolved}</div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{ticketStats.urgent}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Filters */}
                            <TicketFilters
                                onStatusChange={(value) => handleFilterChange('status', value)}
                                onPriorityChange={(value) => handleFilterChange('priority', value)}
                                onCategoryChange={(value) => handleFilterChange('category', value)}
                                onSearchChange={(value) => handleFilterChange('search', value)}
                                showAssignmentFilter={true}
                                onAssignmentChange={(value) => handleFilterChange('assignedTo', value === 'unassigned' ? null : value)}
                                admins={admins}
                            />

                            {/* Tickets List */}
                            <div className="space-y-4">
                                {loading ? (
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            Loading tickets...
                                        </CardContent>
                                    </Card>
                                ) : tickets.length === 0 ? (
                                    <Card>
                                        <CardContent className="p-6 text-center text-muted-foreground">
                                            No tickets found
                                        </CardContent>
                                    </Card>
                                ) : (
                                    tickets.map((ticket) => (
                                        <TicketCard
                                            key={ticket.id}
                                            ticket={ticket}
                                            viewPath="/admin/support"
                                            showUser={true}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {total > pageSize && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} tickets
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={page * pageSize >= total}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
