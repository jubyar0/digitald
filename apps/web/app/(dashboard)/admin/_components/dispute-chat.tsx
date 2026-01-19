'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import { ScrollArea } from '@/components/dashboard/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/dashboard/ui/avatar'
import { Send, Loader2, UserPlus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { joinDisputeConversation } from '@/actions/disputes'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    content: string
    senderId: string
    messageType: string
    createdAt: Date | string
    sender: {
        id: string
        name: string | null
        role: string
    }
}

interface DisputeChatProps {
    disputeId: string
    conversationId: string
    messages: Message[]
    isResolved: boolean
}

export function DisputeChat({ disputeId, conversationId, messages: initialMessages, isResolved }: DisputeChatProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [joining, setJoining] = useState(false)
    const [hasJoined, setHasJoined] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Check if admin has joined
    useEffect(() => {
        if (session?.user?.id) {
            const adminMessage = messages.find(
                m => m.senderId === session.user.id && m.messageType === 'SYSTEM'
            )
            setHasJoined(!!adminMessage)
        }
    }, [messages, session])

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Listen for WebSocket messages
    useEffect(() => {
        const handleWSMessage = (event: any) => {
            const data = event.detail
            if (data.type === 'new_message' && data.conversationId === conversationId) {
                setMessages(prev => [...prev, data.message])
            }
        }

        window.addEventListener('ws-message', handleWSMessage)
        return () => window.removeEventListener('ws-message', handleWSMessage)
    }, [conversationId])

    async function handleJoinConversation() {
        setJoining(true)
        try {
            const result = await joinDisputeConversation(disputeId)
            if (result.success) {
                toast.success('Joined conversation')
                setHasJoined(true)
                // Reload to get updated messages
                window.location.reload()
            } else {
                toast.error(result.error || 'Failed to join conversation')
            }
        } catch (error) {
            toast.error('Failed to join conversation')
        } finally {
            setJoining(false)
        }
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (!newMessage.trim() || !hasJoined) return

        setSending(true)
        try {
            const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    messageType: 'ADMIN'
                })
            })

            if (response.ok) {
                const message = await response.json()
                setMessages([...messages, message])
                setNewMessage('')
            } else {
                toast.error('Failed to send message')
            }
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    return (
        <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle>Conversation</CardTitle>
                    {!hasJoined && !isResolved && (
                        <Button onClick={handleJoinConversation} disabled={joining}>
                            {joining ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                            )}
                            Join Conversation
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.senderId === session?.user?.id
                                const isSystem = msg.messageType === 'SYSTEM' || msg.messageType === 'DISPUTE_UPDATE'
                                const isAdmin = msg.sender.role === 'ADMIN'

                                if (isSystem) {
                                    return (
                                        <div key={msg.id} className="flex justify-center">
                                            <div className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground">
                                                {msg.content}
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            'flex gap-3 max-w-[80%]',
                                            isMe ? 'ml-auto flex-row-reverse' : ''
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                            <AvatarFallback className={isAdmin ? 'bg-blue-500 text-white' : ''}>
                                                {msg.sender.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={cn(
                                            'rounded-2xl px-4 py-2',
                                            isMe
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : isAdmin
                                                    ? 'bg-blue-100 dark:bg-blue-900 rounded-tl-none'
                                                    : 'bg-muted rounded-tl-none'
                                        )}>
                                            {isAdmin && !isMe && (
                                                <p className="text-xs font-semibold mb-1">Admin</p>
                                            )}
                                            <p className="text-sm">{msg.content}</p>
                                            <span className="text-[10px] opacity-70 block mt-1">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </ScrollArea>

                {/* Input */}
                {!isResolved && hasJoined && (
                    <div className="p-4 border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                                className="flex-1"
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
                )}

                {!hasJoined && !isResolved && (
                    <div className="p-4 border-t bg-muted/50 text-center text-sm text-muted-foreground">
                        Join the conversation to send messages
                    </div>
                )}

                {isResolved && (
                    <div className="p-4 border-t bg-muted/50 text-center text-sm text-muted-foreground">
                        This dispute has been resolved
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
