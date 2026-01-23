'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface ChatbotContextType {
    isOpen: boolean
    activeTab: 'chat' | 'history'
    mode: 'AI' | 'LIVE'
    openChat: () => void
    closeChat: () => void
    toggleChat: () => void
    setActiveTab: (tab: 'chat' | 'history') => void
    setMode: (mode: 'AI' | 'LIVE') => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function useChatbot() {
    const context = useContext(ChatbotContext)
    if (!context) {
        return {
            isOpen: false,
            activeTab: 'chat',
            mode: 'AI',
            openChat: () => { },
            closeChat: () => { },
            toggleChat: () => { },
            setActiveTab: () => { },
            setMode: () => { },
        }
    }
    return context
}

export function ChatbotProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat')
    const [mode, setMode] = useState<'AI' | 'LIVE'>('AI')

    const openChat = useCallback(() => setIsOpen(true), [])
    const closeChat = useCallback(() => setIsOpen(false), [])
    const toggleChat = useCallback(() => setIsOpen(prev => !prev), [])

    return (
        <ChatbotContext.Provider value={{
            isOpen,
            activeTab,
            mode,
            openChat,
            closeChat,
            toggleChat,
            setActiveTab,
            setMode
        }}>
            {children}
        </ChatbotContext.Provider>
    )
}
