// lib/page-builder/renderer.tsx
// Recursive renderer engine for Page Builder

'use client';

import { memo, useMemo, type CSSProperties, type ReactNode } from 'react';
import { registry } from './registry';
import type { PageElement, DeviceType, ResponsiveValue, SpacingValue } from './types';
import { cn } from '@/lib/utils';

interface RendererProps {
    elements: PageElement[];
    device?: DeviceType;
    isEditor?: boolean;
    onSelect?: (id: string) => void;
    onHover?: (id: string | null) => void;
    selectedId?: string;
    hoveredId?: string;
}

// Resolve responsive value based on current device
function resolveResponsive<T>(
    value: ResponsiveValue<T> | T | undefined,
    device: DeviceType
): T | undefined {
    if (value === undefined || value === null) return undefined;

    // Check if it's a responsive object
    if (typeof value === 'object' && value !== null && 'desktop' in value) {
        const responsive = value as ResponsiveValue<T>;

        // Mobile first cascade: mobile -> tablet -> desktop
        if (device === 'mobile') {
            return responsive.mobile ?? responsive.tablet ?? responsive.desktop;
        }
        if (device === 'tablet') {
            return responsive.tablet ?? responsive.desktop;
        }
        return responsive.desktop;
    }

    return value as T;
}

// Convert spacing object to CSS string
function spacingToCSS(spacing: SpacingValue | undefined): string | undefined {
    if (!spacing) return undefined;
    return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
}

// Build inline styles from element styles
function buildStyles(element: PageElement, device: DeviceType): CSSProperties {
    const { styles } = element;
    if (!styles) return {};

    const resolved: CSSProperties = {};

    // Spacing
    const padding = resolveResponsive(styles.padding, device);
    if (padding) resolved.padding = spacingToCSS(padding);

    const margin = resolveResponsive(styles.margin, device);
    if (margin) resolved.margin = spacingToCSS(margin);

    // Background
    if (styles.backgroundColor) resolved.backgroundColor = styles.backgroundColor;
    if (styles.backgroundImage) resolved.backgroundImage = `url(${styles.backgroundImage})`;

    // Border & Shadow
    if (styles.borderRadius !== undefined) resolved.borderRadius = `${styles.borderRadius}px`;
    if (styles.border) resolved.border = styles.border;
    if (styles.boxShadow) resolved.boxShadow = styles.boxShadow;

    // Sizing
    const width = resolveResponsive(styles.width, device);
    if (width) resolved.width = width;

    const height = resolveResponsive(styles.height, device);
    if (height) resolved.height = height;

    // Flexbox
    if (styles.display) resolved.display = styles.display;

    const flexDirection = resolveResponsive(styles.flexDirection, device);
    if (flexDirection) resolved.flexDirection = flexDirection as CSSProperties['flexDirection'];

    if (styles.justifyContent) resolved.justifyContent = styles.justifyContent;
    if (styles.alignItems) resolved.alignItems = styles.alignItems;

    const gap = resolveResponsive(styles.gap, device);
    if (gap !== undefined) resolved.gap = `${gap}px`;

    // Z-Index from meta
    if (element.meta.zIndex !== undefined) resolved.zIndex = element.meta.zIndex;

    return resolved;
}

interface ElementRendererProps {
    element: PageElement;
    device: DeviceType;
    isEditor?: boolean;
    onSelect?: (id: string) => void;
    onHover?: (id: string | null) => void;
    selectedId?: string;
    hoveredId?: string;
}

const ElementRenderer = memo(function ElementRenderer({
    element,
    device,
    isEditor = false,
    onSelect,
    onHover,
    selectedId,
    hoveredId,
}: ElementRendererProps) {
    const definition = registry.get(element.type);

    if (!definition) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[PageBuilder] Unknown component type: "${element.type}"`);
        }
        return null;
    }

    // Hidden elements don't render
    if (element.meta.hidden && !isEditor) return null;

    const Component = definition.component;
    const inlineStyles = buildStyles(element, device);
    const isSelected = selectedId === element.id;
    const isHovered = hoveredId === element.id;

    // Merge props with component's default props
    const mergedProps = {
        ...definition.defaultProps,
        ...element.props,
    };

    // Render children if component allows them
    const children: ReactNode = element.children?.length ? (
        element.children.map((child) => (
            <ElementRenderer
                key={child.id}
                element={child}
                device={device}
                isEditor={isEditor}
                onSelect={onSelect}
                onHover={onHover}
                selectedId={selectedId}
                hoveredId={hoveredId}
            />
        ))
    ) : undefined;

    // Editor wrapper with selection/hover styles
    if (isEditor) {
        const isLocked = element.meta.locked;
        const isHiddenElement = element.meta.hidden;

        return (
            <div
                className={cn(
                    'relative transition-all duration-150',
                    !isLocked && 'cursor-pointer',
                    isLocked && 'cursor-not-allowed',
                    isSelected && 'ring-2 ring-primary ring-offset-2',
                    !isSelected && isHovered && 'ring-1 ring-primary/50',
                    isHiddenElement && 'opacity-40'
                )}
                style={inlineStyles}
                onClick={(e) => {
                    if (isLocked) return;
                    e.stopPropagation();
                    onSelect?.(element.id);
                }}
                onMouseEnter={() => onHover?.(element.id)}
                onMouseLeave={() => onHover?.(null)}
                data-element-id={element.id}
                data-element-type={element.type}
            >
                {/* Lock indicator */}
                {isLocked && (
                    <div className="absolute top-1 right-1 z-50 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                        🔒
                    </div>
                )}

                {/* Hidden indicator */}
                {isHiddenElement && (
                    <div className="absolute top-1 left-1 z-50 bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                        👁️‍🗨️
                    </div>
                )}

                {/* Element label on hover */}
                {(isHovered || isSelected) && (
                    <div className="absolute -top-6 left-0 z-50 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-sm font-medium whitespace-nowrap">
                        {element.meta.label}
                    </div>
                )}

                <Component {...mergedProps}>
                    {children}
                </Component>
            </div>
        );
    }

    // Production render - no editor chrome
    return (
        <Component {...mergedProps} style={inlineStyles}>
            {children}
        </Component>
    );
});

ElementRenderer.displayName = 'ElementRenderer';

/**
 * Main PageRenderer component
 * Recursively renders page elements from schema
 */
export function PageRenderer({
    elements,
    device = 'desktop',
    isEditor = false,
    onSelect,
    onHover,
    selectedId,
    hoveredId,
}: RendererProps) {
    const renderedElements = useMemo(() => (
        elements.map((element) => (
            <ElementRenderer
                key={element.id}
                element={element}
                device={device}
                isEditor={isEditor}
                onSelect={onSelect}
                onHover={onHover}
                selectedId={selectedId}
                hoveredId={hoveredId}
            />
        ))
    ), [elements, device, isEditor, onSelect, onHover, selectedId, hoveredId]);

    return <>{renderedElements}</>;
}

/**
 * Static renderer for SSR/SSG - no editor features
 * Use this in frontend pages for optimal performance
 */
export function StaticPageRenderer({ elements }: { elements: PageElement[] }) {
    return <PageRenderer elements={elements} device="desktop" isEditor={false} />;
}
