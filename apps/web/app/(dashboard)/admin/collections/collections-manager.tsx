'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    reorderCollections,
} from '@/actions/collections'

interface Collection {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    image: string | null
    order: number
    isActive: boolean
    _count?: {
        categories: number
    }
}

export function CollectionsManager() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '',
        image: '',
    })

    useEffect(() => {
        loadCollections()
    }, [])

    const loadCollections = async () => {
        setLoading(true)
        try {
            const data = await getCollections(true) // Include inactive
            setCollections(data)
        } catch (error) {
            toast.error('Failed to load collections')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenDialog = (collection?: Collection) => {
        if (collection) {
            setEditingCollection(collection)
            setFormData({
                name: collection.name,
                slug: collection.slug,
                description: collection.description || '',
                icon: collection.icon || '',
                image: collection.image || '',
            })
        } else {
            setEditingCollection(null)
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '',
                image: '',
            })
        }
        setDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (editingCollection) {
                const result = await updateCollection(editingCollection.id, formData)
                if (result.success) {
                    toast.success('Collection updated successfully')
                } else {
                    toast.error(result.error || 'Failed to update collection')
                    return
                }
            } else {
                const result = await createCollection(formData)
                if (result.success) {
                    toast.success('Collection created successfully')
                } else {
                    toast.error(result.error || 'Failed to create collection')
                    return
                }
            }

            setDialogOpen(false)
            loadCollections()
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return

        try {
            const result = await deleteCollection(id)
            if (result.success) {
                toast.success('Collection deleted successfully')
                loadCollections()
            } else {
                toast.error(result.error || 'Failed to delete collection')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    const handleToggleActive = async (collection: Collection) => {
        try {
            const result = await updateCollection(collection.id, {
                isActive: !collection.isActive,
            })
            if (result.success) {
                toast.success(
                    `Collection ${!collection.isActive ? 'activated' : 'deactivated'}`
                )
                loadCollections()
            } else {
                toast.error(result.error || 'Failed to update collection')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        })
    }

    return (
        <div className="dashboard-card p-6 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">All Collections</h3>
                    <p className="text-sm text-muted-foreground">
                        {collections.length} collection{collections.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collection
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : collections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No collections yet. Create your first collection to get started.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Categories</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {collections.map((collection) => (
                                <TableRow key={collection.id}>
                                    <TableCell>
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {collection.icon && (
                                                <span className="text-xl">{collection.icon}</span>
                                            )}
                                            {collection.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {collection.slug}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {collection._count?.categories || 0} categories
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={collection.isActive ? 'default' : 'secondary'}>
                                            {collection.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleActive(collection)}
                                            >
                                                {collection.isActive ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenDialog(collection)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(collection.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCollection ? 'Edit Collection' : 'Create Collection'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCollection
                                    ? 'Update collection details'
                                    : 'Add a new collection to organize your products'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g., Textures, Models, HDRIs"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    placeholder="e.g., textures, models, hdris"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL-friendly version of the name
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Brief description of this collection"
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icon (Emoji or Lucide name)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) =>
                                        setFormData({ ...formData, icon: e.target.value })
                                    }
                                    placeholder="e.g., 🎨 or Image"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({ ...formData, image: e.target.value })
                                    }
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingCollection ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
