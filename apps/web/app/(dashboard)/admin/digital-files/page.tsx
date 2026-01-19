'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SearchIcon } from 'lucide-react'
import { getDigitalFiles } from '@/actions/admin'
import { toast } from 'sonner'

export default function DigitalFilesPage() {
    const [files, setFiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    const fetchFiles = async () => {
        setLoading(true)
        try {
            const result = await getDigitalFiles(page, pageSize, search)
            setFiles(result.data)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load files')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [page])

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Digital Files</h3>
                            <p className="dashboard-card-description">
                                Manage uploaded digital files
                            </p>
                        </div>
                        <div className="mt-6 flex gap-4">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search files..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
                                />
                            </div>
                            <Button onClick={fetchFiles}>Search</Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Uploader</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Uploaded</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : files.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">No files found</TableCell>
                                        </TableRow>
                                    ) : (
                                        files.map((file) => (
                                            <TableRow key={file.id}>
                                                <TableCell className="font-medium">{file.name}</TableCell>
                                                <TableCell>{file.product?.name || 'N/A'}</TableCell>
                                                <TableCell>{file.uploader.name || file.uploader.email}</TableCell>
                                                <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                                                <TableCell>
                                                    <Badge variant={file.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                                        {file.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {files.length} of {total} files
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
        </div>
    )
}
