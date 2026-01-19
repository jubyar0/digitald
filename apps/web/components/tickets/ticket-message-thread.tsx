'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Message {
    id: string
    content: string
    createdAt: Date
    isInternal: boolean
    user: {
        id: string
        name: string | null
        email: string
        role: string
        image: string | null
    }
}

interface TicketMessageThreadProps {
    messages: Message[]
    currentUserId: string
    isAdmin?: boolean
}

export function TicketMessageThread({ messages, currentUserId, isAdmin = false }: TicketMessageThreadProps) {
    if (!messages || messages.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No messages yet
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {(messages || []).map((message) => {
                const isOwnMessage = message.user.id === currentUserId
                const userInitials = message.user.name
                    ? message.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : message.user.email[0].toUpperCase()

                return (
                    <Card
                        key={message.id}
                        className={message.isInternal ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' : ''}
                    >
                        <CardContent className="p-4">
                            <div className="flex gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={message.user.image || undefined} />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold">
                                            {message.user.name || message.user.email}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {message.user.role}
                                        </Badge>
                                        {message.isInternal && (
                                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                                                Internal Note
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
