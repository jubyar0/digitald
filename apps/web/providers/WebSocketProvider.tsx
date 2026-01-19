'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useWebSocket, WebSocketHookReturn } from '@/hooks/useWebSocket'

const WebSocketContext = createContext<WebSocketHookReturn | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const ws = useWebSocket()

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export function useWS() {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error('useWS must be used within WebSocketProvider')
    }
    return context
}
