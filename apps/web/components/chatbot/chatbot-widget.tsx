'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    X, Sparkles, FileText, Edit, ArrowRight,
    ThumbsUp, ThumbsDown, Plus, Send, Loader2
} from 'lucide-react'
import {
    startChatSession,
    sendChatMessage,
    getChatMessages,
    trackVisitor,
    getVisitorSessions
} from '@/actions/chatbot'
import { getLivechatSettings } from '@/actions/chatbot-settings'
import { generateAIResponse } from '@/actions/ai-chat'
import { useSession } from 'next-auth/react'
import { useChatbot } from './chatbot-context'
import { usePathname, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ChatbotWidgetProps {
    fingerprint?: string
}

export default function ChatbotWidget({ fingerprint }: ChatbotWidgetProps) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const params = useParams()
    const { isOpen, closeChat, activeTab, setActiveTab, mode, setMode } = useChatbot()
    const [sessionData, setSessionData] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [historySessions, setHistorySessions] = useState<any[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [isAIThinking, setIsAIThinking] = useState(false)
    const [settings, setSettings] = useState<any>(null)
    const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '' })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Generate fingerprint if not provided
    const visitorFingerprint = fingerprint || `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Auto-fill visitor info if logged in
    useEffect(() => {
        if (session?.user) {
            setVisitorInfo({
                name: session.user.name || '',
                email: session.user.email || '',
            })
        }
    }, [session])

    useEffect(() => {
        const loadSettings = async () => {
            const result = await getLivechatSettings()
            if (result.success) {
                setSettings(result.data)
            }
        }
        loadSettings()

        trackVisitor({
            fingerprint: visitorFingerprint,
            currentPage: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        })
    }, [visitorFingerprint])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isAIThinking])

    // Poll for new messages (only in LIVE mode or to sync state)
    useEffect(() => {
        if (!sessionData?.sessionId) return

        const poll = async () => {
            const result = await getChatMessages(sessionData.sessionId)
            if (result.success) {
                setMessages(result.data || [])
            }
        }

        const interval = setInterval(poll, 3000)
        return () => clearInterval(interval)
    }, [sessionData?.sessionId])

    // Load history when tab changes
    useEffect(() => {
        if (activeTab === 'history') {
            const loadHistory = async () => {
                setLoadingHistory(true)
                const result = await getVisitorSessions(visitorFingerprint)
                if (result.success) {
                    setHistorySessions(result.data || [])
                }
                setLoadingHistory(false)
            }
            loadHistory()
        }
    }, [activeTab, visitorFingerprint])

    const handleResumeSession = async (session: any) => {
        setSessionData(session)
        const result = await getChatMessages(session.sessionId)
        if (result.success) {
            setMessages(result.data || [])
        }
        setActiveTab('chat')
    }

    const handleStartChat = useCallback(async () => {
        try {
            const result = await startChatSession({
                fingerprint: visitorFingerprint,
                visitorName: visitorInfo.name || 'Guest',
                visitorEmail: visitorInfo.email,
                visitorAvatar: session?.user?.image || undefined,
            })

            if (result.success) {
                setSessionData(result.data)
            }
            return result.data
        } catch (error) {
            console.error('Failed to start chat:', error)
            return null
        }
    }, [visitorInfo.name, visitorInfo.email, visitorFingerprint, session?.user?.image])

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return

        let currentSession = sessionData
        if (!currentSession) {
            currentSession = await handleStartChat()
        }

        if (!currentSession) return

        const messageContent = newMessage.trim()
        setNewMessage('')

        // Optimistic UI update
        const userMessage = {
            id: `temp-${Date.now()}`,
            senderType: 'VISITOR',
            content: messageContent,
            createdAt: new Date().toISOString(),
        }
        setMessages(prev => [...prev, userMessage])

        setSending(true)

        try {
            // Save user message to DB
            const result = await sendChatMessage({
                sessionId: currentSession.sessionId,
                senderType: 'VISITOR',
                content: messageContent,
                context: {
                    currentUrl: pathname || undefined,
                    productId: params?.productId as string || undefined,
                    userId: session?.user?.id,
                }
            })

            if (!result.success) {
                setMessages(prev => [...prev, {
                    id: `err-${Date.now()}`,
                    senderType: 'SYSTEM',
                    content: `Error: ${result.error || 'Failed to send message'}`,
                    createdAt: new Date().toISOString()
                }])
                return
            }

            // Check for live support keywords
            const liveSupportKeywords = ['live support', 'human', 'agent', 'person', 'support team']
            if (liveSupportKeywords.some(keyword => messageContent.toLowerCase().includes(keyword))) {
                setMode('LIVE')
                // Add system message
                const systemMessage = {
                    id: `sys-${Date.now()}`,
                    senderType: 'SYSTEM',
                    content: "I'm connecting you with a human agent. Please wait a moment...",
                    createdAt: new Date().toISOString(),
                }
                setMessages(prev => [...prev, systemMessage])
                setSending(false)
                return
            }

            if (mode === 'AI') {
                setIsAIThinking(true)
                // AI response is now handled by the backend in sendChatMessage (synchronously)
                // Fetch messages immediately to get the response
                const messagesResult = await getChatMessages(currentSession.sessionId)
                if (messagesResult.success) {
                    setMessages(messagesResult.data || [])
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error)
            setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                senderType: 'SYSTEM',
                content: 'An unexpected error occurred. Please try again.',
                createdAt: new Date().toISOString()
            }])
        } finally {
            setSending(false)
            setIsAIThinking(false)
            inputRef.current?.focus()
        }
    }

    // If not open, render nothing
    if (!isOpen) return null

    return (
        <>
            {/* Docked Sidebar - Hostinger Kodee Style */}
            <div className="fixed top-0 right-0 bottom-0 w-[360px] bg-white dark:bg-zinc-900 z-50 border-l border-gray-200 dark:border-zinc-800 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-full">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                                activeTab === 'chat'
                                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                                activeTab === 'history'
                                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            History
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                            <Sparkles className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                            <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={closeChat}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors ml-1"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900 relative">
                    {activeTab === 'chat' ? (
                        <>
                            <ScrollArea className="flex-1 px-4 py-6">
                                <div className="space-y-6">
                                    {/* Welcome Message */}
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center mt-10 text-center space-y-4 opacity-0 animate-in fade-in duration-500">
                                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                                                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Hi, I'm AXEE!
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px]">
                                                I can help you with hosting, domains, and website setup.
                                            </p>
                                        </div>
                                    )}

                                    {messages.map((msg, idx) => (
                                        <div
                                            key={msg.id || idx}
                                            className={`flex flex-col ${msg.senderType === 'VISITOR' ? 'items-end' : 'items-start'}`}
                                        >
                                            {/* Bot Label */}
                                            {msg.senderType !== 'VISITOR' && (
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-xs font-bold text-gray-900 dark:text-white">AXEE</span>
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div
                                                className={cn(
                                                    "max-w-[90%] px-4 py-3 text-sm leading-relaxed shadow-sm",
                                                    msg.senderType === 'VISITOR'
                                                        ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-2xl rounded-tr-sm"
                                                        : "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-tl-sm"
                                                )}
                                            >
                                                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                                            </div>

                                            {/* Feedback Buttons (Bot only) */}
                                            {msg.senderType !== 'VISITOR' && (
                                                <div className="flex items-center gap-2 mt-2 ml-1">
                                                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                                        <ThumbsUp className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                                        <ThumbsDown className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* AI Thinking State */}
                                    {isAIThinking && (
                                        <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Analyzing your request...</span>
                                            </div>
                                            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-zinc-900">
                                <div className="relative border border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                                    <textarea
                                        ref={inputRef as any}
                                        placeholder="Ask AXEE anything..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }
                                        }}
                                        className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[50px] max-h-[120px] resize-none py-3 px-4"
                                        rows={1}
                                    />

                                    <div className="flex items-center justify-between px-2 pb-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                                            <Plus className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || sending || isAIThinking}
                                            className={cn(
                                                "p-2 rounded-full transition-all duration-200",
                                                newMessage.trim()
                                                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                            )}
                                        >
                                            {sending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <ArrowRight className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="text-center mt-2">
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                        AXEE can make mistakes. Double-check replies.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        // History Tab
                        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-900/50">
                            {
                                loadingHistory ? (
                                    <div className="flex-1 flex items-center justify-center" >
                                        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                                    </div>
                                ) : historySessions.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                            <FileText className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                            No chat history
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Your past conversations will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="flex-1">
                                        <div className="p-4 space-y-3">
                                            {historySessions.map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => handleResumeSession(session)}
                                                    className="w-full text-left bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 hover:border-purple-500 dark:hover:border-purple-500 transition-all group shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                                                            {new Date(session.startedAt).toLocaleDateString()}
                                                        </span>
                                                        <span className={cn(
                                                            "text-xs font-bold",
                                                            session.status === 'CLOSED' ? "text-gray-400" : "text-green-500"
                                                        )}>
                                                            {session.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-1 mb-1">
                                                        {session.messages[0]?.content || 'No messages'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        ID: {session.sessionId.substring(0, 8)}...
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                        </div>
                    )}
                </div >
            </div >
        </>
    )
}
