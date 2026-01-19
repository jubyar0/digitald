// app/admin/page-builder/page.tsx
// Page Builder - Pages List

import { Suspense } from 'react';
import Link from 'next/link';
import { getAllPages } from '@/actions/page-builder';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Globe, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

async function PagesTable() {
    const pages = await getAllPages();

    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pages Yet</h3>
                <p className="text-muted-foreground mb-6">
                    Create your first page to get started with the Page Builder.
                </p>
                <Link href="/admin/page-builder/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Page
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pages.map((page) => (
                    <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                        <TableCell>
                            <Badge
                                variant={page.status === 'published' ? 'default' : 'secondary'}
                            >
                                {page.status === 'published' && <Globe className="h-3 w-3 mr-1" />}
                                {page.status}
                            </Badge>
                        </TableCell>
                        <TableCell>v{page.version}</TableCell>
                        <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                {page.status === 'published' && (
                                    <Link href={`/p/${page.slug}`} target="_blank">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                                <Link href={`/admin/page-builder/${page.id}`}>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function PageBuilderListPage() {
    return (
        <div className="container max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Page Builder</h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage custom pages with the visual editor
                    </p>
                </div>
                <Link href="/admin/page-builder/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Page
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg bg-card">
                <Suspense
                    fallback={
                        <div className="p-8 text-center text-muted-foreground">
                            Loading pages...
                        </div>
                    }
                >
                    <PagesTable />
                </Suspense>
            </div>
        </div>
    );
}
