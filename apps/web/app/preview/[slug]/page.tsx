// app/preview/[slug]/page.tsx
// Live preview page for the page builder - receives real-time updates from editor
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PageRenderer } from '@/lib/page-builder/renderer';
import type { PageSchema, PageElement } from '@/lib/page-builder/types';
import '@/lib/page-builder/components'; // Register components

export default function PreviewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const editor = searchParams?.get('editor');

    const [elements, setElements] = useState<PageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isEditorMode = editor === 'true';

    // Listen for messages from parent editor iframe
    useEffect(() => {
        if (!isEditorMode) return;

        const handleMessage = (event: MessageEvent) => {
            // Verify origin for security
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'PAGE_BUILDER_SYNC') {
                const schema = event.data.schema as PageSchema;
                if (schema?.elements) {
                    setElements(schema.elements);
                    setIsLoading(false);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        // Signal that we're ready to receive updates
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'PAGE_BUILDER_PREVIEW_READY' }, window.location.origin);
        }

        return () => window.removeEventListener('message', handleMessage);
    }, [isEditorMode]);

    // Fetch initial page data from API if not in editor mode
    useEffect(() => {
        if (isEditorMode || !slug) return;

        const fetchPage = async () => {
            try {
                const res = await fetch(`/api/page-builder/preview/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setElements(data.elements || []);
                }
            } catch (error) {
                console.error('Failed to fetch page:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPage();
    }, [slug, isEditorMode]);

    if (isLoading && !isEditorMode) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (elements.length === 0 && isEditorMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">Waiting for content...</p>
                    <p className="text-sm">Add components in the editor to see them here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <PageRenderer elements={elements} device="desktop" isEditor={false} />
        </div>
    );
}
