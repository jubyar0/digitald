'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { TicketStatus, TicketPriority } from '@repo/database'

interface TicketFiltersProps {
    onStatusChange?: (status: TicketStatus | 'all') => void
    onPriorityChange?: (priority: TicketPriority | 'all') => void
    onCategoryChange?: (category: string) => void
    onSearchChange?: (search: string) => void
    showAssignmentFilter?: boolean
    onAssignmentChange?: (adminId: string) => void
    admins?: Array<{ id: string; name: string | null; email: string }>
    categories?: string[]
}

export function TicketFilters({
    onStatusChange,
    onPriorityChange,
    onCategoryChange,
    onSearchChange,
    showAssignmentFilter = false,
    onAssignmentChange,
    admins = [],
    categories = ['Technical Issue', 'Billing', 'Account', 'Other']
}: TicketFiltersProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            {onSearchChange && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets..."
                        className="pl-9"
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            )}

            {/* Status Filter */}
            {onStatusChange && (
                <Select onValueChange={(value) => onStatusChange(value as TicketStatus | 'all')}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* Priority Filter */}
            {onPriorityChange && (
                <Select onValueChange={(value) => onPriorityChange(value as TicketPriority | 'all')}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* Category Filter */}
            {onCategoryChange && (
                <Select onValueChange={onCategoryChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Assignment Filter (Admin only) */}
            {showAssignmentFilter && onAssignmentChange && (
                <Select onValueChange={onAssignmentChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Assignees" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Assignees</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {admins.map((admin) => (
                            <SelectItem key={admin.id} value={admin.id}>
                                {admin.name || admin.email}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}
