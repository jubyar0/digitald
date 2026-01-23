'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getChatSessions,
    getLivechatStats,
    getChatSession,
    sendChatMessage,
    assignChatToAgent,
    markMessagesAsRead
} from '@/actions/chatbot'
import { getCannedResponses } from '@/actions/canned-responses'

// ============================================================================
// Query Keys
// ============================================================================

export const chatbotQueryKeys = {
    all: ['chatbot'] as const,
    sessions: (filter?: string, search?: string) =>
        [...chatbotQueryKeys.all, 'sessions', { filter, search }] as const,
    session: (sessionId: string) =>
        [...chatbotQueryKeys.all, 'session', sessionId] as const,
    stats: () => [...chatbotQueryKeys.all, 'stats'] as const,
    cannedResponses: () => [...chatbotQueryKeys.all, 'canned'] as const,
}

// ============================================================================
// Chat Sessions Hook with Auto-Refetch
// ============================================================================

interface UseChatbotSessionsOptions {
    filter?: 'all' | 'waiting' | 'active'
    search?: string
    refetchInterval?: number // Default: 5000ms
}

export function useChatbotSessions(options: UseChatbotSessionsOptions = {}) {
    const { filter = 'all', search = '', refetchInterval = 5000 } = options

    return useQuery({
        queryKey: chatbotQueryKeys.sessions(filter, search),
        queryFn: async () => {
            const result = await getChatSessions(1, 50, {
                status: filter === 'all' ? undefined : filter === 'waiting' ? 'WAITING' : 'ACTIVE',
                search: search || undefined,
            })
            if (result.success) {
                return result.data || []
            }
            throw new Error('Failed to fetch sessions')
        },
        // Smart refetching - only when window is focused
        refetchInterval,
        refetchIntervalInBackground: false, // Don't refetch when tab is hidden
        staleTime: 3000, // Consider data fresh for 3 seconds
    })
}

// ============================================================================
// Livechat Stats Hook
// ============================================================================

export function useChatbotStats(refetchInterval = 5000) {
    return useQuery({
        queryKey: chatbotQueryKeys.stats(),
        queryFn: async () => {
            const result = await getLivechatStats()
            if (result.success) {
                return result.data
            }
            throw new Error('Failed to fetch stats')
        },
        refetchInterval,
        refetchIntervalInBackground: false,
        staleTime: 3000,
    })
}

// ============================================================================
// Single Chat Session Hook
// ============================================================================

export function useChatSession(sessionId: string | null) {
    return useQuery({
        queryKey: chatbotQueryKeys.session(sessionId || ''),
        queryFn: async () => {
            if (!sessionId) return null
            const result = await getChatSession(sessionId)
            if (result.success) {
                return result.data
            }
            throw new Error('Failed to fetch session')
        },
        enabled: !!sessionId,
        refetchInterval: 3000, // Faster refresh for active chat
        refetchIntervalInBackground: false,
    })
}

// ============================================================================
// Canned Responses Hook (rarely changes)
// ============================================================================

export function useCannedResponses() {
    return useQuery({
        queryKey: chatbotQueryKeys.cannedResponses(),
        queryFn: async () => {
            const result = await getCannedResponses()
            if (result.success) {
                return result.data || []
            }
            return []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - rarely changes
    })
}

// ============================================================================
// Mutations
// ============================================================================

export function useSendMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (params: {
            sessionId: string
            senderType: 'AGENT' | 'VISITOR' | 'SYSTEM'
            content: string
            context?: { userId?: string; productId?: string; currentUrl?: string }
        }) => {
            const result = await sendChatMessage(params)
            if (!result.success) {
                throw new Error('Failed to send message')
            }
            return result.data
        },
        // Optimistic update
        onMutate: async (newMessage) => {
            await queryClient.cancelQueries({
                queryKey: chatbotQueryKeys.session(newMessage.sessionId)
            })
        },
        onSuccess: (_data, variables) => {
            // Refetch the session to get updated messages
            queryClient.invalidateQueries({
                queryKey: chatbotQueryKeys.session(variables.sessionId)
            })
        },
    })
}

export function useAssignChat() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ sessionId, agentId }: { sessionId: string; agentId: string }) => {
            const result = await assignChatToAgent(sessionId, agentId)
            if (!result.success) {
                throw new Error('Failed to assign chat')
            }
            return result
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatbotQueryKeys.sessions() })
            queryClient.invalidateQueries({ queryKey: chatbotQueryKeys.stats() })
        },
    })
}

export function useMarkAsRead() {
    return useMutation({
        mutationFn: async (sessionId: string) => {
            return markMessagesAsRead(sessionId)
        },
    })
}
