'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { getAdminAccounts, createAdminAccount, deleteAdminAccount } from '@/actions/admin'
import { toast } from 'sonner'
import { PlusIcon, Loader2Icon, ShieldIcon, Trash2Icon, UserCheckIcon } from 'lucide-react'
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

interface AdminAccount {
    id: string
    userId: string
    lastLogin: Date | null
    createdAt: Date
    user: {
        name: string | null
        email: string
        role: string
    }
}

export default function AdminAccountsPage() {
    const [admins, setAdmins] = useState<AdminAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [userId, setUserId] = useState('')
    const [searchingUser, setSearchingUser] = useState(false)
    const [userFound, setUserFound] = useState(false)
    const [userName, setUserName] = useState('')
    const [adding, setAdding] = useState(false)

    // Manage Dialog State
    const [manageDialogOpen, setManageDialogOpen] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [adminToDelete, setAdminToDelete] = useState<AdminAccount | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchAdmins = async () => {
        setLoading(true)
        try {
            const result = await getAdminAccounts(page, pageSize)
            setAdmins(result.data as any)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load admin accounts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [page])

    const handleAddClick = () => {
        setUserEmail('')
        setUserId('')
        setUserFound(false)
        setUserName('')
        setAddDialogOpen(true)
    }

    const handleSearchUser = async () => {
        if (!userEmail.trim()) {
            toast.error('Please enter an email address')
            return
        }

        setSearchingUser(true)
        try {
            // Search for user by email
            const response = await fetch(`/api/users/search?email=${encodeURIComponent(userEmail)}`)
            const data = await response.json()

            if (data.user) {
                setUserId(data.user.id)
                setUserName(data.user.name || data.user.email)
                setUserFound(true)
                toast.success('User found!')
            } else {
                toast.error('User not found')
                setUserFound(false)
            }
        } catch (error) {
            toast.error('Failed to search for user')
            setUserFound(false)
        } finally {
            setSearchingUser(false)
        }
    }

    const handleAddAdmin = async () => {
        if (!userId) {
            toast.error('Please search for a user first')
            return
        }

        setAdding(true)
        try {
            await createAdminAccount(userId)
            toast.success('Admin account created successfully')
            setAddDialogOpen(false)
            fetchAdmins()
        } catch (error) {
            toast.error('Failed to create admin account')
        } finally {
            setAdding(false)
        }
    }

    const handleManageClick = (admin: AdminAccount) => {
        setSelectedAdmin(admin)
        setManageDialogOpen(true)
    }

    const handleDeleteClick = (admin: AdminAccount) => {
        setAdminToDelete(admin)
        setDeleteDialogOpen(true)
    }

    const handleDeleteAdmin = async () => {
        if (!adminToDelete) return

        setDeleting(true)
        try {
            await deleteAdminAccount(adminToDelete.id)
            toast.success('Admin account removed successfully')
            setDeleteDialogOpen(false)
            fetchAdmins()
        } catch (error) {
            toast.error('Failed to remove admin account')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Admin Accounts</h3>
                            <p className="dashboard-card-description">
                                Manage administrator accounts
                            </p>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAddClick}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Admin
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Last Login</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : admins.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">No admin accounts found</TableCell>
                                        </TableRow>
                                    ) : (
                                        admins.map((admin) => (
                                            <TableRow key={admin.id}>
                                                <TableCell className="font-medium">{admin.user.name || 'N/A'}</TableCell>
                                                <TableCell>{admin.user.email}</TableCell>
                                                <TableCell>{admin.user.role}</TableCell>
                                                <TableCell>
                                                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                                                </TableCell>
                                                <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleManageClick(admin)}
                                                        >
                                                            <ShieldIcon className="mr-1 h-3 w-3" />
                                                            Manage
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(admin)}
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

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {admins.length} of {total} admins
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Admin Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Admin Account</DialogTitle>
                        <DialogDescription>
                            Search for a user by email and grant them admin privileges
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userEmail">User Email *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="userEmail"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                                />
                                <Button
                                    onClick={handleSearchUser}
                                    disabled={searchingUser}
                                    variant="outline"
                                >
                                    {searchingUser ? (
                                        <Loader2Icon className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Search'
                                    )}
                                </Button>
                            </div>
                        </div>

                        {userFound && (
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <div className="flex items-center gap-2 text-sm">
                                    <UserCheckIcon className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">User found:</span>
                                    <span>{userName}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAddDialogOpen(false)}
                            disabled={adding}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddAdmin} disabled={adding || !userFound}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Grant Admin Access
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Admin Dialog */}
            <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Admin Account</DialogTitle>
                        <DialogDescription>
                            View and manage admin account details
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAdmin && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Name</Label>
                                    <p className="font-medium">{selectedAdmin.user.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedAdmin.user.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Role</Label>
                                    <p className="font-medium">{selectedAdmin.user.role}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Last Login</Label>
                                    <p className="font-medium">
                                        {selectedAdmin.lastLogin
                                            ? new Date(selectedAdmin.lastLogin).toLocaleString()
                                            : 'Never'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Created</Label>
                                    <p className="font-medium">
                                        {new Date(selectedAdmin.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setManageDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Admin Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Admin Access?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove admin privileges from{' '}
                            <span className="font-semibold">{adminToDelete?.user.email}</span>.
                            The user account will remain but will no longer have admin access.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAdmin}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Remove Access
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
