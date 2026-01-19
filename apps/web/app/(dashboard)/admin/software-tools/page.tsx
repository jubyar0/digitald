'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import { Label } from '@/components/dashboard/ui/label'
import { Textarea } from '@/components/dashboard/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

interface SoftwareTool {
    id: string
    name: string
    description?: string
    logoUrl: string
    category?: string
    isActive: boolean
    vendorCount: number
    createdAt: string
}

export default function SoftwareToolsPage() {
    const [tools, setTools] = useState<SoftwareTool[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingTool, setEditingTool] = useState<SoftwareTool | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logoUrl: '',
        category: ''
    })

    useEffect(() => {
        fetchTools()
    }, [])

    const fetchTools = async () => {
        try {
            const res = await fetch('/api/admin/software-tools')
            if (res.ok) {
                const data = await res.json()
                setTools(data.tools)
            }
        } catch (error) {
            console.error('Error fetching tools:', error)
            toast.error('Failed to load software tools')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.logoUrl) {
            toast.error('Please upload a logo')
            return
        }

        try {
            const url = editingTool
                ? `/api/admin/software-tools/${editingTool.id}`
                : '/api/admin/software-tools'

            const res = await fetch(url, {
                method: editingTool ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(editingTool ? 'Tool updated!' : 'Tool created!')
                setDialogOpen(false)
                resetForm()
                fetchTools()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to save tool')
            }
        } catch (error) {
            console.error('Error saving tool:', error)
            toast.error('Failed to save tool')
        }
    }

    const handleEdit = (tool: SoftwareTool) => {
        setEditingTool(tool)
        setFormData({
            name: tool.name,
            description: tool.description || '',
            logoUrl: tool.logoUrl,
            category: tool.category || ''
        })
        setDialogOpen(true)
    }

    const handleDelete = async (toolId: string) => {
        if (!confirm('Are you sure you want to delete this tool?')) return

        try {
            const res = await fetch(`/api/admin/software-tools/${toolId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success('Tool deleted!')
                fetchTools()
            } else {
                toast.error('Failed to delete tool')
            }
        } catch (error) {
            console.error('Error deleting tool:', error)
            toast.error('Failed to delete tool')
        }
    }

    const handleToggleActive = async (tool: SoftwareTool) => {
        try {
            const res = await fetch(`/api/admin/software-tools/${tool.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !tool.isActive })
            })

            if (res.ok) {
                toast.success(`Tool ${!tool.isActive ? 'activated' : 'deactivated'}!`)
                fetchTools()
            } else {
                toast.error('Failed to update tool status')
            }
        } catch (error) {
            console.error('Error toggling tool:', error)
            toast.error('Failed to update tool status')
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            logoUrl: '',
            category: ''
        })
        setEditingTool(null)
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
                    <h1 className="text-3xl font-bold">Software & Tools</h1>
                    <p className="text-muted-foreground">Manage software tools that sellers can add to their profiles</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tool
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTool ? 'Edit Software Tool' : 'Add New Software Tool'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tool Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Blender, Maya, ZBrush"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g., 3D Software, Texturing, Rendering"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this tool"
                                    rows={3}
                                />
                            </div>

                            <ImageUpload
                                label="Logo *"
                                value={formData.logoUrl}
                                onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                                description="Recommended size: 200x200px (PNG, JPG, or SVG)"
                                maxSize={2}
                            />

                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingTool ? 'Update' : 'Create'} Tool
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tools ({tools.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tool</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Vendors</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tools.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No tools added yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tools.map((tool) => (
                                    <TableRow key={tool.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <NextImage
                                                    src={tool.logoUrl}
                                                    alt={tool.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-contain rounded border"
                                                    unoptimized
                                                />
                                                <span className="font-medium">{tool.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {tool.category ? (
                                                <Badge variant="outline">{tool.category}</Badge>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {tool.description || '-'}
                                        </TableCell>
                                        <TableCell>{tool.vendorCount}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={tool.isActive}
                                                    onCheckedChange={() => handleToggleActive(tool)}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {tool.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(tool)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(tool.id)}
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
