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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } from '@/actions/admin'
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

interface Category {
    id: string
    name: string
    slug: string
    isActive: boolean
    parentId?: string | null
    parent?: {
        id: string
        name: string
    } | null
    _count: {
        products: number
    }
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [addName, setAddName] = useState('')
    const [addSlug, setAddSlug] = useState('')
    const [addParentId, setAddParentId] = useState<string>('none')
    const [adding, setAdding] = useState(false)

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editCategory, setEditCategory] = useState<Category | null>(null)
    const [editName, setEditName] = useState('')
    const [editSlug, setEditSlug] = useState('')
    const [editParentId, setEditParentId] = useState<string>('none')
    const [editIsActive, setEditIsActive] = useState(true)
    const [editing, setEditing] = useState(false)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const result = await getCategories(page, pageSize)
            setCategories(result.data as any)
            setTotal(result.total)

            // Also fetch all categories for dropdown
            const all = await getAllCategories()
            setAllCategories(all)
        } catch (error) {
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [page])

    const handleAddClick = () => {
        setAddName('')
        setAddSlug('')
        setAddParentId('none')
        setAddDialogOpen(true)
    }

    const handleAddCategory = async () => {
        if (!addName.trim() || !addSlug.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setAdding(true)
        try {
            const result = await createCategory(addName, addSlug, addParentId === 'none' ? undefined : addParentId)
            if (result.success) {
                toast.success('Category created successfully')
                setAddDialogOpen(false)
                fetchCategories()
            } else {
                toast.error(result.error || 'Failed to create category')
            }
        } catch (error) {
            toast.error('Failed to create category')
        } finally {
            setAdding(false)
        }
    }

    const handleEditClick = (category: Category) => {
        setEditCategory(category)
        setEditName(category.name)
        setEditSlug(category.slug)
        setEditParentId(category.parentId || 'none')
        setEditIsActive(category.isActive)
        setEditDialogOpen(true)
    }

    const handleEditCategory = async () => {
        if (!editCategory || !editName.trim() || !editSlug.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setEditing(true)
        try {
            await updateCategory(editCategory.id, editName, editSlug, editIsActive, editParentId === 'none' ? null : editParentId)
            toast.success('Category updated successfully')
            setEditDialogOpen(false)
            fetchCategories()
        } catch (error) {
            toast.error('Failed to update category')
        } finally {
            setEditing(false)
        }
    }

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return

        setDeleting(true)
        try {
            await deleteCategory(categoryToDelete.id)
            toast.success('Category deleted successfully')
            setDeleteDialogOpen(false)
            fetchCategories()
        } catch (error) {
            toast.error('Failed to delete category')
        } finally {
            setDeleting(false)
        }
    }

    // Auto-generate slug from name
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
                            <h3 className="dashboard-card-title">Categories</h3>
                            <p className="dashboard-card-description">
                                Manage product categories
                            </p>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAddClick}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Parent</TableHead>
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
                                    ) : categories.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">No categories found</TableCell>
                                        </TableRow>
                                    ) : (
                                        categories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-medium">{category.name}</TableCell>
                                                <TableCell>
                                                    {category.parent ? (
                                                        <Badge variant="outline">{category.parent.name}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{category.slug}</TableCell>
                                                <TableCell>{category._count.products}</TableCell>
                                                <TableCell>
                                                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                                                        {category.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditClick(category)}
                                                        >
                                                            <EditIcon className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(category)}
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
                            Showing {categories.length} of {total} categories
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

            {/* Add Category Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                        <DialogDescription>
                            Create a new product category
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="addName">Name *</Label>
                            <Input
                                id="addName"
                                placeholder="Enter category name"
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
                                placeholder="category-slug"
                                value={addSlug}
                                onChange={(e) => setAddSlug(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                URL-friendly version of the name
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="addParent">Parent Category</Label>
                            <Select value={addParentId} onValueChange={setAddParentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Root Category)</SelectItem>
                                    {allCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <Button onClick={handleAddCategory} disabled={adding}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Add Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update category information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="editName">Name *</Label>
                            <Input
                                id="editName"
                                placeholder="Enter category name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editSlug">Slug *</Label>
                            <Input
                                id="editSlug"
                                placeholder="category-slug"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editParent">Parent Category</Label>
                            <Select value={editParentId} onValueChange={setEditParentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Root Category)</SelectItem>
                                    {allCategories
                                        .filter(cat => cat.id !== editCategory?.id) // Prevent selecting self as parent
                                        .map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
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
                        <Button onClick={handleEditCategory} disabled={editing}>
                            {editing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Update Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category{' '}
                            <span className="font-semibold">{categoryToDelete?.name}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCategory}
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
