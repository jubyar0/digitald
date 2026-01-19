// app/admin/page-builder/[pageId]/page.tsx
// Page Builder Editor

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPageById, savePage } from '@/actions/page-builder';
import type { PageSchema } from '@/lib/page-builder/types';

// Lazy load the editor to reduce initial bundle size
const EditorLayout = dynamic(
    () => import('@/components/page-builder/editor/EditorLayout').then((mod) => mod.EditorLayout),
    {
        ssr: false,
        loading: () => (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading Page Builder...</p>
                </div>
            </div>
        ),
    }
);

interface PageEditorProps {
    params: { pageId: string };
}

export default async function PageEditorPage({ params }: PageEditorProps) {
    const schema = await getPageById(params.pageId);

    if (!schema) {
        notFound();
    }

    // Server action wrapper for saving
    async function handleSave(updatedSchema: PageSchema) {
        'use server';
        await savePage(updatedSchema);
    }

    return <EditorLayout initialSchema={schema} onSave={handleSave} />;
}
