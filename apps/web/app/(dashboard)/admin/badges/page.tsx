'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Award, Loader2 } from 'lucide-react'

interface SellerBadge {
    id: string
    name: string
    description?: string
    icon: string
    color: string
    isActive: boolean
    vendorCount: number
    createdAt: string
}

export default function BadgesManagementPage() {
    const [badges, setBadges] = useState<SellerBadge[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingBadge, setEditingBadge] = useState<SellerBadge | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'Award',
        color: '#3b82f6'
    })

    useEffect(() => {
        fetchBadges()
    }, [])

    const fetchBadges = async () => {
        try {
            const res = await fetch('/api/admin/badges')
            if (res.ok) {
                const data = await res.json()
                setBadges(data.badges)
            }
        } catch (error) {
            console.error('Error fetching badges:', error)
            toast.error('Failed to load badges')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingBadge
                ? `/api/admin/badges/${editingBadge.id}`
                : '/api/admin/badges'

            const res = await fetch(url, {
                method: editingBadge ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(editingBadge ? 'Badge updated!' : 'Badge created!')
                setDialogOpen(false)
                resetForm()
                fetchBadges()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to save badge')
            }
        } catch (error) {
            console.error('Error saving badge:', error)
            toast.error('Failed to save badge')
        }
    }

    const handleEdit = (badge: SellerBadge) => {
        setEditingBadge(badge)
        setFormData({
            name: badge.name,
            description: badge.description || '',
            icon: badge.icon,
            color: badge.color
        })
        setDialogOpen(true)
    }

    const handleDelete = async (badgeId: string) => {
        if (!confirm('Are you sure you want to delete this badge?')) return

        try {
            const res = await fetch(`/api/admin/badges/${badgeId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('Badge deleted!')
                fetchBadges()
            } else {
                toast.error('Failed to delete badge')
            }
        } catch (error) {
            console.error('Error deleting badge:', error)
            toast.error('Failed to delete badge')
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: 'Award',
            color: '#3b82f6'
        })
        setEditingBadge(null)
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
        resetForm()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Seller Badges</h1>
                    <p className="text-muted-foreground">Manage badges that can be assigned to sellers</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Badge
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingBadge ? 'Edit Badge' : 'Create New Badge'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Badge Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Verified Creator"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this badge"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon Name *</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="Lucide icon name (e.g., Award, Star, Shield)"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use Lucide React icon names
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-20 h-10"
                                    />
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="#3b82f6"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingBadge ? 'Update' : 'Create'} Badge
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Badges ({badges.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Badge</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Icon</TableHead>
                                <TableHead>Vendors</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {badges.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No badges created yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                badges.map((badge) => (
                                    <TableRow key={badge.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                                                >
                                                    <Award className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{badge.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {badge.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {badge.icon}
                                            </code>
                                        </TableCell>
                                        <TableCell>{badge.vendorCount}</TableCell>
                                        <TableCell>
                                            <Badge variant={badge.isActive ? 'default' : 'secondary'}>
                                                {badge.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(badge)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(badge.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
        </div>
    )
}
