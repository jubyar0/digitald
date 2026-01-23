'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getLiveVisitors, startChatSession } from '@/actions/chatbot'
import {
    Users, Globe, Monitor, Clock, Eye, MessageCircle, RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function LiveVisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchVisitors = async () => {
        try {
            const result = await getLiveVisitors(1, 50)
            if (result.success) {
                setVisitors(result.data || [])
                setTotal(result.total || 0)
            }
        } catch (error) {
            console.error('Error fetching visitors:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVisitors()
        // Poll every 10 seconds
        const interval = setInterval(fetchVisitors, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6 text-blue-500" />
                        Live Visitors
                    </h1>
                    <p className="text-muted-foreground">
                        See who's browsing your website right now
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        {total} Online
                    </Badge>
                    <Button variant="outline" size="icon" onClick={fetchVisitors}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Visitors Grid */}
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : visitors.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No visitors online right now</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {visitors.map((visitor) => (
                        <Card key={visitor.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                                {visitor.name?.[0]?.toUpperCase() || 'V'}
                                            </div>
                                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">
                                                {visitor.name || 'Anonymous Visitor'}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {visitor.email || 'No email provided'}
                                            </p>
                                        </div>
                                    </div>
                                    {visitor.sessions?.length > 0 && (
                                        <Badge variant="outline" className="text-green-600">
                                            In Chat
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Location */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {visitor.city && visitor.country
                                            ? `${visitor.city}, ${visitor.country}`
                                            : visitor.country || 'Unknown location'}
                                    </span>
                                </div>

                                {/* Current Page */}
                                {visitor.currentPage && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{visitor.currentPage}</span>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Monitor className="h-4 w-4 text-muted-foreground" />
                                        <span>{visitor.pageViews} pages</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                        <span>{visitor.totalChats} chats</span>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        Last active {formatDistanceToNow(new Date(visitor.lastVisit), { addSuffix: true })}
                                    </span>
                                </div>

                                {/* Recent Pages */}
                                {visitor.pageHistory?.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs font-medium mb-2">Recent Pages:</p>
                                        <div className="space-y-1">
                                            {visitor.pageHistory.slice(0, 3).map((page: any) => (
                                                <p key={page.id} className="text-xs text-muted-foreground truncate">
                                                    {page.pageUrl}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-2">
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        variant="outline"
                                        onClick={async () => {
                                            const result = await startChatSession({
                                                fingerprint: visitor.fingerprint,
                                                visitorName: visitor.name || 'Visitor',
                                                visitorEmail: visitor.email,
                                                initialMessage: 'Hello! How can I help you?'
                                            })
                                            if (result.success) {
                                                window.location.href = `/admin/support/livechat`
                                            }
                                        }}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Start Chat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
