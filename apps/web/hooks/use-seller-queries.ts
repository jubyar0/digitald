'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getSellerDashboardStats,
    getSellerOrders,
    getSellerDiscounts,
    updateOrderStatus,
    deleteDiscount,
    toggleDiscountStatus
} from '@/actions/seller'

// ============================================================================
// Query Keys - Centralized for cache invalidation
// ============================================================================

export const sellerQueryKeys = {
    all: ['seller'] as const,
    dashboard: () => [...sellerQueryKeys.all, 'dashboard'] as const,
    orders: (page?: number, status?: string) =>
        [...sellerQueryKeys.all, 'orders', { page, status }] as const,
    discounts: () => [...sellerQueryKeys.all, 'discounts'] as const,
    products: (page?: number) =>
        [...sellerQueryKeys.all, 'products', { page }] as const,
    analytics: () => [...sellerQueryKeys.all, 'analytics'] as const,
}

// ============================================================================
// Dashboard Stats Hook
// ============================================================================

export function useSellerDashboard() {
    return useQuery({
        queryKey: sellerQueryKeys.dashboard(),
        queryFn: getSellerDashboardStats,
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ============================================================================
// Orders Hooks
// ============================================================================

export function useSellerOrders(page = 1, pageSize = 10, status?: string) {
    return useQuery({
        queryKey: sellerQueryKeys.orders(page, status),
        queryFn: () => getSellerOrders(page, pageSize, status),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: string }) =>
            updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
            // Invalidate all order queries
            queryClient.invalidateQueries({ queryKey: sellerQueryKeys.orders() })
            queryClient.invalidateQueries({ queryKey: sellerQueryKeys.dashboard() })
        },
    })
}

// ============================================================================
// Discounts Hooks
// ============================================================================

export function useSellerDiscounts() {
    return useQuery({
        queryKey: sellerQueryKeys.discounts(),
        queryFn: getSellerDiscounts,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

export function useDeleteDiscount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteDiscount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sellerQueryKeys.discounts() })
        },
    })
}

export function useToggleDiscountStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            toggleDiscountStatus(id, isActive),
        // Optimistic update
        onMutate: async ({ id, isActive }) => {
            await queryClient.cancelQueries({ queryKey: sellerQueryKeys.discounts() })

            const previousDiscounts = queryClient.getQueryData(sellerQueryKeys.discounts())

            queryClient.setQueryData(sellerQueryKeys.discounts(), (old: any[] | undefined) => {
                if (!old) return old
                return old.map(discount =>
                    discount.id === id ? { ...discount, isActive } : discount
                )
            })

            return { previousDiscounts }
        },
        onError: (_err, _variables, context) => {
            if (context?.previousDiscounts) {
                queryClient.setQueryData(sellerQueryKeys.discounts(), context.previousDiscounts)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: sellerQueryKeys.discounts() })
        },
    })
}

// ============================================================================
// Prefetch Helpers
// ============================================================================

export function usePrefetchSellerData() {
    const queryClient = useQueryClient()

    const prefetchDashboard = () => {
        queryClient.prefetchQuery({
            queryKey: sellerQueryKeys.dashboard(),
            queryFn: getSellerDashboardStats,
            staleTime: 30 * 1000,
        })
    }

    const prefetchOrders = (page = 1, status?: string) => {
        queryClient.prefetchQuery({
            queryKey: sellerQueryKeys.orders(page, status),
            queryFn: () => getSellerOrders(page, 10, status),
            staleTime: 30 * 1000,
        })
    }

    const prefetchDiscounts = () => {
        queryClient.prefetchQuery({
            queryKey: sellerQueryKeys.discounts(),
            queryFn: getSellerDiscounts,
            staleTime: 60 * 1000,
        })
    }

    return {
        prefetchDashboard,
        prefetchOrders,
        prefetchDiscounts,
    }
}
