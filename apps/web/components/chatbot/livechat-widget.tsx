'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    MessageCircle, X, Send, Minimize2, Maximize2,
    Paperclip, Star, ChevronDown, Sparkles, Pencil, RefreshCw, Copy, Check, GripHorizontal,
    ArrowUp, Zap, Plus, Mic, Headphones, User,
    Bot, Headset, Book, LifeBuoy
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    startChatSession,
    sendChatMessage,
    getChatMessages,
    trackVisitor
} from '@/actions/chatbot'
import { getLivechatSettings } from '@/actions/chatbot-settings'
import { useSession } from 'next-auth/react'
import { useLiveChat } from './livechat-context'

interface LiveChatWidgetProps {
    fingerprint?: string
}

export default function LiveChatWidget({ fingerprint }: LiveChatWidgetProps) {
    const { data: session } = useSession()
    const { isOpen, openChat, closeChat } = useLiveChat()
    const [showEyeCatcher, setShowEyeCatcher] = useState(false)
    const [sessionData, setSessionData] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [settings, setSettings] = useState<any>(null)
    const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '' })

    // Derived state for showing form
    // If we have a session (logged in) OR we have a chat session active, don't show prompt
    const showForm = !session?.user && !sessionData

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // New State for Mode and File Upload
    const [chatMode, setChatMode] = useState<'AI' | 'LIVE'>('AI')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleModeSwitch = (mode: 'AI' | 'LIVE') => {
        setChatMode(mode)
        setMessages(prev => [...prev, {
            id: `sys-${Date.now()}`,
            senderType: 'SYSTEM',
            content: mode === 'LIVE' ? 'Switched to Live Agent mode. Connecting you...' : 'Switched to AI Assistant mode.',
            createdAt: new Date().toISOString()
        }])
    }

    const handleFileUpload = () => {
        fileInputRef.current?.click()
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Mock upload for now
            setMessages(prev => [...prev, {
                id: `upload-${Date.now()}`,
                senderType: 'VISITOR',
                content: `📎 Uploaded: ${file.name}`,
                createdAt: new Date().toISOString()
            }])
        }
    }

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
        // Load settings
        const loadSettings = async () => {
            const result = await getLivechatSettings()
            if (result.success) {
                setSettings(result.data)
            }
        }
        loadSettings()

        // Track visitor
        trackVisitor({
            fingerprint: visitorFingerprint,
            currentPage: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        })

        // Show eye catcher after delay
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowEyeCatcher(true)
            }
        }, settings?.eyeCatcherDelay || 3000)

        return () => clearTimeout(timer)
    }, [visitorFingerprint, isOpen, settings?.eyeCatcherDelay])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Poll for new messages
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

    const handleStartChat = useCallback(async () => {
        if (!visitorInfo.name.trim()) return

        try {
            const result = await startChatSession({
                fingerprint: visitorFingerprint,
                visitorName: visitorInfo.name,
                visitorEmail: visitorInfo.email,
                visitorAvatar: session?.user?.image || undefined,
            })

            if (result.success) {
                setSessionData(result.data)

                // Add welcome message if strictly new
                // For demo/sim, ensuring we show something
                if (result.data) {
                    setMessages([{
                        id: 'welcome',
                        senderType: 'SYSTEM',
                        content: settings?.welcomeMessage || 'Hi! How can we help you today?',
                        createdAt: new Date().toISOString(),
                    }])
                }
            }
        } catch (error) {
            console.error('Failed to start chat:', error)
        }
    }, [visitorInfo.name, visitorInfo.email, visitorFingerprint, session?.user?.image, settings?.welcomeMessage])

    // Auto-start chat if logged in and open, but only if no session exists yet
    useEffect(() => {
        const autoStart = async () => {
            if (isOpen && session?.user && !sessionData && visitorInfo.name) {
                await handleStartChat()
            }
        }
        autoStart()
    }, [isOpen, session, visitorInfo.name, sessionData, handleStartChat])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !sessionData) return

        setSending(true)
        try {
            const result = await sendChatMessage({
                sessionId: sessionData.sessionId,
                senderType: 'VISITOR',
                content: newMessage.trim(),
            })

            if (result.success) {
                setMessages(prev => [...prev, result.data])
                setNewMessage('')
                inputRef.current?.focus()
            } else {
                // Show error message
                setMessages(prev => [...prev, {
                    id: `err-${Date.now()}`,
                    senderType: 'SYSTEM',
                    content: `Error: ${result.error || 'Failed to send message'}`,
                    createdAt: new Date().toISOString()
                }])
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
        }
    }

    // Mock action buttons for demonstration
    const showActionButtons = (msgIndex: number, msgContent: string) => {
        return msgContent.includes('make the following changes')
    }

    return (
        <>
            <style jsx global>{`
                .message-group:hover .action-menu {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }
            `}</style>

            {/* Sidebar Widget */}
            <div
                className={`fixed top-4 right-4 bottom-4 w-[380px] bg-white z-50 shadow-2xl rounded-2xl border border-gray-100 flex flex-col font-sans transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isOpen
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-[120%] opacity-50 scale-95'
                    }`}
            >
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between bg-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {/* Black/Gray Gradient Avatar or just Black Circle as requested 'black/white' */}
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                            <span className="text-white font-bold text-xs">AI</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">Live Support</h3>
                            <p className="text-xs text-gray-500">Always here to help</p>
                        </div>
                    </div>

                    <button
                        onClick={closeChat}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 hover:text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    {showForm ? (
                        <div className="p-8 space-y-6 flex-1 flex flex-col justify-center animate-in fade-in duration-500">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-black mx-auto mb-4 flex items-center justify-center shadow-xl">
                                    <MessageCircle className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h3>
                                <p className="text-gray-500 text-[15px]">
                                    {settings?.welcomeMessage || 'Enter your details to start chatting.'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    placeholder="Name"
                                    value={visitorInfo.name}
                                    onChange={(e) => setVisitorInfo(prev => ({ ...prev, name: e.target.value }))}
                                    className="h-12 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black focus-visible:ring-offset-0 text-[15px]"
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={visitorInfo.email}
                                    onChange={(e) => setVisitorInfo(prev => ({ ...prev, email: e.target.value }))}
                                    className="h-12 bg-gray-50 border-gray-200 rounded-lg focus-visible:ring-black focus-visible:ring-offset-0 text-[15px]"
                                />
                                <Button
                                    className="w-full text-white h-12 rounded-lg text-[15px] font-semibold bg-black hover:bg-gray-900 shadow-md transition-all active:scale-[0.98]"
                                    disabled={!visitorInfo.name.trim()}
                                    onClick={handleStartChat}
                                >
                                    Start Chat
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-8">
                                    {/* Loading State or Empty State could go here */}
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={msg.id || idx}
                                            className={`message-group relative flex flex-col ${msg.senderType === 'VISITOR' ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className="flex items-start gap-3 max-w-[90%]">
                                                {/* Agent Avatar */}
                                                {msg.senderType !== 'VISITOR' && (
                                                    <div className="w-8 h-8 rounded-full bg-black flex-shrink-0 mt-1" />
                                                )}

                                                <div className="relative group">
                                                    <div
                                                        className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${msg.senderType === 'VISITOR'
                                                            ? 'bg-black text-white rounded-2xl rounded-br-sm'
                                                            : 'bg-white border border-gray-100 text-gray-900 rounded-2xl rounded-bl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                                            }`}
                                                    >
                                                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                                                    </div>

                                                    {/* Floating Action Menu (Only for Visitor on Hover) */}
                                                    {msg.senderType === 'VISITOR' && (
                                                        <div className="action-menu absolute -bottom-4 -left-2 bg-white border border-gray-200 text-gray-900 rounded-full py-1.5 px-3 flex items-center gap-3 shadow-xl opacity-0 translate-y-2 transition-all duration-200 z-10 scale-90">
                                                            <button className="hover:scale-110 transition-transform" title="Enhance"><Sparkles className="w-4 h-4" /></button>
                                                            <button className="hover:scale-110 transition-transform" title="Edit"><Pencil className="w-4 h-4" /></button>
                                                            <button className="hover:scale-110 transition-transform" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
                                                            <button className="hover:scale-110 transition-transform" title="Copy"><Copy className="w-4 h-4" /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Proposed Actions */}
                                            {msg.senderType !== 'VISITOR' && showActionButtons(idx, msg.content) && (
                                                <div className="flex gap-3 mt-4 ml-11 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <button className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 bg-white">
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                    <button className="px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md">
                                                        <Check className="w-4 h-4" />
                                                        Confirm
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area - Clean AI Style */}
                            <div className="p-4 bg-white border-t border-gray-50">
                                <div
                                    className="bg-black rounded-[26px] p-3 shadow-sm relative transition-all duration-200 cursor-text"
                                    onClick={() => inputRef.current?.focus()}
                                >

                                    {/* Text Input - Top */}
                                    <textarea
                                        ref={inputRef as any}
                                        placeholder={settings?.placeholderText || "Message..."}
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value)
                                            e.target.style.height = 'auto'
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }
                                        }}
                                        className="w-full max-h-[200px] min-h-[24px] bg-transparent border-0 ring-0 focus:ring-0 outline-none focus:outline-none text-[15px] text-gray-100 placeholder:text-gray-400 resize-none font-sans leading-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent px-2 mt-1 block overflow-y-auto"
                                        rows={1}
                                    />

                                    {/* Toolbar - Bottom */}
                                    <div className="flex items-center justify-between mt-3 px-1 pb-1">
                                        <div className="flex items-center gap-1.5 align-middle">
                                            {/* Attachment - Paperclip */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-gray-400 hover:bg-[#333] hover:text-white transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleFileUpload()
                                                }}
                                                title="Add attachments"
                                            >
                                                <Paperclip className="h-4 w-4 transform -rotate-45" />
                                            </Button>

                                            {/* Talk Menu (Mode Switch) */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 px-3 rounded-full text-gray-300 hover:bg-[#333] hover:text-white gap-2 font-medium text-xs transition-colors border border-transparent hover:border-[#333]">
                                                        <span className="truncate max-w-[80px]">Talk</span>
                                                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-52 p-1.5 rounded-xl shadow-2xl border-[#333] bg-[#1a1a1a] text-gray-200">
                                                    <DropdownMenuLabel className="text-[10px] text-gray-500 font-medium px-2 py-1.5 uppercase tracking-wider">Communication Mode</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        className={`cursor-pointer rounded-lg px-2 py-2.5 text-xs font-medium gap-3 focus:bg-[#333] focus:text-white mb-0.5 ${chatMode === 'AI' ? 'bg-[#333] text-white' : 'text-gray-400'}`}
                                                        onClick={() => handleModeSwitch('AI')}
                                                    >
                                                        <div className={`p-1 rounded-md ${chatMode === 'AI' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#2a2a2a] text-gray-500'}`}>
                                                            <Bot className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span>AI Assistant</span>
                                                            <span className="text-[10px] text-gray-500 font-normal">Instant automated replies</span>
                                                        </div>
                                                        {chatMode === 'AI' && <Check className="w-3.5 h-3.5 ml-auto text-blue-400" />}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className={`cursor-pointer rounded-lg px-2 py-2.5 text-xs font-medium gap-3 focus:bg-[#333] focus:text-white ${chatMode === 'LIVE' ? 'bg-[#333] text-white' : 'text-gray-400'}`}
                                                        onClick={() => handleModeSwitch('LIVE')}
                                                    >
                                                        <div className={`p-1 rounded-md ${chatMode === 'LIVE' ? 'bg-green-500/20 text-green-400' : 'bg-[#2a2a2a] text-gray-500'}`}>
                                                            <Headset className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span>Human Agent</span>
                                                            <span className="text-[10px] text-gray-500 font-normal">Talk to real support</span>
                                                        </div>
                                                        {chatMode === 'LIVE' && <Check className="w-3.5 h-3.5 ml-auto text-green-400" />}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {/* Full Guide (Context) */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 px-3 rounded-full text-gray-300 hover:bg-[#333] hover:text-white gap-2 font-medium text-xs transition-colors border border-transparent hover:border-[#333]">
                                                        <span className="truncate max-w-[100px]">Full Guide</span>
                                                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-xl shadow-2xl border-[#333] bg-[#1a1a1a] text-gray-200">
                                                    <DropdownMenuLabel className="text-[10px] text-gray-500 font-medium px-2 py-1.5 uppercase tracking-wider">Assistance Level</DropdownMenuLabel>
                                                    <DropdownMenuItem className="cursor-pointer rounded-lg px-2 py-2 text-xs font-medium gap-2 text-gray-300 focus:bg-[#333] focus:text-white mb-0.5">
                                                        <Book className="w-3.5 h-3.5 text-gray-400" />
                                                        Detailed Guide
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer rounded-lg px-2 py-2 text-xs font-medium gap-2 text-gray-300 focus:bg-[#333] focus:text-white">
                                                        <LifeBuoy className="w-3.5 h-3.5 text-gray-400" />
                                                        Quick Help
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Right Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-gray-400 hover:bg-[#333] hover:text-white transition-colors"
                                                title="Voice Input"
                                            >
                                                <Mic className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                className={`h-8 w-8 rounded-full transition-all duration-300 shadow-sm ${newMessage.trim()
                                                    ? 'bg-white text-black hover:bg-gray-200 scale-100' // White send button for Dark theme
                                                    : 'bg-[#676767] text-[#2F2F2F] scale-100'
                                                    }`}
                                                disabled={!newMessage.trim() || sending}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleSendMessage()
                                                }}
                                            >
                                                <ArrowUp className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={onFileChange}
                                    />
                                </div>

                                <div className="text-center mt-3">
                                    <p className="text-[10px] text-gray-300 font-medium tracking-wide">POWERED BY STOCK ©</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Backdrop for mobile or focus */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={closeChat}
                />
            )}
        </>
    )
}
