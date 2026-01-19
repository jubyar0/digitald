'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Badge } from '@/components/dashboard/ui/badge'
import { Input } from '@/components/dashboard/ui/input'
import { Label } from '@/components/dashboard/ui/label'
import { Textarea } from '@/components/dashboard/ui/textarea'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/dashboard/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/dashboard/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/dashboard/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SearchIcon, BanIcon, EyeIcon, Trash2Icon, Loader2Icon } from 'lucide-react'
import { getUserById, banUser, deleteUser } from '@/actions/admin'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
    isBanned: boolean
}

interface UserDetails extends User {
    bannedUsers?: {
        id: string
        reason: string
        banEnd: Date | null
        createdAt: Date
        isActive: boolean
        bannedByUser: {
            name: string | null
        }
    } | null
    vendors?: {
        id: string
        name: string
        description: string | null
        _count: {
            products: number
            orders: number
        }
    } | null
    _count: {
        orders: number
        reviews: number
    }
}

interface UsersTableProps {
    initialUsers: User[]
    initialTotal: number
    initialPage: number
    initialSearch: string
    initialRole: string
}

export function UsersTable({
    initialUsers,
    initialTotal,
    initialPage,
    initialSearch,
    initialRole
}: UsersTableProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // State initialized from props
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [loading, setLoading] = useState(false)

    // Filter states
    const [search, setSearch] = useState(initialSearch)
    const [roleFilter, setRoleFilter] = useState(initialRole)
    const [page, setPage] = useState(initialPage)
    const [total, setTotal] = useState(initialTotal)
    const pageSize = 10

    // View Dialog State
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
    const [loadingUser, setLoadingUser] = useState(false)

    // Ban Dialog State
    const [banDialogOpen, setBanDialogOpen] = useState(false)
    const [banReason, setBanReason] = useState('')
    const [banEndDate, setBanEndDate] = useState('')
    const [banningUser, setBanningUser] = useState(false)
    const [userToBan, setUserToBan] = useState<User | null>(null)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deletingUser, setDeletingUser] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    // Update URL when filters change
    const updateUrl = (newPage: number, newSearch: string, newRole: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())

        if (newSearch) params.set('search', newSearch)
        else params.delete('search')

        if (newRole && newRole !== 'all') params.set('role', newRole)
        else params.delete('role')

        router.push(`${pathname}?${params.toString()}`)
    }

    // Handle search input
    const handleSearch = () => {
        setPage(1)
        updateUrl(1, search, roleFilter)
    }

    // Handle role change
    const handleRoleChange = (value: string) => {
        setRoleFilter(value)
        setPage(1)
        updateUrl(1, search, value)
    }

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        updateUrl(newPage, search, roleFilter)
    }

    // Sync state with props when they change (server re-render)
    useEffect(() => {
        setUsers(initialUsers)
        setTotal(initialTotal)
        setLoading(false)
    }, [initialUsers, initialTotal])

    // Indicate loading when navigating
    useEffect(() => {
        setLoading(true)
    }, [searchParams])

    const handleViewUser = async (userId: string) => {
        setLoadingUser(true)
        setViewDialogOpen(true)
        try {
            const user = await getUserById(userId)
            setSelectedUser(user as any)
        } catch (error) {
            console.error('Failed to fetch user details:', error)
            toast.error('Failed to load user details')
            setViewDialogOpen(false)
        } finally {
            setLoadingUser(false)
        }
    }

    const handleBanClick = (user: User) => {
        setUserToBan(user)
        setBanReason('')
        setBanEndDate('')
        setBanDialogOpen(true)
    }

    const handleBanUser = async () => {
        if (!userToBan || !session?.user?.id) return

        if (!banReason.trim()) {
            toast.error('Please provide a reason for banning')
            return
        }

        setBanningUser(true)
        try {
            await banUser(
                userToBan.id,
                banReason,
                session.user.id,
                banEndDate ? new Date(banEndDate) : undefined
            )
            toast.success(`User ${userToBan.name || userToBan.email} has been banned`)
            setBanDialogOpen(false)
            router.refresh() // Refresh server data
        } catch (error) {
            console.error('Failed to ban user:', error)
            toast.error('Failed to ban user')
        } finally {
            setBanningUser(false)
        }
    }

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setDeleteDialogOpen(true)
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        setDeletingUser(true)
        try {
            await deleteUser(userToDelete.id)
            toast.success(`User ${userToDelete.name || userToDelete.email} has been deleted`)
            setDeleteDialogOpen(false)
            router.refresh() // Refresh server data
        } catch (error) {
            console.error('Failed to delete user:', error)
            toast.error('Failed to delete user')
        } finally {
            setDeletingUser(false)
        }
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'destructive'
            case 'VENDOR':
                return 'default'
            default:
                return 'secondary'
        }
    }

    return (
        <div className="flex flex-col gap-8 dashboard-padding">
            {/* Header */}
            <div className="dashboard-card p-6">
                <div className="dashboard-card-header">
                    <h3 className="dashboard-card-title">All Users</h3>
                    <p className="dashboard-card-description">
                        Manage platform users and their accounts
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={roleFilter} onValueChange={handleRoleChange}>
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
                        <Button onClick={handleSearch}>Search</Button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2Icon className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role) as any}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.isBanned ? (
                                                <Badge variant="destructive">Banned</Badge>
                                            ) : (
                                                <Badge variant="outline">Active</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleViewUser(user.id)}
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Button>
                                                {!user.isBanned && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleBanClick(user)}
                                                        title="Ban User"
                                                    >
                                                        <BanIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(user)}
                                                    title="Delete User"
                                                >
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {users.length} of {total} users
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page * pageSize >= total}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* View User Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the user
                        </DialogDescription>
                    </DialogHeader>
                    {loadingUser ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2Icon className="h-8 w-8 animate-spin" />
                        </div>
                    ) : selectedUser ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Name</Label>
                                    <p className="font-medium">{selectedUser.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Role</Label>
                                    <div className="mt-1">
                                        <Badge variant={getRoleBadgeVariant(selectedUser.role) as any}>
                                            {selectedUser.role}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                        {selectedUser.isBanned ? (
                                            <Badge variant="destructive">Banned</Badge>
                                        ) : (
                                            <Badge variant="outline">Active</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Joined</Label>
                                    <p className="font-medium">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Total Orders</Label>
                                    <p className="font-medium">{selectedUser._count.orders}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Total Reviews</Label>
                                    <p className="font-medium">{selectedUser._count.reviews}</p>
                                </div>
                            </div>

                            {selectedUser.vendors && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Vendor Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Vendor Name</Label>
                                            <p className="font-medium">{selectedUser.vendors.name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Products</Label>
                                            <p className="font-medium">{selectedUser.vendors._count.products}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Description</Label>
                                            <p className="font-medium">{selectedUser.vendors.description || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedUser.bannedUsers && selectedUser.bannedUsers.isActive && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3 text-destructive">Ban Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Banned By</Label>
                                            <p className="font-medium">{selectedUser.bannedUsers.bannedByUser.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Ban Date</Label>
                                            <p className="font-medium">
                                                {new Date(selectedUser.bannedUsers.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Reason</Label>
                                            <p className="font-medium">{selectedUser.bannedUsers.reason}</p>
                                        </div>
                                        {selectedUser.bannedUsers.banEnd && (
                                            <div>
                                                <Label className="text-muted-foreground">Ban End Date</Label>
                                                <p className="font-medium">
                                                    {new Date(selectedUser.bannedUsers.banEnd).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ban User Dialog */}
            <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription>
                            Ban {userToBan?.name || userToBan?.email} from the platform
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="banReason">Reason *</Label>
                            <Textarea
                                id="banReason"
                                placeholder="Enter the reason for banning this user..."
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="banEndDate">Ban End Date (Optional)</Label>
                            <Input
                                id="banEndDate"
                                type="date"
                                value={banEndDate}
                                onChange={(e) => setBanEndDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Leave empty for permanent ban
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBanDialogOpen(false)}
                            disabled={banningUser}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBanUser}
                            disabled={banningUser}
                        >
                            {banningUser && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Ban User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user{' '}
                            <span className="font-semibold">{userToDelete?.name || userToDelete?.email}</span>{' '}
                            and remove all their data from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingUser}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={deletingUser}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingUser && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
