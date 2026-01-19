// actions/page-builder.ts
'use server';

import { requireAdmin as authRequireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { PageSchema } from '@/lib/page-builder/types';
import { Prisma } from '@repo/database';

// ============================================
// Helper: XSS Sanitization
// ============================================

function sanitizeSchema(schema: unknown): unknown {
    if (typeof schema === 'string') {
        return schema
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=/gi, 'data-blocked=')
            .replace(/javascript:/gi, 'blocked:');
    }
    if (Array.isArray(schema)) {
        return schema.map(sanitizeSchema);
    }
    if (schema && typeof schema === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(schema)) {
            if (['dangerouslySetInnerHTML', '__html', 'ref'].includes(key)) continue;
            result[key] = sanitizeSchema(value);
        }
        return result;
    }
    return schema;
}

// ============================================
// Helper: Auth Check
// ============================================

async function requireAdmin() {
    return authRequireAdmin();
}

// ============================================
// Helper: Generate CUID-like ID
// ============================================
function generateId(): string {
    return 'c' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ============================================
// RAW SQL QUERIES - Bypassing Prisma model issues
// ============================================

interface BuilderPage {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: unknown;
    status: string;
    version: number;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

interface BuilderPageVersion {
    id: string;
    page_id: string;
    content: unknown;
    version: number;
    created_at: Date;
}

// ============================================
// CRUD Actions using Raw SQL
// ============================================

/**
 * Create a new page
 */
export async function createPage(data: {
    title: string;
    slug: string;
    description?: string;
}): Promise<{ id: string; slug: string }> {
    await requireAdmin();

    // Check if slug already exists
    const existing = await prisma.$queryRaw<BuilderPage[]>`
        SELECT id FROM builder_pages WHERE slug = ${data.slug} LIMIT 1
    `;

    if (existing.length > 0) {
        throw new Error('A page with this slug already exists');
    }

    const pageId = generateId();
    const now = new Date();
    const initialSchema: PageSchema = {
        version: '1.0.0',
        pageId: pageId,
        slug: data.slug,
        title: data.title,
        description: data.description,
        seo: {
            title: data.title,
            description: data.description || '',
        },
        elements: [],
        status: 'draft',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
    };

    await prisma.$executeRaw`
        INSERT INTO builder_pages (id, slug, title, description, content, status, version, created_at, updated_at)
        VALUES (${pageId}, ${data.slug}, ${data.title}, ${data.description || null}, ${JSON.stringify(initialSchema)}::jsonb, 'draft', 1, ${now}, ${now})
    `;

    return { id: pageId, slug: data.slug };
}

/**
 * Get a page by ID (for editing)
 */
export async function getPageById(pageId: string): Promise<PageSchema | null> {
    await requireAdmin();

    const pages = await prisma.$queryRaw<BuilderPage[]>`
        SELECT * FROM builder_pages WHERE id = ${pageId} LIMIT 1
    `;

    if (pages.length === 0) return null;

    try {
        const content = typeof pages[0].content === 'string'
            ? JSON.parse(pages[0].content)
            : pages[0].content;
        return content as PageSchema;
    } catch {
        console.error('Failed to parse page content');
        return null;
    }
}

/**
 * Get a published page by slug (for frontend)
 */
export async function getPublishedPage(slug: string): Promise<PageSchema | null> {
    const pages = await prisma.$queryRaw<BuilderPage[]>`
        SELECT * FROM builder_pages WHERE slug = ${slug} AND status = 'published' LIMIT 1
    `;

    if (pages.length === 0) return null;

    try {
        const content = typeof pages[0].content === 'string'
            ? JSON.parse(pages[0].content)
            : pages[0].content;
        return content as PageSchema;
    } catch {
        console.error('Failed to parse page content');
        return null;
    }
}

/**
 * Save/update a page
 */
export async function savePage(schema: PageSchema): Promise<{ success: boolean; version: number }> {
    await requireAdmin();

    const existing = await prisma.$queryRaw<BuilderPage[]>`
        SELECT * FROM builder_pages WHERE id = ${schema.pageId} LIMIT 1
    `;

    if (existing.length === 0) {
        throw new Error('Page not found');
    }

    const sanitized = sanitizeSchema(schema) as PageSchema;
    sanitized.updatedAt = new Date().toISOString();
    const newVersion = existing[0].version + 1;
    const now = new Date();

    await prisma.$executeRaw`
        UPDATE builder_pages 
        SET slug = ${sanitized.slug}, 
            title = ${sanitized.title}, 
            description = ${sanitized.description || null},
            content = ${JSON.stringify(sanitized)}::jsonb,
            status = ${sanitized.status},
            version = ${newVersion},
            updated_at = ${now}
        WHERE id = ${schema.pageId}
    `;

    // Create version history
    const versionId = generateId();
    await prisma.$executeRaw`
        INSERT INTO builder_page_versions (id, page_id, content, version, created_at)
        VALUES (${versionId}, ${schema.pageId}, ${JSON.stringify(sanitized)}::jsonb, ${newVersion}, ${now})
    `;

    return { success: true, version: newVersion };
}

/**
 * Publish a page
 */
export async function publishPage(pageId: string): Promise<{ success: boolean }> {
    await requireAdmin();

    const pages = await prisma.$queryRaw<BuilderPage[]>`
        SELECT * FROM builder_pages WHERE id = ${pageId} LIMIT 1
    `;

    if (pages.length === 0) {
        throw new Error('Page not found');
    }

    const content = typeof pages[0].content === 'string'
        ? JSON.parse(pages[0].content)
        : pages[0].content;

    const schema = content as PageSchema;
    schema.status = 'published';
    schema.publishedAt = new Date().toISOString();
    schema.updatedAt = new Date().toISOString();
    const now = new Date();

    await prisma.$executeRaw`
        UPDATE builder_pages 
        SET content = ${JSON.stringify(schema)}::jsonb,
            status = 'published',
            published_at = ${now},
            updated_at = ${now}
        WHERE id = ${pageId}
    `;

    return { success: true };
}

/**
 * Unpublish a page
 */
export async function unpublishPage(pageId: string): Promise<{ success: boolean }> {
    await requireAdmin();

    const pages = await prisma.$queryRaw<BuilderPage[]>`
        SELECT * FROM builder_pages WHERE id = ${pageId} LIMIT 1
    `;

    if (pages.length === 0) {
        throw new Error('Page not found');
    }

    const content = typeof pages[0].content === 'string'
        ? JSON.parse(pages[0].content)
        : pages[0].content;

    const schema = content as PageSchema;
    schema.status = 'draft';
    schema.updatedAt = new Date().toISOString();
    const now = new Date();

    await prisma.$executeRaw`
        UPDATE builder_pages 
        SET content = ${JSON.stringify(schema)}::jsonb,
            status = 'draft',
            updated_at = ${now}
        WHERE id = ${pageId}
    `;

    return { success: true };
}

/**
 * Delete a page
 */
export async function deletePage(pageId: string): Promise<{ success: boolean }> {
    await requireAdmin();

    // Delete versions first
    await prisma.$executeRaw`DELETE FROM builder_page_versions WHERE page_id = ${pageId}`;
    await prisma.$executeRaw`DELETE FROM builder_pages WHERE id = ${pageId}`;

    return { success: true };
}

/**
 * Get all pages (for listing)
 */
export async function getAllPages(): Promise<Array<{
    id: string;
    slug: string;
    title: string;
    status: string;
    version: number;
    updatedAt: Date;
}>> {
    await requireAdmin();

    const pages = await prisma.$queryRaw<BuilderPage[]>`
        SELECT id, slug, title, status, version, updated_at 
        FROM builder_pages 
        ORDER BY updated_at DESC
    `;

    return pages.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        status: p.status,
        version: p.version,
        updatedAt: p.updated_at,
    }));
}

/**
 * Get page versions
 */
export async function getPageVersions(pageId: string): Promise<Array<{
    id: string;
    version: number;
    createdAt: Date;
}>> {
    await requireAdmin();

    const versions = await prisma.$queryRaw<BuilderPageVersion[]>`
        SELECT id, version, created_at 
        FROM builder_page_versions 
        WHERE page_id = ${pageId}
        ORDER BY version DESC
        LIMIT 20
    `;

    return versions.map((v) => ({
        id: v.id,
        version: v.version,
        createdAt: v.created_at,
    }));
}

/**
 * Restore a specific version
 */
export async function restoreVersion(pageId: string, versionId: string): Promise<{ success: boolean }> {
    await requireAdmin();

    const versions = await prisma.$queryRaw<BuilderPageVersion[]>`
        SELECT * FROM builder_page_versions WHERE id = ${versionId} AND page_id = ${pageId} LIMIT 1
    `;

    if (versions.length === 0) {
        throw new Error('Version not found');
    }

    const pages = await prisma.$queryRaw<BuilderPage[]>`
        SELECT * FROM builder_pages WHERE id = ${pageId} LIMIT 1
    `;

    if (pages.length === 0) {
        throw new Error('Page not found');
    }

    const newVersion = pages[0].version + 1;
    const content = typeof versions[0].content === 'string'
        ? JSON.parse(versions[0].content)
        : versions[0].content;

    const schema = content as PageSchema;
    schema.updatedAt = new Date().toISOString();
    const now = new Date();

    await prisma.$executeRaw`
        UPDATE builder_pages 
        SET content = ${JSON.stringify(schema)}::jsonb,
            version = ${newVersion},
            updated_at = ${now}
        WHERE id = ${pageId}
    `;

    // Create new version entry for the restoration
    const newVersionId = generateId();
    await prisma.$executeRaw`
        INSERT INTO builder_page_versions (id, page_id, content, version, created_at)
        VALUES (${newVersionId}, ${pageId}, ${JSON.stringify(schema)}::jsonb, ${newVersion}, ${now})
    `;

    return { success: true };
}
