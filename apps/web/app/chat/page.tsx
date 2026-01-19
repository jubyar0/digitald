'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader2, MessageCircle, MoreVertical, Phone, Video } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { JobOfferMessage } from '@/components/chat/job-offer-message'
import { HireButton } from '@/components/chat/hire-button'

interface User {
    id: string
    name: string
    image?: string
}

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: string
    readAt?: string | null
    messageType?: 'USER' | 'SYSTEM' | 'JOB_OFFER' | 'DISPUTE_UPDATE' | 'ADMIN'
    metadata?: any
    sender: {
        name: string
        image?: string
    }
}

interface Conversation {
    id: string
    participants: User[]
    vendorId?: string
    vendor?: {
        id: string
        name: string
    }
    lastMessage?: {
        content: string
        createdAt: string
        senderId: string
    }
    updatedAt: string
    unreadCount: number
}

function ChatContent() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const router = useRouter()
    const sellerId = searchParams.get('sellerId')

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [sending, setSending] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)
    const pollingInterval = useRef<NodeJS.Timeout | null>(null)

    // Initial load
    useEffect(() => {
        if (session) {
            fetchConversations()
        }
    }, [session])

    // Handle sellerId param (start new chat)
    useEffect(() => {
        if (sellerId && session) {
            startConversation(sellerId)
        }
    }, [sellerId, session])

    // Poll for messages when conversation is active
    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation.id)

            // Poll every 5 seconds
            pollingInterval.current = setInterval(() => {
                fetchMessages(activeConversation.id, true) // silent update
            }, 5000)
        }

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current)
            }
        }
    }, [activeConversation])

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    async function fetchConversations() {
        try {
            const response = await fetch('/api/chat/conversations')
            if (response.ok) {
                const data = await response.json()
                setConversations(data)
            }
        } catch (error) {
            console.error('Error fetching conversations:', error)
        } finally {
            setLoading(false)
        }
    }

    async function startConversation(participantId: string) {
        try {
            const response = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId })
            })

            if (response.ok) {
                const conversation = await response.json()
                // Update list if new
                if (!conversations.find(c => c.id === conversation.id)) {
                    setConversations([conversation, ...conversations])
                }
                setActiveConversation(conversation)
                // Remove param from URL
                router.replace('/chat')
            }
        } catch (error) {
            console.error('Error starting conversation:', error)
            toast.error('Failed to start conversation')
        }
    }

    async function fetchMessages(conversationId: string, silent = false) {
        if (!silent) setLoadingMessages(true)
        try {
            const response = await fetch(`/api/chat/conversations/${conversationId}`)
            if (response.ok) {
                const data = await response.json()
                setMessages(data)

                // Mark last message as read if it's from the other person
                const lastMsg = data[data.length - 1]
                if (lastMsg && lastMsg.senderId !== session?.user?.id && !lastMsg.readAt) {
                    markAsRead(lastMsg.id)
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            if (!silent) setLoadingMessages(false)
        }
    }

    async function markAsRead(messageId: string) {
        try {
            await fetch(`/api/chat/messages/${messageId}/read`, {
                method: 'PUT'
            })
        } catch (error) {
            console.error('Error marking message as read:', error)
        }
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (!newMessage.trim() || !activeConversation) return

        setSending(true)
        try {
            const response = await fetch(`/api/chat/conversations/${activeConversation.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage })
            })

            if (response.ok) {
                const message = await response.json()
                setMessages([...messages, message])
                setNewMessage('')

                // Update conversation list last message
                setConversations(conversations.map(c =>
                    c.id === activeConversation.id
                        ? { ...c, lastMessage: { content: message.content, createdAt: message.createdAt, senderId: message.senderId }, updatedAt: message.createdAt }
                        : c
                ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
            }
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants.find(p => p.id !== session?.user?.id) || conversation.participants[0]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background">
            {/* Sidebar - Conversation List */}
            <div className={cn(
                "w-full md:w-80 border-r flex flex-col bg-card",
                activeConversation ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b">
                    <h2 className="font-bold text-xl">Messages</h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map(conversation => {
                                const otherUser = getOtherParticipant(conversation)
                                const isActive = activeConversation?.id === conversation.id
                                return (
                                    <button
                                        key={conversation.id}
                                        onClick={() => setActiveConversation(conversation)}
                                        className={cn(
                                            "flex items-start gap-3 p-4 text-left hover:bg-accent/50 transition-colors border-b last:border-0",
                                            isActive && "bg-accent"
                                        )}
                                    >
                                        <Avatar>
                                            <AvatarImage src={otherUser?.image} />
                                            <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="font-semibold truncate">{otherUser?.name}</span>
                                                {conversation.lastMessage && (
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                        {new Date(conversation.updatedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={cn(
                                                "text-sm truncate",
                                                conversation.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                                            )}>
                                                {conversation.lastMessage?.senderId === session?.user?.id && "You: "}
                                                {conversation.lastMessage?.content || "Start a conversation"}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-background",
                !activeConversation ? "hidden md:flex" : "flex"
            )}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden -ml-2"
                                    onClick={() => setActiveConversation(null)}
                                >
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={getOtherParticipant(activeConversation)?.image} />
                                    <AvatarFallback>{getOtherParticipant(activeConversation)?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold">{getOtherParticipant(activeConversation)?.name}</h3>
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {activeConversation.vendorId && (
                                    <HireButton
                                        conversationId={activeConversation.id}
                                        vendorId={activeConversation.vendorId}
                                        vendorName={activeConversation.vendor?.name || 'Vendor'}
                                    />
                                )}
                                <Button variant="ghost" size="icon">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {loadingMessages ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                    <MessageCircle className="h-16 w-16 mb-4" />
                                    <p>No messages yet. Say hello!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.senderId === session?.user?.id
                                    const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId)

                                    // Handle job offer messages
                                    if (msg.messageType === 'JOB_OFFER' && msg.metadata) {
                                        const isVendor = activeConversation.vendorId &&
                                            activeConversation.participants.some(p =>
                                                p.id === session?.user?.id &&
                                                activeConversation.vendorId === activeConversation.vendor?.id
                                            )

                                        return (
                                            <div key={msg.id} className={cn(
                                                "flex justify-center",
                                                isMe && "justify-end"
                                            )}>
                                                <JobOfferMessage
                                                    jobOfferId={msg.metadata.jobOfferId}
                                                    title={msg.metadata.title}
                                                    description={msg.metadata.description || msg.content}
                                                    budget={msg.metadata.budget}
                                                    currency={msg.metadata.currency || 'USD'}
                                                    status={msg.metadata.status || 'PENDING'}
                                                    isVendor={!!isVendor}
                                                    createdAt={msg.createdAt}
                                                />
                                            </div>
                                        )
                                    }

                                    // Handle system messages
                                    if (msg.messageType === 'SYSTEM') {
                                        return (
                                            <div key={msg.id} className="flex justify-center">
                                                <div className="bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        )
                                    }

                                    // Regular user messages
                                    return (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex gap-3 max-w-[80%]",
                                                isMe ? "ml-auto flex-row-reverse" : ""
                                            )}
                                        >
                                            {!isMe && (
                                                <div className="w-8 flex-shrink-0">
                                                    {showAvatar && (
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={msg.sender.image} />
                                                            <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                </div>
                                            )}
                                            <div className={cn(
                                                "rounded-2xl px-4 py-2 text-sm",
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted rounded-tl-none"
                                            )}>
                                                <p>{msg.content}</p>
                                                <span className={cn(
                                                    "text-[10px] opacity-70 block mt-1",
                                                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                                                )}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMe && msg.readAt && " • Read"}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-background">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1"
                                    disabled={sending}
                                />
                                <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                                    {sending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <div className="bg-accent/50 p-6 rounded-full mb-4">
                            <MessageCircle className="h-12 w-12" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                        <p>Choose a chat from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ChatContent />
        </Suspense>
    )
}
