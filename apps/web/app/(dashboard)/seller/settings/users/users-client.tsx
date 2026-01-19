"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ShieldAlert, MoreHorizontal, Trash2, UserCog } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    inviteStoreUser,
    removeStoreUser,
    updateStoreUser,
    exportStoreUsers
} from "@/actions/seller-users"

interface StoreUser {
    id: string
    name: string
    email: string
    image: string | null
    status: "PENDING" | "ACTIVE" | "INACTIVE"
    role: string
    roleId: string
    has2FA: boolean
    lastActiveAt: Date | null
    createdAt: Date
}

interface StoreRole {
    id: string
    name: string
    description: string | null
    permissions: string[]
    isSystem: boolean
    userCount: number
}

interface UsersClientProps {
    initialUsers: StoreUser[]
    roles: StoreRole[]
}

export default function UsersClient({ initialUsers, roles }: UsersClientProps) {
    const [users, setUsers] = useState<StoreUser[]>(initialUsers)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRoleId, setInviteRoleId] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const handleInviteUser = async () => {
        if (!inviteEmail || !inviteRoleId) {
            toast.error("Please fill in all fields")
            return
        }

        setIsLoading(true)
        try {
            const result = await inviteStoreUser(inviteEmail, inviteRoleId)
            if (result.success) {
                toast.success("User invited successfully")
                setIsInviteOpen(false)
                setInviteEmail("")
                setInviteRoleId("")
                // Refresh the page to get updated data
                window.location.reload()
            } else {
                toast.error(result.error || "Failed to invite user")
            }
        } catch (error) {
            toast.error("Failed to invite user")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveUser = async (userId: string) => {
        if (userId === 'owner') {
            toast.error("Cannot remove store owner")
            return
        }

        const confirmed = window.confirm("Are you sure you want to remove this user?")
        if (!confirmed) return

        try {
            const result = await removeStoreUser(userId)
            if (result.success) {
                toast.success("User removed successfully")
                setUsers(users.filter(u => u.id !== userId))
            } else {
                toast.error(result.error || "Failed to remove user")
            }
        } catch (error) {
            toast.error("Failed to remove user")
        }
    }

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        if (userId === 'owner') {
            toast.error("Cannot change store owner status")
            return
        }

        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

        try {
            const result = await updateStoreUser(userId, { status: newStatus as 'ACTIVE' | 'INACTIVE' })
            if (result.success) {
                toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`)
                setUsers(users.map(u =>
                    u.id === userId ? { ...u, status: newStatus as 'ACTIVE' | 'INACTIVE' } : u
                ))
            } else {
                toast.error(result.error || "Failed to update user")
            }
        } catch (error) {
            toast.error("Failed to update user")
        }
    }

    const handleExport = async () => {
        try {
            const result = await exportStoreUsers()
            if (result.success && result.data) {
                const blob = new Blob([result.data], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'store-users.csv'
                a.click()
                URL.revokeObjectURL(url)
                toast.success("Users exported successfully")
            } else {
                toast.error("Failed to export users")
            }
        } catch (error) {
            toast.error("Failed to export users")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-normal">Active</Badge>
            case 'PENDING':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 font-normal">Pending</Badge>
            case 'INACTIVE':
                return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-normal">Inactive</Badge>
            default:
                return null
        }
    }

    return (
        <div className="p-6 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Users</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>Export</Button>
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-black text-white hover:bg-black/90">Add users</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite team member</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to a new team member. They will receive an email with instructions.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={inviteRoleId} onValueChange={setInviteRoleId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleInviteUser} disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send invitation"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="w-full">
                        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-4 p-4 border-b bg-gray-50/50 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center">
                                <Checkbox />
                            </div>
                            <div>User</div>
                            <div>Status</div>
                            <div>Role</div>
                            <div className="w-8"></div>
                        </div>
                        <div className="divide-y">
                            {users.map((user) => (
                                <div key={user.id} className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedUsers([...selectedUsers, user.id])
                                                } else {
                                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            {user.image && <AvatarImage src={user.image} />}
                                            <AvatarFallback className="rounded-lg bg-purple-100 text-purple-700">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className="font-medium text-sm">{user.name}</span>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(user.status)}
                                        {!user.has2FA && (
                                            <ShieldAlert className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {user.role}
                                    </div>
                                    <div>
                                        {user.id !== 'owner' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status)}>
                                                        <UserCog className="h-4 w-4 mr-2" />
                                                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleRemoveUser(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">
                                    No team members yet. Click "Add users" to invite someone.
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 text-center">
                <Link href="/seller/settings/users/roles" className="text-sm text-blue-600 hover:underline">
                    Manage roles and permissions
                </Link>
            </div>
        </div>
    )
}
