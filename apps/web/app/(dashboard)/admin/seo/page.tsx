'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { getSeoSettings, updateSeoSetting } from '@/actions/admin'
import { toast } from 'sonner'
import { PlusIcon, Loader2Icon, EditIcon, SearchIcon } from 'lucide-react'

interface SeoSetting {
    id: string
    page: string
    title: string | null
    description: string | null
    keywords: string | null
    author: string | null
}

export default function SeoPage() {
    const [settings, setSettings] = useState<SeoSetting[]>([])
    const [loading, setLoading] = useState(true)

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editSetting, setEditSetting] = useState<SeoSetting | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editKeywords, setEditKeywords] = useState('')
    const [editAuthor, setEditAuthor] = useState('')
    const [editing, setEditing] = useState(false)

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [addPage, setAddPage] = useState('')
    const [addTitle, setAddTitle] = useState('')
    const [addDescription, setAddDescription] = useState('')
    const [addKeywords, setAddKeywords] = useState('')
    const [addAuthor, setAddAuthor] = useState('')
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const result = await getSeoSettings()
            setSettings(result.data as any)
        } catch (error) {
            toast.error('Failed to load SEO settings')
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (setting: SeoSetting) => {
        setEditSetting(setting)
        setEditTitle(setting.title || '')
        setEditDescription(setting.description || '')
        setEditKeywords(setting.keywords || '')
        setEditAuthor(setting.author || '')
        setEditDialogOpen(true)
    }

    const handleEditSave = async () => {
        if (!editSetting) return

        setEditing(true)
        try {
            await updateSeoSetting(editSetting.page, {
                title: editTitle,
                description: editDescription,
                keywords: editKeywords,
                author: editAuthor,
            })
            toast.success('SEO settings updated successfully')
            setEditDialogOpen(false)
            fetchSettings()
        } catch (error) {
            toast.error('Failed to update SEO settings')
        } finally {
            setEditing(false)
        }
    }

    const handleAddClick = () => {
        setAddPage('')
        setAddTitle('')
        setAddDescription('')
        setAddKeywords('')
        setAddAuthor('')
        setAddDialogOpen(true)
    }

    const handleAddSave = async () => {
        if (!addPage.trim()) {
            toast.error('Please enter a page name')
            return
        }

        setAdding(true)
        try {
            await updateSeoSetting(addPage, {
                title: addTitle,
                description: addDescription,
                keywords: addKeywords,
                author: addAuthor,
            })
            toast.success('SEO settings added successfully')
            setAddDialogOpen(false)
            fetchSettings()
        } catch (error) {
            toast.error('Failed to add SEO settings')
        } finally {
            setAdding(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">SEO Management</h3>
                            <p className="dashboard-card-description">
                                Manage SEO settings for different pages
                            </p>
                        </div>
                        <div className="mt-6">
                            <Button onClick={handleAddClick}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Page SEO
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Page</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Keywords</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                <Loader2Icon className="h-6 w-6 animate-spin mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ) : settings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No SEO settings found. Click &quot;Add Page SEO&quot; to create one.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        settings.map((setting) => (
                                            <TableRow key={setting.id}>
                                                <TableCell className="font-medium">{setting.page}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {setting.title || '-'}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {setting.description || '-'}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {setting.keywords || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditClick(setting)}
                                                    >
                                                        <EditIcon className="mr-1 h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit SEO Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit SEO Settings</DialogTitle>
                        <DialogDescription>
                            Update SEO meta tags for {editSetting?.page}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="editTitle">Page Title</Label>
                            <Input
                                id="editTitle"
                                placeholder="Enter page title for search engines"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Recommended length: 50-60 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editDescription">Meta Description</Label>
                            <Textarea
                                id="editDescription"
                                placeholder="Enter meta description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                            />
                            <p className="text-sm text-muted-foreground">
                                Recommended length: 150-160 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editKeywords">Keywords</Label>
                            <Input
                                id="editKeywords"
                                placeholder="keyword1, keyword2, keyword3"
                                value={editKeywords}
                                onChange={(e) => setEditKeywords(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Separate keywords with commas
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editAuthor">Author</Label>
                            <Input
                                id="editAuthor"
                                placeholder="Author name"
                                value={editAuthor}
                                onChange={(e) => setEditAuthor(e.target.value)}
                            />
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
                        <Button onClick={handleEditSave} disabled={editing}>
                            {editing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add SEO Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add SEO Settings</DialogTitle>
                        <DialogDescription>
                            Create SEO meta tags for a new page
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="addPage">Page Name *</Label>
                            <Input
                                id="addPage"
                                placeholder="e.g., home, about, contact"
                                value={addPage}
                                onChange={(e) => setAddPage(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Unique identifier for the page
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addTitle">Page Title</Label>
                            <Input
                                id="addTitle"
                                placeholder="Enter page title for search engines"
                                value={addTitle}
                                onChange={(e) => setAddTitle(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Recommended length: 50-60 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addDescription">Meta Description</Label>
                            <Textarea
                                id="addDescription"
                                placeholder="Enter meta description"
                                value={addDescription}
                                onChange={(e) => setAddDescription(e.target.value)}
                                rows={3}
                            />
                            <p className="text-sm text-muted-foreground">
                                Recommended length: 150-160 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addKeywords">Keywords</Label>
                            <Input
                                id="addKeywords"
                                placeholder="keyword1, keyword2, keyword3"
                                value={addKeywords}
                                onChange={(e) => setAddKeywords(e.target.value)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Separate keywords with commas
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addAuthor">Author</Label>
                            <Input
                                id="addAuthor"
                                placeholder="Author name"
                                value={addAuthor}
                                onChange={(e) => setAddAuthor(e.target.value)}
                            />
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
                        <Button onClick={handleAddSave} disabled={adding}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Add SEO Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
