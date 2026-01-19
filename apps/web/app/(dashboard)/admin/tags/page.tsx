'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { getTags, createTag, updateTag, deleteTag } from '@/actions/admin'
import { toast } from 'sonner'
import { PlusIcon, Loader2Icon, EditIcon, Trash2Icon } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'

interface Tag {
    id: string
    name: string
    slug: string
    isActive: boolean
    _count: {
        products: number
    }
}

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [addName, setAddName] = useState('')
    const [addSlug, setAddSlug] = useState('')
    const [adding, setAdding] = useState(false)

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editTag, setEditTag] = useState<Tag | null>(null)
    const [editName, setEditName] = useState('')
    const [editSlug, setEditSlug] = useState('')
    const [editIsActive, setEditIsActive] = useState(true)
    const [editing, setEditing] = useState(false)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchTags = async () => {
        setLoading(true)
        try {
            const result = await getTags(page, pageSize)
            setTags(result.data as any)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load tags')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTags()
    }, [page])

    const handleAddClick = () => {
        setAddName('')
        setAddSlug('')
        setAddDialogOpen(true)
    }

    const handleAddTag = async () => {
        if (!addName.trim() || !addSlug.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setAdding(true)
        try {
            await createTag(addName, addSlug)
            toast.success('Tag created successfully')
            setAddDialogOpen(false)
            fetchTags()
        } catch (error) {
            toast.error('Failed to create tag')
        } finally {
            setAdding(false)
        }
    }

    const handleEditClick = (tag: Tag) => {
        setEditTag(tag)
        setEditName(tag.name)
        setEditSlug(tag.slug)
        setEditIsActive(tag.isActive)
        setEditDialogOpen(true)
    }

    const handleEditTag = async () => {
        if (!editTag || !editName.trim() || !editSlug.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setEditing(true)
        try {
            await updateTag(editTag.id, editName, editSlug, editIsActive)
            toast.success('Tag updated successfully')
            setEditDialogOpen(false)
            fetchTags()
        } catch (error) {
            toast.error('Failed to update tag')
        } finally {
            setEditing(false)
        }
    }

    const handleDeleteClick = (tag: Tag) => {
        setTagToDelete(tag)
        setDeleteDialogOpen(true)
    }

    const handleDeleteTag = async () => {
        if (!tagToDelete) return

        setDeleting(true)
        try {
            await deleteTag(tagToDelete.id)
            toast.success('Tag deleted successfully')
            setDeleteDialogOpen(false)
            fetchTags()
        } catch (error) {
            toast.error('Failed to delete tag')
        } finally {
            setDeleting(false)
        }
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Tags</h3>
                            <p className="dashboard-card-description">
                                Manage product tags
                            </p>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAddClick}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Tag
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : tags.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">No tags found</TableCell>
                                        </TableRow>
                                    ) : (
                                        tags.map((tag) => (
                                            <TableRow key={tag.id}>
                                                <TableCell className="font-medium">{tag.name}</TableCell>
                                                <TableCell>{tag.slug}</TableCell>
                                                <TableCell>{tag._count.products}</TableCell>
                                                <TableCell>
                                                    <Badge variant={tag.isActive ? 'default' : 'secondary'}>
                                                        {tag.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditClick(tag)}
                                                        >
                                                            <EditIcon className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(tag)}
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
                            Showing {tags.length} of {total} tags
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

            {/* Add Tag Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Tag</DialogTitle>
                        <DialogDescription>
                            Create a new product tag
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="addName">Name *</Label>
                            <Input
                                id="addName"
                                placeholder="Enter tag name"
                                value={addName}
                                onChange={(e) => {
                                    setAddName(e.target.value)
                                    setAddSlug(generateSlug(e.target.value))
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="addSlug">Slug *</Label>
                            <Input
                                id="addSlug"
                                placeholder="tag-slug"
                                value={addSlug}
                                onChange={(e) => setAddSlug(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                URL-friendly version of the name
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAddDialogOpen(false)}
                            disabled={adding}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddTag} disabled={adding}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Add Tag
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Tag Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>
                            Update tag information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="editName">Name *</Label>
                            <Input
                                id="editName"
                                placeholder="Enter tag name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editSlug">Slug *</Label>
                            <Input
                                id="editSlug"
                                placeholder="tag-slug"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="editIsActive"
                                checked={editIsActive}
                                onCheckedChange={setEditIsActive}
                            />
                            <Label htmlFor="editIsActive">Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={editing}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEditTag} disabled={editing}>
                            {editing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Update Tag
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Tag Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the tag{' '}
                            <span className="font-semibold">{tagToDelete?.name}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTag}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
