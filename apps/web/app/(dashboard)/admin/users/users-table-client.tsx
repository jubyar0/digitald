'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SearchIcon, BanIcon, EyeIcon, Trash2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
    isBanned: boolean
}

interface UsersTableClientProps {
    initialUsers: User[]
    initialTotal: number
    initialPage?: number
    initialSearch?: string
    initialRoleFilter?: string
}

export function UsersTableClient({
    initialUsers,
    initialTotal,
    initialPage = 1,
    initialSearch = '',
    initialRoleFilter = 'all'
}: UsersTableClientProps) {
    const { data: session } = useSession()
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(initialTotal)

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
                            Loading...
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
                                        title="View Details"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Button>
                                    {!user.isBanned && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Ban User"
                                        >
                                            <BanIcon className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
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
    )
}
