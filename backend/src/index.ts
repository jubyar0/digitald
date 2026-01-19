import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

// Types for WebSocket events
export interface WSMessage {
    type: 'message' | 'typing' | 'read' | 'join' | 'leave'
    conversationId: string
    userId: string
    data?: any
}

export interface ConnectedClient {
    userId: string
    conversationIds: Set<string>
}

// Store connected clients
const clients = new Map<any, ConnectedClient>()
const conversationRooms = new Map<string, Set<any>>()

// Helper to broadcast to conversation room
function broadcastToConversation(conversationId: string, message: any, excludeWs?: any) {
    const room = conversationRooms.get(conversationId)
    if (!room) return

    room.forEach(ws => {
        if (ws !== excludeWs && ws.readyState === 1) { // OPEN state
            ws.send(JSON.stringify(message))
        }
    })
}

// Helper to join conversation room
function joinConversation(ws: any, conversationId: string, userId: string) {
    if (!conversationRooms.has(conversationId)) {
        conversationRooms.set(conversationId, new Set())
    }
    conversationRooms.get(conversationId)!.add(ws)

    const client = clients.get(ws)
    if (client) {
        client.conversationIds.add(conversationId)
    }

    // Notify others in the room
    broadcastToConversation(conversationId, {
        type: 'user_joined',
        userId,
        conversationId,
        timestamp: new Date().toISOString()
    }, ws)
}

// Helper to leave conversation room
function leaveConversation(ws: any, conversationId: string, userId: string) {
    const room = conversationRooms.get(conversationId)
    if (room) {
        room.delete(ws)
        if (room.size === 0) {
            conversationRooms.delete(conversationId)
        }
    }

    const client = clients.get(ws)
    if (client) {
        client.conversationIds.delete(conversationId)
    }

    // Notify others in the room
    broadcastToConversation(conversationId, {
        type: 'user_left',
        userId,
        conversationId,
        timestamp: new Date().toISOString()
    })
}

const app = new Elysia()
    .use(cors())
    .ws('/ws', {
        open(ws) {
            console.log('WebSocket connection opened')
            clients.set(ws, {
                userId: '',
                conversationIds: new Set()
            })
        },

        message(ws, message: any) {
            try {
                const data: WSMessage = typeof message === 'string' ? JSON.parse(message) : message
                const client = clients.get(ws)

                if (!client) return

                // Set userId on first message
                if (!client.userId && data.userId) {
                    client.userId = data.userId
                }

                switch (data.type) {
                    case 'join':
                        // Join a conversation room
                        joinConversation(ws, data.conversationId, data.userId)
                        ws.send(JSON.stringify({
                            type: 'joined',
                            conversationId: data.conversationId,
                            timestamp: new Date().toISOString()
                        }))
                        break

                    case 'leave':
                        // Leave a conversation room
                        leaveConversation(ws, data.conversationId, data.userId)
                        break

                    case 'message':
                        // Broadcast new message to conversation
                        broadcastToConversation(data.conversationId, {
                            type: 'new_message',
                            conversationId: data.conversationId,
                            message: data.data,
                            timestamp: new Date().toISOString()
                        })
                        break

                    case 'typing':
                        // Broadcast typing indicator
                        broadcastToConversation(data.conversationId, {
                            type: 'typing',
                            conversationId: data.conversationId,
                            userId: data.userId,
                            isTyping: data.data?.isTyping || false,
                            timestamp: new Date().toISOString()
                        }, ws)
                        break

                    case 'read':
                        // Broadcast read status
                        broadcastToConversation(data.conversationId, {
                            type: 'message_read',
                            conversationId: data.conversationId,
                            messageId: data.data?.messageId,
                            userId: data.userId,
                            timestamp: new Date().toISOString()
                        }, ws)
                        break

                    default:
                        console.log('Unknown message type:', data.type)
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error)
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to process message'
                }))
            }
        },

        close(ws) {
            const client = clients.get(ws)
            if (client) {
                // Leave all conversation rooms
                client.conversationIds.forEach(conversationId => {
                    leaveConversation(ws, conversationId, client.userId)
                })
                clients.delete(ws)
            }
            console.log('WebSocket connection closed')
        },

        error(ws, error) {
            console.error('WebSocket error:', error)
        }
    })
    .get('/', () => 'WebSocket Server Running')
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
    .listen(3001)

console.log(`🦊 WebSocket server is running at ws://localhost:${app.server?.port}`)
