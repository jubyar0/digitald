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
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/actions/admin'
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

interface Announcement {
    id: string
    title: string
    content: string
    status: 'DRAFT' | 'PUBLISHED'
    priority: number
    createdAt: Date
    startDate: Date | null
    endDate: Date | null
    author: {
        name: string | null
    }
}

export default function AnnouncementsPage() {
    const { data: session } = useSession()
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [addTitle, setAddTitle] = useState('')
    const [addContent, setAddContent] = useState('')
    const [addStatus, setAddStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
    const [addPriority, setAddPriority] = useState('0')
    const [adding, setAdding] = useState(false)

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editContent, setEditContent] = useState('')
    const [editStatus, setEditStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
    const [editPriority, setEditPriority] = useState('0')
    const [editing, setEditing] = useState(false)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            const result = await getAnnouncements(page, pageSize)
            setAnnouncements(result.data as any)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load announcements')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [page])

    const handleAddClick = () => {
        setAddTitle('')
        setAddContent('')
        setAddStatus('DRAFT')
        setAddPriority('0')
        setAddDialogOpen(true)
    }

    const handleAddAnnouncement = async () => {
        if (!addTitle.trim() || !addContent.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!session?.user?.id) {
            toast.error('You must be logged in')
            return
        }

        setAdding(true)
        try {
            await createAnnouncement(
                addTitle,
                addContent,
                session.user.id,
                addStatus,
                parseInt(addPriority)
            )
            toast.success('Announcement created successfully')
            setAddDialogOpen(false)
            fetchAnnouncements()
        } catch (error) {
            toast.error('Failed to create announcement')
        } finally {
            setAdding(false)
        }
    }

    const handleEditClick = (announcement: Announcement) => {
        setEditAnnouncement(announcement)
        setEditTitle(announcement.title)
        setEditContent(announcement.content)
        setEditStatus(announcement.status)
        setEditPriority(announcement.priority.toString())
        setEditDialogOpen(true)
    }

    const handleEditAnnouncement = async () => {
        if (!editAnnouncement || !editTitle.trim() || !editContent.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setEditing(true)
        try {
            await updateAnnouncement(editAnnouncement.id, {
                title: editTitle,
                content: editContent,
                status: editStatus,
                priority: parseInt(editPriority),
            })
            toast.success('Announcement updated successfully')
            setEditDialogOpen(false)
            fetchAnnouncements()
        } catch (error) {
            toast.error('Failed to update announcement')
        } finally {
            setEditing(false)
        }
    }

    const handleDeleteClick = (announcement: Announcement) => {
        setAnnouncementToDelete(announcement)
        setDeleteDialogOpen(true)
    }

    const handleDeleteAnnouncement = async () => {
        if (!announcementToDelete) return

        setDeleting(true)
        try {
            await deleteAnnouncement(announcementToDelete.id)
            toast.success('Announcement deleted successfully')
            setDeleteDialogOpen(false)
            fetchAnnouncements()
        } catch (error) {
            toast.error('Failed to delete announcement')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Announcements</h3>
                            <p className="dashboard-card-description">
                                Manage platform announcements
                            </p>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAddClick}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Announcement
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Priority</TableHead>
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
                                    ) : announcements.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">No announcements found</TableCell>
                                        </TableRow>
                                    ) : (
                                        announcements.map((announcement) => (
                                            <TableRow key={announcement.id}>
                                                <TableCell className="font-medium">{announcement.title}</TableCell>
                                                <TableCell>{announcement.author.name}</TableCell>
                                                <TableCell>{announcement.priority}</TableCell>
                                                <TableCell>
                                                    <Badge variant={announcement.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                                        {announcement.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditClick(announcement)}
                                                        >
                                                            <EditIcon className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(announcement)}
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
                            Showing {announcements.length} of {total} announcements
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

            {/* Add Announcement Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Announcement</DialogTitle>
                        <DialogDescription>
                            Create a new platform announcement
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="addTitle">Title *</Label>
                            <Input
                                id="addTitle"
                                placeholder="Enter announcement title"
                                value={addTitle}
                                onChange={(e) => setAddTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addContent">Content *</Label>
                            <Textarea
                                id="addContent"
                                placeholder="Enter announcement content..."
                                value={addContent}
                                onChange={(e) => setAddContent(e.target.value)}
                                rows={6}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
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

                            <div className="space-y-2">
                                <Label htmlFor="addPriority">Priority</Label>
                                <Input
                                    id="addPriority"
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={addPriority}
                                    onChange={(e) => setAddPriority(e.target.value)}
                                />
                            </div>
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
                        <Button onClick={handleAddAnnouncement} disabled={adding}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Add Announcement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Announcement Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Announcement</DialogTitle>
                        <DialogDescription>
                            Update announcement information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="editTitle">Title *</Label>
                            <Input
                                id="editTitle"
                                placeholder="Enter announcement title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editContent">Content *</Label>
                            <Textarea
                                id="editContent"
                                placeholder="Enter announcement content..."
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={6}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
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

                            <div className="space-y-2">
                                <Label htmlFor="editPriority">Priority</Label>
                                <Input
                                    id="editPriority"
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                />
                            </div>
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
                        <Button onClick={handleEditAnnouncement} disabled={editing}>
                            {editing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Update Announcement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Announcement Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the announcement{' '}
                            <span className="font-semibold">{announcementToDelete?.title}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAnnouncement}
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
