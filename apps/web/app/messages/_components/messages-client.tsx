'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
    Search,
    Trash2,
    ChevronDown,
    Inbox,
    Star,
    Users,
    Send,
    Mail,
    AlertCircle,
    Loader2,
    ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { getMessages, sendMessage, markMessagesAsRead, searchVendorsForChat, createConversationWithVendor } from '@/actions/messages'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Sidebar categories
const sidebarCategories = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'from-shops', label: 'From shops', icon: Users },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'all', label: 'All', icon: Mail },
    { id: 'unread', label: 'Unread', icon: Mail },
    { id: 'spam', label: 'Spam', icon: AlertCircle },
    { id: 'trash', label: 'Trash', icon: Trash2 },
]

interface Vendor {
    id: string
    name: string
    avatar: string | null
    user: {
        id: string
        name: string | null
        email: string
        image: string | null
    }
}

interface LastMessage {
    id: string
    content: string
    createdAt: Date
    senderId: string
    read: boolean
}

interface Conversation {
    id: string
    vendor: Vendor | null
    lastMessage: LastMessage | null
    unreadCount: number
    updatedAt: Date
    createdAt: Date
}

interface Message {
    id: string
    content: string
    createdAt: Date
    senderId: string
    read: boolean
    isMine: boolean
    sender: {
        id: string
        name: string | null
        image: string | null
    }
}

interface VendorSearchResult {
    id: string
    name: string
    avatar: string | null
    email: string
    userId: string
}

interface MessagesClientProps {
    initialConversations: Conversation[]
}

export function CustomerMessagesClient({ initialConversations }: MessagesClientProps) {
    const { data: session } = useSession()
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
    const [activeCategory, setActiveCategory] = useState('inbox')
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [vendorSearchResults, setVendorSearchResults] = useState<VendorSearchResult[]>([])
    const [isSearchingVendors, setIsSearchingVendors] = useState(false)
    const [showVendorDropdown, setShowVendorDropdown] = useState(false)
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Filter conversations based on category and search
    const filteredConversations = conversations.filter(conv => {
        // Search filter
        if (searchQuery) {
            const vendorName = conv.vendor?.name?.toLowerCase() || ''
            const lastMessageContent = conv.lastMessage?.content?.toLowerCase() || ''
            const query = searchQuery.toLowerCase()
            if (!vendorName.includes(query) && !lastMessageContent.includes(query)) {
                return false
            }
        }

        // Category filter
        switch (activeCategory) {
            case 'unread':
                return conv.unreadCount > 0
            case 'sent':
                return conv.lastMessage?.senderId === session?.user?.id
            case 'from-shops':
                return conv.lastMessage?.senderId !== session?.user?.id
            default:
                return true
        }
    })

    // Load messages for selected conversation
    const loadMessages = useCallback(async (conversationId: string) => {
        setIsLoadingMessages(true)
        try {
            const data = await getMessages(conversationId)
            setMessages(data)
            // Mark as read
            await markMessagesAsRead(conversationId)
            // Update unread count in local state
            setConversations(prev =>
                prev.map(c =>
                    c.id === conversationId ? { ...c, unreadCount: 0 } : c
                )
            )
        } catch (error) {
            toast.error('Failed to load messages')
        } finally {
            setIsLoadingMessages(false)
        }
    }, [])

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id)
        }
    }, [selectedConversation, loadMessages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    // Debounced vendor search
    useEffect(() => {
        const searchTimer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearchingVendors(true)
                setShowVendorDropdown(true)
                try {
                    const results = await searchVendorsForChat(searchQuery)
                    setVendorSearchResults(results)
                } catch (error) {
                    console.error('Error searching vendors:', error)
                    setVendorSearchResults([])
                } finally {
                    setIsSearchingVendors(false)
                }
            } else {
                setVendorSearchResults([])
                setShowVendorDropdown(false)
            }
        }, 300)

        return () => clearTimeout(searchTimer)
    }, [searchQuery])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowVendorDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConversation || isSending) return

        setIsSending(true)
        const content = newMessage.trim()
        setNewMessage('')

        // Optimistic update
        const tempMessage: Message = {
            id: 'temp-' + Date.now(),
            content,
            createdAt: new Date(),
            senderId: session?.user?.id || '',
            read: false,
            isMine: true,
            sender: {
                id: session?.user?.id || '',
                name: session?.user?.name || null,
                image: session?.user?.image || null
            }
        }
        setMessages(prev => [...prev, tempMessage])

        const result = await sendMessage(selectedConversation.id, content)

        if (result.success) {
            // Update with real message
            if (result.message) {
                setMessages(prev =>
                    prev.map(m => m.id === tempMessage.id ? result.message as Message : m)
                )
            }
            // Update conversation order
            setConversations(prev => {
                const updated = prev.map(c =>
                    c.id === selectedConversation.id
                        ? { ...c, lastMessage: { ...tempMessage, senderId: session?.user?.id || '' }, updatedAt: new Date() }
                        : c
                )
                return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            })
        } else {
            toast.error('Failed to send message')
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
            setNewMessage(content)
        }

        setIsSending(false)
    }

    const handleSelectConversation = (conv: Conversation) => {
        setSelectedConversation(conv)
    }

    const handleBack = () => {
        setSelectedConversation(null)
        setMessages([])
    }

    // Handle selecting a vendor from search to start a new conversation
    const handleSelectVendor = async (vendor: VendorSearchResult) => {
        setShowVendorDropdown(false)
        setSearchQuery('')
        setVendorSearchResults([])

        try {
            const result = await createConversationWithVendor(vendor.id)
            if (result.success && result.conversationId) {
                // Check if conversation already exists in list
                const existingConv = conversations.find(c => c.id === result.conversationId)
                if (existingConv) {
                    setSelectedConversation(existingConv)
                } else {
                    // Create a new conversation entry and add to list
                    const newConversation: Conversation = {
                        id: result.conversationId,
                        vendor: {
                            id: vendor.id,
                            name: vendor.name,
                            avatar: vendor.avatar,
                            user: {
                                id: vendor.userId,
                                name: vendor.name,
                                email: vendor.email,
                                image: vendor.avatar
                            }
                        },
                        lastMessage: null,
                        unreadCount: 0,
                        updatedAt: new Date(),
                        createdAt: new Date()
                    }
                    setConversations(prev => [newConversation, ...prev])
                    setSelectedConversation(newConversation)
                }
                toast.success(`محادثة مع ${vendor.name} جاهزة`)
            } else {
                toast.error(result.error || 'فشل في بدء المحادثة')
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء بدء المحادثة')
        }
    }

    // Total unread count
    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

    return (
        <div className="flex gap-6 h-[600px]">
            {/* Left Sidebar - Categories */}
            <aside className="w-48 shrink-0">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Messages
                    {totalUnread > 0 && (
                        <span className="ml-2 text-sm font-normal text-orange-600">({totalUnread})</span>
                    )}
                </h1>

                <nav className="space-y-1">
                    {sidebarCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2",
                                activeCategory === category.id
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <category.icon className="h-4 w-4" />
                            {category.label}
                            {category.id === 'unread' && totalUnread > 0 && (
                                <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-1.5 rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex border border-gray-200 rounded-lg overflow-hidden bg-white">
                {/* Conversation List */}
                <div className={cn(
                    "w-80 border-r border-gray-200 flex flex-col",
                    selectedConversation ? "hidden md:flex" : "flex"
                )}>
                    {/* Search with Vendor Dropdown */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative" ref={searchContainerRef}>
                            <input
                                type="text"
                                placeholder="ابحث عن بائع بالاسم أو الايميل أو ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (vendorSearchResults.length > 0) {
                                        setShowVendorDropdown(true)
                                    }
                                }}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            {isSearchingVendors && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                            )}

                            {/* Vendor Search Dropdown */}
                            {showVendorDropdown && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
                                    {isSearchingVendors ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                            جاري البحث...
                                        </div>
                                    ) : vendorSearchResults.length > 0 ? (
                                        <>
                                            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                                                اختر بائعًا لبدء محادثة جديدة
                                            </div>
                                            {vendorSearchResults.map((vendor) => (
                                                <button
                                                    key={vendor.id}
                                                    onClick={() => handleSelectVendor(vendor)}
                                                    className="w-full text-left p-3 hover:bg-orange-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {vendor.avatar ? (
                                                            <img
                                                                src={vendor.avatar}
                                                                alt={vendor.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-600 font-medium">
                                                                {vendor.name?.[0] || 'V'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {vendor.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {vendor.email}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate font-mono">
                                                            ID: {vendor.id.slice(0, 8)}...
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </>
                                    ) : searchQuery.length >= 2 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                            لا يوجد بائع بهذا الاسم أو الايميل
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                                <Mail className="h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-sm">No conversations yet</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={cn(
                                        "w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
                                        selectedConversation?.id === conv.id && "bg-orange-50",
                                        conv.unreadCount > 0 && "bg-orange-50/50"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                            {conv.vendor?.avatar ? (
                                                <img
                                                    src={conv.vendor.avatar}
                                                    alt={conv.vendor.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-600 font-medium">
                                                    {conv.vendor?.name?.[0] || 'S'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={cn(
                                                    "text-sm truncate",
                                                    conv.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-700"
                                                )}>
                                                    {conv.vendor?.name || 'Shop'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {conv.lastMessage && formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-sm truncate",
                                                conv.unreadCount > 0 ? "text-gray-800" : "text-gray-500"
                                            )}>
                                                {conv.lastMessage?.content || 'No messages yet'}
                                            </p>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat View */}
                <div className={cn(
                    "flex-1 flex flex-col",
                    selectedConversation ? "flex" : "hidden md:flex"
                )}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                <button
                                    onClick={handleBack}
                                    className="md:hidden p-1 hover:bg-gray-100 rounded"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {selectedConversation.vendor?.avatar ? (
                                        <img
                                            src={selectedConversation.vendor.avatar}
                                            alt={selectedConversation.vendor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-600 font-medium">
                                            {selectedConversation.vendor?.name?.[0] || 'S'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-medium text-gray-900">
                                        {selectedConversation.vendor?.name || 'Shop'}
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        {selectedConversation.vendor?.user?.email}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <p>Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex gap-3",
                                                msg.isMine ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            {!msg.isMine && (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {msg.sender.image ? (
                                                        <img
                                                            src={msg.sender.image}
                                                            alt={msg.sender.name || 'User'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600 text-sm">
                                                            {msg.sender.name?.[0] || 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    "max-w-[70%] rounded-2xl px-4 py-2",
                                                    msg.isMine
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 text-gray-900"
                                                )}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                <span
                                                    className={cn(
                                                        "text-[10px] mt-1 block",
                                                        msg.isMine ? "text-orange-100" : "text-gray-500"
                                                    )}
                                                >
                                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={scrollRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-orange-400"
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isSending}
                                        className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            {/* Empty state illustration */}
                            <svg
                                className="w-32 h-32 mb-4 text-gray-300"
                                viewBox="0 0 200 150"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <ellipse cx="60" cy="60" rx="25" ry="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                <ellipse cx="100" cy="50" rx="30" ry="25" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                <ellipse cx="140" cy="60" rx="25" ry="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                <circle cx="100" cy="100" r="15" stroke="#F97316" strokeWidth="2" fill="none" />
                                <path d="M75 130 Q100 115 125 130" stroke="#F97316" strokeWidth="2" fill="none" />
                                <path d="M40 40 Q45 35 50 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <path d="M150 35 Q155 30 160 35" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                            <p className="text-lg font-medium text-gray-600">Select a conversation</p>
                            <p className="text-sm text-gray-400 mt-1">Choose from your existing conversations</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
