'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Users, Search, MessageSquare, Ticket, Shield } from 'lucide-react'
import { getAdminUsers, updateUserPermissions } from '@/actions/admin-users'

export default function TeamSettingsPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await getAdminUsers()
                if (result.success) {
                    setUsers(result.data || [])
                }
            } catch (error) {
                toast.error('Failed to load team members')
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handlePermissionChange = async (userId: string, permission: 'livechat' | 'tickets', value: boolean) => {
        // Optimistic update
        setUsers(prev => prev.map(u =>
            u.id === userId
                ? { ...u, [permission === 'livechat' ? 'canHandleLiveChat' : 'canHandleTickets']: value }
                : u
        ))

        try {
            const result = await updateUserPermissions(userId, {
                [permission === 'livechat' ? 'canHandleLiveChat' : 'canHandleTickets']: value
            })

            if (result.success) {
                toast.success('Permissions updated')
            } else {
                // Revert
                setUsers(prev => prev.map(u =>
                    u.id === userId
                        ? { ...u, [permission === 'livechat' ? 'canHandleLiveChat' : 'canHandleTickets']: !value }
                        : u
                ))
                toast.error('Failed to update permissions')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-500" />
                    Team Management
                </h1>
                <p className="text-muted-foreground">
                    Manage support roles and permissions
                </p>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Staff Members</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search staff..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No staff members found.</p>
                        ) : (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{user.name}</p>
                                                <Badge variant="secondary" className="text-xs">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        {/* Live Chat Permission */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <MessageSquare className="h-4 w-4" />
                                                Live Chat
                                            </div>
                                            <Switch
                                                checked={user.canHandleLiveChat}
                                                onCheckedChange={(checked) => handlePermissionChange(user.id, 'livechat', checked)}
                                            />
                                        </div>

                                        {/* Ticket Permission */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <Ticket className="h-4 w-4" />
                                                Tickets
                                            </div>
                                            <Switch
                                                checked={user.canHandleTickets}
                                                onCheckedChange={(checked) => handlePermissionChange(user.id, 'tickets', checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
