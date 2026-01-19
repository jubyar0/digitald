'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function ApplicationsFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [status, setStatus] = useState(searchParams.get('status') || 'all')
    const [personaStatus, setPersonaStatus] = useState(
        searchParams.get('personaStatus') || 'all'
    )

    const applyFilters = () => {
        const params = new URLSearchParams()

        if (search) params.set('search', search)
        if (status && status !== 'all') params.set('status', status)
        if (personaStatus && personaStatus !== 'all')
            params.set('personaStatus', personaStatus)

        startTransition(() => {
            router.push(`/admin/seller-applications?${params.toString()}`)
        })
    }

    const clearFilters = () => {
        setSearch('')
        setStatus('all')
        setPersonaStatus('all')
        startTransition(() => {
            router.push('/admin/seller-applications')
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            applyFilters()
        }
    }

    const hasActiveFilters =
        search || (status && status !== 'all') || (personaStatus && personaStatus !== 'all')

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    {/* Search Input */}
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="w-full md:w-48">
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                                <SelectItem value="NEEDS_REVISION">Needs Revision</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Persona Status Filter */}
                    <div className="w-full md:w-48">
                        <label className="text-sm font-medium mb-2 block">Persona Status</label>
                        <Select value={personaStatus} onValueChange={setPersonaStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="VERIFIED">Verified</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="OVERRIDDEN">Overridden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button onClick={applyFilters} disabled={isPending}>
                            Apply Filters
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                disabled={isPending}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
