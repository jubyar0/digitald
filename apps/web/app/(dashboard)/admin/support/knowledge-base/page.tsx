'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getArticles, createArticle, updateArticle, deleteArticle } from '@/actions/knowledge-base'

export default function KnowledgeBasePage() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        tags: '',
        isActive: true,
    })
    const [saving, setSaving] = useState(false)

    const fetchArticles = async () => {
        setLoading(true)
        const result = await getArticles(1, 50, search)
        if (result.success) {
            setArticles(result.data || [])
        } else {
            toast.error('Failed to load articles')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchArticles()
    }, [search])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (editingArticle) {
                const result = await updateArticle(editingArticle.id, formData)
                if (result.success) {
                    toast.success('Article updated')
                    setIsDialogOpen(false)
                    fetchArticles()
                } else {
                    toast.error('Failed to update article')
                }
            } else {
                const result = await createArticle(formData)
                if (result.success) {
                    toast.success('Article created')
                    setIsDialogOpen(false)
                    fetchArticles()
                } else {
                    toast.error('Failed to create article')
                }
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return

        const result = await deleteArticle(id)
        if (result.success) {
            toast.success('Article deleted')
            fetchArticles()
        } else {
            toast.error('Failed to delete article')
        }
    }

    const openEditDialog = (article: any) => {
        setEditingArticle(article)
        setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            tags: article.tags.join(', '),
            isActive: article.isActive,
        })
        setIsDialogOpen(true)
    }

    const openCreateDialog = () => {
        setEditingArticle(null)
        setFormData({
            title: '',
            content: '',
            category: '',
            tags: '',
            isActive: true,
        })
        setIsDialogOpen(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Knowledge Base</h1>
                <Button onClick={openCreateDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search articles..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No articles found
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>{article.category}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {article.tags.map((tag: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${article.isActive
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                }`}
                                        >
                                            {article.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(article)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => handleDelete(article.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingArticle ? 'Edit Article' : 'New Article'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Input
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                                placeholder="e.g., General, Billing, Technical"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                className="min-h-[200px]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (comma separated)</label>
                            <Input
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                                placeholder="e.g., refund, policy, how-to"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Active</label>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isActive: checked })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Save Article
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
