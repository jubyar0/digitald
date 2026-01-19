'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface WSMessage {
    type: 'message' | 'typing' | 'read' | 'join' | 'leave'
    conversationId: string
    userId: string
    data?: any
}

export interface WebSocketHookReturn {
    isConnected: boolean
    sendMessage: (message: WSMessage) => void
    joinConversation: (conversationId: string, userId: string) => void
    leaveConversation: (conversationId: string, userId: string) => void
    sendTyping: (conversationId: string, userId: string, isTyping: boolean) => void
    markAsRead: (conversationId: string, userId: string, messageId: string) => void
}

export function useWebSocket(url: string = 'ws://localhost:3001/ws'): WebSocketHookReturn {
    const ws = useRef<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const reconnectTimeout = useRef<NodeJS.Timeout>()
    const messageQueue = useRef<WSMessage[]>([])

    const connect = useCallback(() => {
        try {
            ws.current = new WebSocket(url)

            ws.current.onopen = () => {
                console.log('WebSocket connected')
                setIsConnected(true)

                // Send queued messages
                while (messageQueue.current.length > 0) {
                    const message = messageQueue.current.shift()
                    if (message && ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify(message))
                    }
                }
            }

            ws.current.onclose = () => {
                console.log('WebSocket disconnected')
                setIsConnected(false)

                // Attempt to reconnect after 3 seconds
                reconnectTimeout.current = setTimeout(() => {
                    console.log('Attempting to reconnect...')
                    connect()
                }, 3000)
            }

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error)
            }

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    // Dispatch custom event for components to listen to
                    window.dispatchEvent(new CustomEvent('ws-message', { detail: data }))
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error)
                }
            }
        } catch (error) {
            console.error('Error connecting to WebSocket:', error)
        }
    }, [url])

    useEffect(() => {
        connect()

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current)
            }
            if (ws.current) {
                ws.current.close()
            }
        }
    }, [connect])

    const sendMessage = useCallback((message: WSMessage) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message))
        } else {
            // Queue message if not connected
            messageQueue.current.push(message)
        }
    }, [])

    const joinConversation = useCallback((conversationId: string, userId: string) => {
        sendMessage({
            type: 'join',
            conversationId,
            userId
        })
    }, [sendMessage])

    const leaveConversation = useCallback((conversationId: string, userId: string) => {
        sendMessage({
            type: 'leave',
            conversationId,
            userId
        })
    }, [sendMessage])

    const sendTyping = useCallback((conversationId: string, userId: string, isTyping: boolean) => {
        sendMessage({
            type: 'typing',
            conversationId,
            userId,
            data: { isTyping }
        })
    }, [sendMessage])

    const markAsRead = useCallback((conversationId: string, userId: string, messageId: string) => {
        sendMessage({
            type: 'read',
            conversationId,
            userId,
            data: { messageId }
        })
    }, [sendMessage])

    return {
        isConnected,
        sendMessage,
        joinConversation,
        leaveConversation,
        sendTyping,
        markAsRead
    }
}
