// app/p/[slug]/page.tsx
// Frontend renderer for published pages

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedPage } from '@/actions/page-builder';
import { StaticPageRenderer } from '@/lib/page-builder/renderer';
import '@/lib/page-builder/components'; // Register all components

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const schema = await getPublishedPage(slug);

    if (!schema) {
        return { title: 'Page Not Found' };
    }

    return {
        title: schema.seo?.title || schema.title,
        description: schema.seo?.description || '',
        openGraph: {
            title: schema.seo?.title || schema.title,
            description: schema.seo?.description || '',
            images: schema.seo?.ogImage ? [schema.seo.ogImage] : undefined,
        },
        keywords: schema.seo?.keywords || [],
    };
}

export default async function PublishedPage({ params }: PageProps) {
    const { slug } = await params;
    const schema = await getPublishedPage(slug);

    if (!schema) {
        notFound();
    }

    return (
        <main className="min-h-screen">
            <StaticPageRenderer elements={schema.elements} />
        </main>
    );
}

