"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Search, ArrowUpDown, MoreHorizontal, Trash2, Edit } from "lucide-react"
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
import { toast } from "sonner"
import {
    createStoreRole,
    deleteStoreRole
} from "@/actions/seller-users"

interface StoreRole {
    id: string
    name: string
    description: string | null
    permissions: string[]
    isSystem: boolean
    userCount: number
}

interface RolesClientProps {
    initialRoles: StoreRole[]
}

const PERMISSION_GROUPS = {
    'Products': ['products.view', 'products.create', 'products.edit', 'products.delete'],
    'Orders': ['orders.view', 'orders.manage'],
    'Customers': ['customers.view', 'customers.manage'],
    'Analytics': ['analytics.view'],
    'Settings': ['settings.view', 'settings.edit'],
    'Team': ['team.view', 'team.manage'],
    'Discounts': ['discounts.view', 'discounts.manage'],
    'Support': ['support.view', 'support.respond'],
}

export default function RolesClient({ initialRoles }: RolesClientProps) {
    const [roles, setRoles] = useState<StoreRole[]>(initialRoles)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [roleName, setRoleName] = useState("")
    const [roleDescription, setRoleDescription] = useState("")
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateRole = async () => {
        if (!roleName.trim()) {
            toast.error("Please enter a role name")
            return
        }

        if (selectedPermissions.length === 0) {
            toast.error("Please select at least one permission")
            return
        }

        setIsLoading(true)
        try {
            const result = await createStoreRole(roleName, selectedPermissions, roleDescription)
            if (result.success) {
                toast.success("Role created successfully")
                setIsCreateOpen(false)
                setRoleName("")
                setRoleDescription("")
                setSelectedPermissions([])
                window.location.reload()
            } else {
                toast.error(result.error || "Failed to create role")
            }
        } catch (error) {
            toast.error("Failed to create role")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteRole = async (roleId: string, isSystem: boolean, userCount: number) => {
        if (isSystem) {
            toast.error("Cannot delete system roles")
            return
        }

        if (userCount > 0) {
            toast.error("Cannot delete role with assigned users")
            return
        }

        const confirmed = window.confirm("Are you sure you want to delete this role?")
        if (!confirmed) return

        try {
            const result = await deleteStoreRole(roleId)
            if (result.success) {
                toast.success("Role deleted successfully")
                setRoles(roles.filter(r => r.id !== roleId))
            } else {
                toast.error(result.error || "Failed to delete role")
            }
        } catch (error) {
            toast.error("Failed to delete role")
        }
    }

    const togglePermission = (permission: string) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permission))
        } else {
            setSelectedPermissions([...selectedPermissions, permission])
        }
    }

    const togglePermissionGroup = (permissions: string[]) => {
        const allSelected = permissions.every(p => selectedPermissions.includes(p))
        if (allSelected) {
            setSelectedPermissions(selectedPermissions.filter(p => !permissions.includes(p)))
        } else {
            setSelectedPermissions([...new Set([...selectedPermissions, ...permissions])])
        }
    }

    return (
        <div className="p-6 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Roles</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-black text-white hover:bg-black/90">Add role</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create custom role</DialogTitle>
                                <DialogDescription>
                                    Define a new role with specific permissions for your team members.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Role name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Content Manager"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description (optional)</Label>
                                    <Input
                                        id="description"
                                        placeholder="Brief description of this role"
                                        value={roleDescription}
                                        onChange={(e) => setRoleDescription(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-4">
                                    <Label>Permissions</Label>
                                    <div className="grid gap-4">
                                        {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
                                            <div key={group} className="border rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Checkbox
                                                        checked={permissions.every(p => selectedPermissions.includes(p))}
                                                        onCheckedChange={() => togglePermissionGroup(permissions)}
                                                    />
                                                    <span className="font-medium">{group}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 ml-6">
                                                    {permissions.map(permission => (
                                                        <div key={permission} className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={selectedPermissions.includes(permission)}
                                                                onCheckedChange={() => togglePermission(permission)}
                                                            />
                                                            <span className="text-sm text-muted-foreground">
                                                                {permission.split('.')[1].replace(/([A-Z])/g, ' $1').trim()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateRole} disabled={isLoading}>
                                    {isLoading ? "Creating..." : "Create role"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-2 border-b flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" className="rounded-md bg-gray-100 hover:bg-gray-200 text-black font-medium px-3">
                                All
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Input
                                    placeholder="Search roles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 h-8 pl-8"
                                />
                                <Search className="h-4 w-4 absolute left-2 top-2 text-muted-foreground" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
                            <div className="flex items-center">
                                <Checkbox />
                            </div>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                Name
                                <ArrowUpDown className="h-3 w-3" />
                            </div>
                            <div className="text-right">Users</div>
                            <div className="w-8"></div>
                        </div>
                        <div className="divide-y">
                            {filteredRoles.map((role) => (
                                <div key={role.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center">
                                        <Checkbox
                                            checked={selectedRoles.includes(role.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRoles([...selectedRoles, role.id])
                                                } else {
                                                    setSelectedRoles(selectedRoles.filter(id => id !== role.id))
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{role.name}</div>
                                        {role.description && (
                                            <p className="text-xs text-muted-foreground">{role.description}</p>
                                        )}
                                        {role.isSystem && (
                                            <span className="text-xs text-blue-600">System role</span>
                                        )}
                                    </div>
                                    <div className="text-right text-sm text-muted-foreground">
                                        {role.userCount}
                                    </div>
                                    <div>
                                        {!role.isSystem && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeleteRole(role.id, role.isSystem, role.userCount)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredRoles.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">
                                    No roles found.
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 text-center">
                <Link href="/seller/settings/users" className="text-sm text-blue-600 hover:underline">
                    Back to users
                </Link>
            </div>
        </div>
    )
}
