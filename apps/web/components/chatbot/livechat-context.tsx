'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LiveChatContextType {
    isOpen: boolean
    openChat: () => void
    closeChat: () => void
    toggleChat: () => void
}

const LiveChatContext = createContext<LiveChatContextType | undefined>(undefined)

export function LiveChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    const openChat = () => setIsOpen(true)
    const closeChat = () => setIsOpen(false)
    const toggleChat = () => setIsOpen(prev => !prev)

    return (
        <LiveChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
            {children}
        </LiveChatContext.Provider>
    )
}

export function useLiveChat() {
    const context = useContext(LiveChatContext)
    if (context === undefined) {
        throw new Error('useLiveChat must be used within a LiveChatProvider')
    }
    return context
}
