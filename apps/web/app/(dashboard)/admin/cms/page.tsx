'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
} from '@/components/ui/select'
import { getCmsPages, createCmsPage, updateCmsPage, deleteCmsPage } from '@/actions/admin'
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
import { useSession } from 'next-auth/react'

interface CmsPageType {
    id: string
    title: string
    slug: string
    content: string
    status: 'DRAFT' | 'PUBLISHED'
    createdAt: Date
    author: {
        name: string | null
    }
}

export default function CmsPage() {
    const { data: session } = useSession()
    const [pages, setPages] = useState<CmsPageType[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [addTitle, setAddTitle] = useState('')
    const [addSlug, setAddSlug] = useState('')
    const [addContent, setAddContent] = useState('')
    const [addStatus, setAddStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
    const [adding, setAdding] = useState(false)

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editPage, setEditPage] = useState<CmsPageType | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editSlug, setEditSlug] = useState('')
    const [editContent, setEditContent] = useState('')
    const [editStatus, setEditStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
    const [editing, setEditing] = useState(false)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [pageToDelete, setPageToDelete] = useState<CmsPageType | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchPages = async () => {
        setLoading(true)
        try {
            const result = await getCmsPages(page, pageSize)
            setPages(result.data as any)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load CMS pages')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPages()
    }, [page])

    const handleAddClick = () => {
        setAddTitle('')
        setAddSlug('')
        setAddContent('')
        setAddStatus('DRAFT')
        setAddDialogOpen(true)
    }

    const handleAddPage = async () => {
        if (!addTitle.trim() || !addSlug.trim() || !addContent.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!session?.user?.id) {
            toast.error('You must be logged in')
            return
        }

        setAdding(true)
        try {
            await createCmsPage(addTitle, addSlug, addContent, session.user.id, addStatus)
            toast.success('Page created successfully')
            setAddDialogOpen(false)
            fetchPages()
        } catch (error) {
            toast.error('Failed to create page')
        } finally {
            setAdding(false)
        }
    }

    const handleEditClick = (p: CmsPageType) => {
        setEditPage(p)
        setEditTitle(p.title)
        setEditSlug(p.slug)
        setEditContent(p.content)
        setEditStatus(p.status)
        setEditDialogOpen(true)
    }

    const handleEditPage = async () => {
        if (!editPage || !editTitle.trim() || !editSlug.trim() || !editContent.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setEditing(true)
        try {
            await updateCmsPage(editPage.id, {
                title: editTitle,
                slug: editSlug,
                content: editContent,
                status: editStatus,
            })
            toast.success('Page updated successfully')
            setEditDialogOpen(false)
            fetchPages()
        } catch (error) {
            toast.error('Failed to update page')
        } finally {
            setEditing(false)
        }
    }

    const handleDeleteClick = (p: CmsPageType) => {
        setPageToDelete(p)
        setDeleteDialogOpen(true)
    }

    const handleDeletePage = async () => {
        if (!pageToDelete) return

        setDeleting(true)
        try {
            await deleteCmsPage(pageToDelete.id)
            toast.success('Page deleted successfully')
            setDeleteDialogOpen(false)
            fetchPages()
        } catch (error) {
            toast.error('Failed to delete page')
        } finally {
            setDeleting(false)
        }
    }

    const generateSlug = (title: string) => {
        return title
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
                            <h3 className="dashboard-card-title">CMS Pages</h3>
                            <p className="dashboard-card-description">
                                Manage content pages
                            </p>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAddClick}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Page
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : pages.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">No pages found</TableCell>
                                        </TableRow>
                                    ) : (
                                        pages.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium">{p.title}</TableCell>
                                                <TableCell>{p.slug}</TableCell>
                                                <TableCell>{p.author.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                                        {p.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditClick(p)}
                                                        >
                                                            <EditIcon className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(p)}
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
                            Showing {pages.length} of {total} pages
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

            {/* Add Page Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add CMS Page</DialogTitle>
                        <DialogDescription>
                            Create a new content page
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="addTitle">Title *</Label>
                            <Input
                                id="addTitle"
                                placeholder="Enter page title"
                                value={addTitle}
                                onChange={(e) => {
                                    setAddTitle(e.target.value)
                                    setAddSlug(generateSlug(e.target.value))
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="addSlug">Slug *</Label>
                            <Input
                                id="addSlug"
                                placeholder="page-slug"
                                value={addSlug}
                                onChange={(e) => setAddSlug(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                URL-friendly version of the title
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="addContent">Content *</Label>
                            <Textarea
                                id="addContent"
                                placeholder="Enter page content..."
                                value={addContent}
                                onChange={(e) => setAddContent(e.target.value)}
                                rows={10}
                            />
                        </div>
                        <div>
                            <Label htmlFor="addStatus">Status</Label>
                            <Select value={addStatus} onValueChange={(value: 'DRAFT' | 'PUBLISHED') => setAddStatus(value)}>
                                <SelectTrigger id="addStatus">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
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
                        <Button onClick={handleAddPage} disabled={adding}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Add Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Page Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit CMS Page</DialogTitle>
                        <DialogDescription>
                            Update page information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="editTitle">Title *</Label>
                            <Input
                                id="editTitle"
                                placeholder="Enter page title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editSlug">Slug *</Label>
                            <Input
                                id="editSlug"
                                placeholder="page-slug"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editContent">Content *</Label>
                            <Textarea
                                id="editContent"
                                placeholder="Enter page content..."
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={10}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editStatus">Status</Label>
                            <Select value={editStatus} onValueChange={(value: 'DRAFT' | 'PUBLISHED') => setEditStatus(value)}>
                                <SelectTrigger id="editStatus">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
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
                        <Button onClick={handleEditPage} disabled={editing}>
                            {editing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Update Page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Page Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the page{' '}
                            <span className="font-semibold">{pageToDelete?.title}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePage}
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
