'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    getCannedResponses,
    createCannedResponse,
    updateCannedResponse,
    deleteCannedResponse,
    getCannedResponseCategories,
} from '@/actions/canned-responses'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, Zap, Copy } from 'lucide-react'

export default function CannedResponsesPage() {
    const [responses, setResponses] = useState<any[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingResponse, setEditingResponse] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: '',
        shortcut: '',
        content: '',
        category: '',
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [responsesResult, categoriesResult] = await Promise.all([
                getCannedResponses(selectedCategory === 'all' ? undefined : selectedCategory),
                getCannedResponseCategories(),
            ])

            if (responsesResult.success) {
                setResponses(responsesResult.data || [])
            }
            if (categoriesResult.success) {
                setCategories(categoriesResult.data || [])
            }
        } catch (error) {
            toast.error('Failed to load canned responses')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedCategory])

    const filteredResponses = responses.filter(
        (r) =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.shortcut.toLowerCase().includes(search.toLowerCase()) ||
            r.content.toLowerCase().includes(search.toLowerCase())
    )

    const handleOpenDialog = (response?: any) => {
        if (response) {
            setEditingResponse(response)
            setFormData({
                title: response.title,
                shortcut: response.shortcut,
                content: response.content,
                category: response.category || '',
            })
        } else {
            setEditingResponse(null)
            setFormData({ title: '', shortcut: '', content: '', category: '' })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        if (!formData.title || !formData.shortcut || !formData.content) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            if (editingResponse) {
                const result = await updateCannedResponse(editingResponse.id, formData)
                if (result.success) {
                    toast.success('Response updated successfully')
                } else {
                    toast.error(result.error || 'Failed to update response')
                    return
                }
            } else {
                const result = await createCannedResponse(formData)
                if (result.success) {
                    toast.success('Response created successfully')
                } else {
                    toast.error(result.error || 'Failed to create response')
                    return
                }
            }
            setIsDialogOpen(false)
            fetchData()
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this response?')) return

        try {
            const result = await deleteCannedResponse(id)
            if (result.success) {
                toast.success('Response deleted successfully')
                fetchData()
            } else {
                toast.error('Failed to delete response')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content)
        toast.success('Copied to clipboard')
    }

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-500" />
                        Canned Responses
                    </h1>
                    <p className="text-muted-foreground">
                        Create quick reply templates for faster support
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Response
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingResponse ? 'Edit Response' : 'New Canned Response'}
                            </DialogTitle>
                            <DialogDescription>
                                Create a template response for quick replies. Use the shortcut to quickly insert it during chats.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title *</label>
                                <Input
                                    placeholder="e.g., Greeting"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Shortcut *</label>
                                <Input
                                    placeholder="e.g., /greet"
                                    value={formData.shortcut}
                                    onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Type this shortcut in chat to quickly insert the response
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                    placeholder="e.g., Greetings, Sales, Support"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content *</label>
                                <Textarea
                                    placeholder="Enter the response content..."
                                    rows={5}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>
                                {editingResponse ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search responses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Responses Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Shortcut</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredResponses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No canned responses found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResponses.map((response) => (
                                    <TableRow key={response.id}>
                                        <TableCell className="font-medium">{response.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{response.shortcut}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {response.category ? (
                                                <Badge variant="outline">{response.category}</Badge>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <p className="truncate text-sm text-muted-foreground">
                                                {response.content}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleCopy(response.content)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenDialog(response)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(response.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
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
