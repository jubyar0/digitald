'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getUsers,
    getVendors,
    getProducts,
    getVendorApplications,
    banUser,
    unbanUser,
    approveProduct,
    rejectProduct,
} from '@/actions/admin'

// ============================================================================
// Query Keys
// ============================================================================

export const adminQueryKeys = {
    all: ['admin'] as const,
    users: (page?: number, search?: string, role?: string) =>
        [...adminQueryKeys.all, 'users', { page, search, role }] as const,
    vendors: (page?: number, search?: string) =>
        [...adminQueryKeys.all, 'vendors', { page, search }] as const,
    products: (page?: number, search?: string, status?: string) =>
        [...adminQueryKeys.all, 'products', { page, search, status }] as const,
    applications: (page?: number, status?: string) =>
        [...adminQueryKeys.all, 'applications', { page, status }] as const,
    escrow: () => [...adminQueryKeys.all, 'escrow'] as const,
    withdrawals: () => [...adminQueryKeys.all, 'withdrawals'] as const,
}

// ============================================================================
// Users Hooks
// ============================================================================

export function useAdminUsers(page = 1, pageSize = 10, search = '', role = '') {
    return useQuery({
        queryKey: adminQueryKeys.users(page, search, role),
        queryFn: () => getUsers(page, pageSize, search, role),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useBanUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, reason, bannedBy, banEnd }: {
            userId: string;
            reason: string;
            bannedBy: string;
            banEnd?: Date
        }) => banUser(userId, reason, bannedBy, banEnd),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
        },
    })
}

export function useUnbanUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bannedUserId: string) => unbanUser(bannedUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() })
        },
    })
}

// ============================================================================
// Vendors Hooks
// ============================================================================

export function useAdminVendors(page = 1, pageSize = 10, search = '') {
    return useQuery({
        queryKey: adminQueryKeys.vendors(page, search),
        queryFn: () => getVendors(page, pageSize, search),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

// ============================================================================
// Products Hooks
// ============================================================================

export function useAdminProducts(page = 1, pageSize = 10, search = '', status = '') {
    return useQuery({
        queryKey: adminQueryKeys.products(page, search, status),
        queryFn: () => getProducts(page, pageSize, search, status),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export function useApproveProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (productId: string) => approveProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
        },
    })
}

export function useRejectProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, reviewNotes }: { productId: string; reviewNotes: string }) =>
            rejectProduct(productId, reviewNotes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.products() })
        },
    })
}

// ============================================================================
// Vendor Applications Hooks
// ============================================================================

export function useVendorApplications(page = 1, pageSize = 10, status = '') {
    return useQuery({
        queryKey: adminQueryKeys.applications(page, status),
        queryFn: () => getVendorApplications(page, pageSize, status),
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })
}

// ============================================================================
// Prefetch Helpers
// ============================================================================

export function usePrefetchAdminData() {
    const queryClient = useQueryClient()

    const prefetchUsers = (page = 1, search = '', role = '') => {
        queryClient.prefetchQuery({
            queryKey: adminQueryKeys.users(page, search, role),
            queryFn: () => getUsers(page, 10, search, role),
            staleTime: 30 * 1000,
        })
    }

    const prefetchVendors = (page = 1, search = '') => {
        queryClient.prefetchQuery({
            queryKey: adminQueryKeys.vendors(page, search),
            queryFn: () => getVendors(page, 10, search),
            staleTime: 30 * 1000,
        })
    }

    const prefetchProducts = (page = 1, search = '', status = '') => {
        queryClient.prefetchQuery({
            queryKey: adminQueryKeys.products(page, search, status),
            queryFn: () => getProducts(page, 10, search, status),
            staleTime: 30 * 1000,
        })
    }

    return {
        prefetchUsers,
        prefetchVendors,
        prefetchProducts,
    }
}
