'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getChatSessions,
    getLivechatStats,
    getChatSession,
    sendChatMessage,
    assignChatToAgent,
    markMessagesAsRead
} from '@/actions/livechat'
import { getCannedResponses } from '@/actions/canned-responses'

// ============================================================================
// Query Keys
// ============================================================================

export const livechatQueryKeys = {
    all: ['livechat'] as const,
    sessions: (filter?: string, search?: string) =>
        [...livechatQueryKeys.all, 'sessions', { filter, search }] as const,
    session: (sessionId: string) =>
        [...livechatQueryKeys.all, 'session', sessionId] as const,
    stats: () => [...livechatQueryKeys.all, 'stats'] as const,
    cannedResponses: () => [...livechatQueryKeys.all, 'canned'] as const,
}

// ============================================================================
// Chat Sessions Hook with Auto-Refetch
// ============================================================================

interface UseLivechatSessionsOptions {
    filter?: 'all' | 'waiting' | 'active'
    search?: string
    refetchInterval?: number // Default: 5000ms
}

export function useLivechatSessions(options: UseLivechatSessionsOptions = {}) {
    const { filter = 'all', search = '', refetchInterval = 5000 } = options

    return useQuery({
        queryKey: livechatQueryKeys.sessions(filter, search),
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

export function useLivechatStats(refetchInterval = 5000) {
    return useQuery({
        queryKey: livechatQueryKeys.stats(),
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
        queryKey: livechatQueryKeys.session(sessionId || ''),
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
        queryKey: livechatQueryKeys.cannedResponses(),
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
                queryKey: livechatQueryKeys.session(newMessage.sessionId)
            })
        },
        onSuccess: (_data, variables) => {
            // Refetch the session to get updated messages
            queryClient.invalidateQueries({
                queryKey: livechatQueryKeys.session(variables.sessionId)
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
            queryClient.invalidateQueries({ queryKey: livechatQueryKeys.sessions() })
            queryClient.invalidateQueries({ queryKey: livechatQueryKeys.stats() })
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
