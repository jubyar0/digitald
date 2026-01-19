// app/admin/page-builder/new/page.tsx
// Create New Page Form
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPage } from '@/actions/page-builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export default function NewPageBuilderPage() {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!slugManuallyEdited) {
            setSlug(generateSlug(value));
        }
    };

    const handleSlugChange = (value: string) => {
        setSlugManuallyEdited(true);
        setSlug(generateSlug(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter a page title');
            return;
        }

        if (!slug.trim()) {
            toast.error('Please enter a page slug');
            return;
        }

        setIsCreating(true);
        try {
            const result = await createPage({
                title: title.trim(),
                slug: slug.trim(),
                description: description.trim() || undefined,
            });

            toast.success('Page created successfully');
            router.push(`/admin/page-builder/${result.id}`);
        } catch (error) {
            console.error('Failed to create page:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create page');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="container max-w-2xl py-8">
            <Link
                href="/admin/page-builder"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pages
            </Link>

            <h1 className="text-3xl font-bold mb-2">Create New Page</h1>
            <p className="text-muted-foreground mb-8">
                Set up the basic information for your new page, then you&apos;ll be taken to the visual editor.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., About Us, Services, Contact"
                        disabled={isCreating}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">/p/</span>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="page-url-slug"
                            disabled={isCreating}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        This will be the URL path for your page
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of this page..."
                        disabled={isCreating}
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/admin/page-builder">
                        <Button type="button" variant="outline" disabled={isCreating}>
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isCreating || !title.trim() || !slug.trim()}>
                        {isCreating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create & Open Editor'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
