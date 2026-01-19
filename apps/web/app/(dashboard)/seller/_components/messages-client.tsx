'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Send, Loader2, MessageCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef, useCallback } from "react"
import { getMessages, sendMessage, markMessagesAsRead } from "@/actions/messages"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Conversation {
    id: string
    customer: {
        id: string
        name: string | null
        email: string
        image?: string | null
    } | null
    lastMessage?: {
        content: string
        createdAt: Date
        senderId?: string
    }
    unreadCount?: number
}

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: Date
    read?: boolean
    isMine?: boolean
    sender: {
        id: string
        name: string | null
        image?: string | null
    }
}

interface MessagesClientProps {
    initialConversations: Conversation[]
}

export function MessagesClient({ initialConversations }: MessagesClientProps) {
    const { data: session } = useSession()
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    // Filter conversations based on search
    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery) return true
        const customerName = conv.customer?.name?.toLowerCase() || ''
        const customerEmail = conv.customer?.email?.toLowerCase() || ''
        const lastMessage = conv.lastMessage?.content?.toLowerCase() || ''
        const query = searchQuery.toLowerCase()
        return customerName.includes(query) || customerEmail.includes(query) || lastMessage.includes(query)
    })

    // Total unread count
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)

    const loadMessages = useCallback(async (id: string) => {
        setIsLoadingMessages(true)
        try {
            const data = await getMessages(id)
            setMessages(data)
            // Mark messages as read
            await markMessagesAsRead(id)
            // Update local unread count
            setConversations(prev =>
                prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c)
            )
        } catch {
            toast.error("Failed to load messages")
        } finally {
            setIsLoadingMessages(false)
        }
    }, [])

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id)
        }
    }, [selectedConversation, loadMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSelectConversation = (conv: Conversation) => {
        setSelectedConversation(conv)
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConversation || isSending) return

        setIsSending(true)
        const content = newMessage.trim()

        const tempMessage: Message = {
            id: 'temp-' + Date.now(),
            content,
            senderId: session?.user?.id || '',
            createdAt: new Date(),
            isMine: true,
            sender: {
                id: session?.user?.id || '',
                name: session?.user?.name || null,
                image: session?.user?.image || null
            }
        }

        setMessages(prev => [...prev, tempMessage])
        setNewMessage("")

        const result = await sendMessage(selectedConversation.id, content)

        if (result.success) {
            // Update with real message if returned
            if (result.message) {
                setMessages(prev =>
                    prev.map(m => m.id === tempMessage.id ? (result.message as Message) : m)
                )
            }
            // Update conversation's last message
            setConversations(prev => {
                const updated = prev.map(c =>
                    c.id === selectedConversation.id
                        ? {
                            ...c,
                            lastMessage: {
                                content,
                                createdAt: new Date(),
                                senderId: session?.user?.id
                            }
                        }
                        : c
                )
                // Sort by most recent
                return updated.sort((a, b) => {
                    const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
                    const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
                    return bTime - aTime
                })
            })
        } else {
            toast.error("Failed to send message")
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
            setNewMessage(content)
        }

        setIsSending(false)
    }

    return (
        <div className="flex flex-1 gap-4 h-full">
            {/* Sidebar - Conversation List */}
            <Card className="w-80 flex flex-col h-full">
                <CardHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Messages
                            {totalUnread > 0 && (
                                <Badge variant="destructive" className="ml-1">
                                    {totalUnread}
                                </Badge>
                            )}
                        </CardTitle>
                    </div>
                    <div className="relative mt-2">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search messages..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="flex-col">
                            {filteredConversations.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    {searchQuery ? 'No matching conversations' : 'No messages yet'}
                                </div>
                            ) : (
                                filteredConversations.filter(conv => conv.customer !== null).map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={cn(
                                            "w-full flex items-start gap-3 p-4 hover:bg-muted/50 text-left transition-colors border-b last:border-0",
                                            selectedConversation?.id === conv.id && "bg-muted",
                                            (conv.unreadCount || 0) > 0 && "bg-orange-50/50 dark:bg-orange-950/20"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={conv.customer?.image || undefined} />
                                                <AvatarFallback>{conv.customer?.name?.[0] || 'U'}</AvatarFallback>
                                            </Avatar>
                                            {(conv.unreadCount || 0) > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={cn(
                                                    "truncate",
                                                    (conv.unreadCount || 0) > 0 ? "font-semibold" : "font-medium"
                                                )}>
                                                    {conv.customer?.name || 'Customer'}
                                                </span>
                                                {conv.lastMessage && (
                                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={cn(
                                                "text-sm truncate",
                                                (conv.unreadCount || 0) > 0 ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {conv.lastMessage?.content || 'No messages yet'}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Main Content - Chat Area */}
            <Card className="flex-1 flex flex-col h-full">
                {selectedConversation && selectedConversation.customer ? (
                    <>
                        <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedConversation.customer.image || undefined} />
                                    <AvatarFallback>{selectedConversation.customer.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base">{selectedConversation.customer.name || 'Customer'}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{selectedConversation.customer.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">View Order</Button>
                        </CardHeader>

                        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 p-4">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                        <p>Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <p>No messages in this conversation yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg) => {
                                            const isMe = msg.isMine || msg.senderId === session?.user?.id
                                            return (
                                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : ''}`}>
                                                    {!isMe && (
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={msg.sender.image || undefined} />
                                                            <AvatarFallback>{msg.sender.name?.[0] || 'U'}</AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <div className={cn(
                                                        "p-3 rounded-lg max-w-[80%]",
                                                        isMe
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"
                                                    )}>
                                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                        <span className={cn(
                                                            "text-[10px] mt-1 block",
                                                            isMe ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                                                        )}>
                                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div ref={scrollRef} />
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="p-4 border-t mt-auto">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1"
                                        disabled={isSending}
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
                                        {isSending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageCircle className="h-16 w-16 mb-4 text-muted-foreground/30" />
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm">Choose from your customer messages</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
