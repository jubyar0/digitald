'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    useLivechatSessions,
    useLivechatStats,
    useChatSession,
    useCannedResponses,
    useSendMessage,
    useAssignChat,
    useMarkAsRead,
} from '@/hooks/use-livechat'
import { toast } from 'sonner'
import {
    MessageCircle, Search, Clock, User, Send,
    Phone, Video, MoreVertical, Paperclip, Smile,
    CheckCheck, ArrowLeft, Zap, RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function LivechatDashboard() {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [newMessage, setNewMessage] = useState('')
    const [filter, setFilter] = useState<'all' | 'waiting' | 'active'>('all')
    const [search, setSearch] = useState('')
    const [showCanned, setShowCanned] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // React Query hooks - automatically handle polling with smart refetch
    const {
        data: sessions = [],
        isLoading: loading,
        refetch: refetchSessions
    } = useLivechatSessions({ filter, search, refetchInterval: 5000 })

    const { data: stats } = useLivechatStats(5000)

    const {
        data: selectedSession,
        refetch: refetchSession
    } = useChatSession(selectedSessionId)

    const { data: cannedResponses = [] } = useCannedResponses()

    const sendMessageMutation = useSendMessage()
    const assignChatMutation = useAssignChat()
    const markAsReadMutation = useMarkAsRead()

    // Get messages from selected session
    const messages = selectedSession?.messages || []

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSelectSession = (session: any) => {
        setSelectedSessionId(session.sessionId)
        // Mark messages as read
        markAsReadMutation.mutate(session.sessionId)
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedSession) return

        try {
            await sendMessageMutation.mutateAsync({
                sessionId: selectedSession.sessionId,
                senderType: 'AGENT',
                content: newMessage.trim(),
            })
            setNewMessage('')
            inputRef.current?.focus()
        } catch (error) {
            toast.error('Failed to send message')
        }
    }

    const handleAssignToMe = async () => {
        if (!selectedSession) return

        try {
            // TODO: Get current user ID from session
            await assignChatMutation.mutateAsync({
                sessionId: selectedSession.sessionId,
                agentId: 'current-admin-id'
            })
            toast.success('Chat assigned to you')
        } catch (error) {
            toast.error('Failed to assign chat')
        }
    }

    const handleUseCanned = (response: any) => {
        setNewMessage(response.content)
        setShowCanned(false)
        inputRef.current?.focus()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'WAITING': return 'bg-orange-500'
            case 'ACTIVE': return 'bg-green-500'
            case 'CLOSED': return 'bg-gray-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] container mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageCircle className="h-6 w-6 text-primary" />
                        Live Chat
                    </h1>
                    <p className="text-muted-foreground">Real-time customer support</p>
                </div>
                <div className="flex items-center gap-4">
                    {stats && (
                        <>
                            <Badge variant="outline" className="gap-1">
                                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                                {stats.waiting} Waiting
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                {stats.active} Active
                            </Badge>
                        </>
                    )}
                    <Button variant="outline" size="icon" onClick={() => refetchSessions()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Sessions List */}
                <Card className="w-80 flex-shrink-0 flex flex-col">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === 'waiting' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('waiting')}
                            >
                                Waiting
                            </Button>
                            <Button
                                variant={filter === 'active' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('active')}
                            >
                                Active
                            </Button>
                        </div>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full">
                            {loading ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    Loading...
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    No chat sessions
                                </div>
                            ) : (
                                sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => handleSelectSession(session)}
                                        className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedSession?.id === session.id ? 'bg-muted' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>
                                                        {session.visitorName?.[0] || 'V'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span
                                                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(session.status)}`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium truncate">
                                                        {session.visitorName || 'Visitor'}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {session.messages?.[0]?.content || 'New conversation'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {session.status}
                                                    </Badge>
                                                    {session._count?.messages > 0 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {session._count.messages} messages
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="flex-1 flex flex-col">
                    {selectedSession ? (
                        <>
                            {/* Chat Header */}
                            <CardHeader className="border-b py-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="lg:hidden"
                                            onClick={() => setSelectedSessionId(null)}
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <Avatar>
                                            <AvatarFallback>
                                                {selectedSession.visitorName?.[0] || 'V'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {selectedSession.visitorName || 'Visitor'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedSession.visitorEmail || selectedSession.visitor?.country || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Video className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderType === 'VISITOR' ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${msg.senderType === 'VISITOR'
                                                        ? 'bg-muted'
                                                        : msg.senderType === 'SYSTEM'
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-center w-full'
                                                            : 'bg-primary text-primary-foreground'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <div className="flex items-center justify-end gap-1 mt-1">
                                                        <span className="text-xs opacity-70">
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {msg.senderType === 'AGENT' && msg.isRead && (
                                                            <CheckCheck className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            {/* Canned Responses */}
                            {showCanned && (
                                <div className="border-t p-2 max-h-40 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-2">
                                        {cannedResponses.map((response) => (
                                            <Button
                                                key={response.id}
                                                variant="outline"
                                                size="sm"
                                                className="justify-start text-left h-auto py-2"
                                                onClick={() => handleUseCanned(response)}
                                            >
                                                <div>
                                                    <p className="font-medium text-xs">{response.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {response.content.substring(0, 50)}...
                                                    </p>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Input */}
                            <div className="border-t p-4">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowCanned(!showCanned)}
                                    >
                                        <Zap className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        ref={inputRef}
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                        className="flex-1"
                                    />
                                    <Button variant="ghost" size="icon">
                                        <Smile className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sendMessageMutation.isPending}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <CardContent className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">Select a conversation</h3>
                                <p className="text-muted-foreground">
                                    Choose a chat from the list to start responding
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Visitor Info Panel */}
                {selectedSession && (
                    <Card className="w-72 flex-shrink-0 hidden xl:block">
                        <CardHeader>
                            <CardTitle className="text-sm">Visitor Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Name</p>
                                <p className="font-medium">{selectedSession.visitorName || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-medium">{selectedSession.visitorEmail || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="font-medium">
                                    {selectedSession.visitor?.city}, {selectedSession.visitor?.country || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Page Views</p>
                                <p className="font-medium">{selectedSession.visitor?.pageViews || 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Chats</p>
                                <p className="font-medium">{selectedSession.visitor?.totalChats || 1}</p>
                            </div>

                            {/* Recent Pages */}
                            {selectedSession.visitor?.pageHistory?.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Recent Pages</p>
                                    <div className="space-y-1">
                                        {selectedSession.visitor.pageHistory.map((page: any) => (
                                            <p key={page.id} className="text-xs truncate">
                                                {page.pageUrl}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
