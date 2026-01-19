'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { toast } from 'sonner'
import {
    Mail, Plus, Send, Clock, Users, Eye,
    MousePointer, Pencil, Trash2, Search, Play, Pause
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// Note: Email campaign actions would be imported here
// For now, using local state

export default function EmailCampaignPage() {
    const [campaigns, setCampaigns] = useState<any[]>([
        {
            id: '1',
            name: 'Welcome Series',
            subject: 'Welcome to our platform!',
            status: 'SENT',
            totalSent: 1250,
            totalOpened: 890,
            totalClicked: 320,
            sentAt: new Date(Date.now() - 86400000 * 2),
        },
        {
            id: '2',
            name: 'New Feature Announcement',
            subject: 'Check out our new live chat feature',
            status: 'SCHEDULED',
            scheduledAt: new Date(Date.now() + 86400000),
            totalSent: 0,
            totalOpened: 0,
            totalClicked: 0,
        },
        {
            id: '3',
            name: 'Holiday Promotion',
            subject: 'Special holiday offers just for you',
            status: 'DRAFT',
            totalSent: 0,
            totalOpened: 0,
            totalClicked: 0,
        },
    ])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        content: '',
        recipientType: 'all',
    })

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SENT': return 'bg-green-500'
            case 'SCHEDULED': return 'bg-blue-500'
            case 'SENDING': return 'bg-yellow-500'
            case 'DRAFT': return 'bg-gray-500'
            case 'CANCELLED': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const handleCreate = () => {
        if (!formData.name || !formData.subject || !formData.content) {
            toast.error('Please fill in all required fields')
            return
        }

        setCampaigns([
            ...campaigns,
            {
                id: Date.now().toString(),
                ...formData,
                status: 'DRAFT',
                totalSent: 0,
                totalOpened: 0,
                totalClicked: 0,
                createdAt: new Date(),
            },
        ])
        setIsDialogOpen(false)
        setFormData({ name: '', subject: '', content: '', recipientType: 'all' })
        toast.success('Campaign created successfully')
    }

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="h-6 w-6 text-purple-500" />
                        Email Campaigns
                    </h1>
                    <p className="text-muted-foreground">
                        Create and manage email marketing campaigns
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Email Campaign</DialogTitle>
                            <DialogDescription>
                                Create a new email campaign to send to your subscribers
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Campaign Name *</label>
                                <Input
                                    placeholder="e.g., Holiday Promotion"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject Line *</label>
                                <Input
                                    placeholder="e.g., Special offer just for you!"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Recipients</label>
                                <Select
                                    value={formData.recipientType}
                                    onValueChange={(value) => setFormData({ ...formData, recipientType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Subscribers</SelectItem>
                                        <SelectItem value="customers">Customers Only</SelectItem>
                                        <SelectItem value="vendors">Vendors Only</SelectItem>
                                        <SelectItem value="inactive">Inactive Users</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Content *</label>
                                <Textarea
                                    placeholder="Write your email content here..."
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate}>
                                Create Campaign
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{campaigns.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {campaigns.reduce((sum, c) => sum + c.totalSent, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {campaigns.filter(c => c.totalSent > 0).length > 0
                                ? Math.round(
                                    (campaigns.reduce((sum, c) => sum + c.totalOpened, 0) /
                                        campaigns.reduce((sum, c) => sum + c.totalSent, 0)) * 100
                                ) + '%'
                                : '—'
                            }
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {campaigns.filter(c => c.totalOpened > 0).length > 0
                                ? Math.round(
                                    (campaigns.reduce((sum, c) => sum + c.totalClicked, 0) /
                                        campaigns.reduce((sum, c) => sum + c.totalOpened, 0)) * 100
                                ) + '%'
                                : '—'
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Campaigns Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sent</TableHead>
                                <TableHead>Opened</TableHead>
                                <TableHead>Clicked</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No campaigns found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCampaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{campaign.name}</p>
                                                <p className="text-sm text-muted-foreground truncate max-w-xs">
                                                    {campaign.subject}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Send className="h-4 w-4 text-muted-foreground" />
                                                {campaign.totalSent.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                                {campaign.totalOpened.toLocaleString()}
                                                {campaign.totalSent > 0 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        ({Math.round((campaign.totalOpened / campaign.totalSent) * 100)}%)
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MousePointer className="h-4 w-4 text-muted-foreground" />
                                                {campaign.totalClicked.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {campaign.sentAt
                                                ? formatDistanceToNow(new Date(campaign.sentAt), { addSuffix: true })
                                                : campaign.scheduledAt
                                                    ? `Scheduled ${formatDistanceToNow(new Date(campaign.scheduledAt), { addSuffix: true })}`
                                                    : '—'
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {campaign.status === 'DRAFT' && (
                                                    <Button variant="ghost" size="icon">
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
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
