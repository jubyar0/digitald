import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { SearchIcon } from 'lucide-react'
import { getUsers } from '@/actions/admin'
import { UsersTableClient } from './users-table-client'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
    searchParams: {
        page?: string
        search?: string
        role?: string
    }
}

// Server Component - Fetches data
export default async function AllUsersPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const search = searchParams.search || ''
    const roleFilter = searchParams.role || 'all'
    const pageSize = 10

    // ✅ Fetch data server-side for instant LCP
    const result = await getUsers(
        page,
        pageSize,
        search,
        roleFilter === 'all' ? '' : roleFilter
    )

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header - Static, renders immediately */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">All Users</h3>
                            <p className="dashboard-card-description">
                                Manage platform users and their accounts
                            </p>
                        </div>

                        {/* Search & Filters */}
                        <form method="get" className="mt-6 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="search"
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    defaultValue={search}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select name="role" defaultValue={roleFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="VENDOR">Vendor</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit">Search</Button>
                            </div>
                        </form>
                    </div>

                    {/* Users Table - Renders with initial server data */}
                    <Card>
                        <CardContent className="p-0">
                            <UsersTableClient
                                initialUsers={result.data as any}
                                initialTotal={result.total}
                                initialPage={page}
                                initialSearch={search}
                                initialRoleFilter={roleFilter}
                            />
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {result.data.length} of {result.total} users
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                asChild
                            >
                                <a href={`?page=${page - 1}&search=${search}&role=${roleFilter}`}>
                                    Previous
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page * pageSize >= result.total}
                                asChild
                            >
                                <a href={`?page=${page + 1}&search=${search}&role=${roleFilter}`}>
                                    Next
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
