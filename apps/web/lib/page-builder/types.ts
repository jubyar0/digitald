// lib/page-builder/types.ts
// Core TypeScript types for Page Builder system

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveValue<T> {
    desktop: T;
    tablet?: T;
    mobile?: T;
}

export interface SpacingValue {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface TypographyProps {
    fontFamily?: string;
    fontSize?: ResponsiveValue<number>;
    fontWeight?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
}

export interface ElementStyles {
    padding?: ResponsiveValue<SpacingValue>;
    margin?: ResponsiveValue<SpacingValue>;
    backgroundColor?: string;
    backgroundImage?: string;
    borderRadius?: number;
    border?: string;
    boxShadow?: string;
    width?: ResponsiveValue<string>;
    height?: ResponsiveValue<string>;
    display?: string;
    flexDirection?: ResponsiveValue<string>;
    justifyContent?: string;
    alignItems?: string;
    gap?: ResponsiveValue<number>;
}

export interface ElementMeta {
    label: string;
    locked: boolean;
    hidden: boolean;
    zIndex: number;
}

export interface PageElement {
    id: string;
    type: string;
    props: Record<string, unknown>;
    children?: PageElement[];
    styles: ElementStyles;
    meta: ElementMeta;
}

export interface PageSEO {
    title: string;
    description: string;
    ogImage?: string;
    keywords?: string[];
}

export interface PageSchema {
    version: string;
    pageId: string;
    slug: string;
    title: string;
    description?: string;
    seo: PageSEO;
    elements: PageElement[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    status: 'draft' | 'published' | 'archived';
}

// Helper type for creating new elements
export type NewPageElement = Omit<PageElement, 'id'>;

// History entry for undo/redo
export interface HistoryEntry {
    elements: PageElement[];
    timestamp: number;
}
