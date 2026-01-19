// lib/page-builder/registry.ts
// Component Registry for mapping schema types to React components

import type { ComponentType } from 'react';
import type { z } from 'zod';

export type ComponentCategory = 'layout' | 'content' | 'media' | 'interactive' | 'magic-ui' | 'aceternity';

export type PropEditorType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'color'
    | 'select'
    | 'boolean'
    | 'spacing'
    | 'typography'
    | 'image'
    | 'link';

export interface PropEditorOption {
    label: string;
    value: string;
}

export interface PropEditor {
    key: string;
    label: string;
    type: PropEditorType;
    options?: PropEditorOption[];
    responsive?: boolean;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}

export interface ComponentDefinition {
    component: ComponentType<any>;
    schema?: z.ZodObject<any>;
    defaultProps: Record<string, unknown>;
    defaultStyles: Record<string, unknown>;
    category: ComponentCategory;
    icon: string;
    label: string;
    description?: string;
    allowChildren: boolean;
    editableProps: PropEditor[];
}

class ComponentRegistry {
    private components = new Map<string, ComponentDefinition>();

    /**
     * Register a component with its definition
     */
    register(type: string, definition: ComponentDefinition): void {
        if (this.components.has(type)) {
            console.warn(`Component "${type}" is already registered. Overwriting.`);
        }
        this.components.set(type, definition);
    }

    /**
     * Get a component definition by type
     */
    get(type: string): ComponentDefinition | undefined {
        return this.components.get(type);
    }

    /**
     * Check if a component type is registered
     */
    has(type: string): boolean {
        return this.components.has(type);
    }

    /**
     * Get all registered components
     */
    getAll(): Map<string, ComponentDefinition> {
        return new Map(this.components);
    }

    /**
     * Get components filtered by category
     */
    getByCategory(category: ComponentCategory): [string, ComponentDefinition][] {
        return Array.from(this.components.entries())
            .filter(([, def]) => def.category === category);
    }

    /**
     * Get all categories that have registered components
     */
    getCategories(): ComponentCategory[] {
        const categories = new Set<ComponentCategory>();
        this.components.forEach((def) => categories.add(def.category));
        return Array.from(categories);
    }

    /**
     * Unregister a component
     */
    unregister(type: string): boolean {
        return this.components.delete(type);
    }

    /**
     * Get component count
     */
    get size(): number {
        return this.components.size;
    }
}

// Singleton instance
export const registry = new ComponentRegistry();

// Helper function to create component definition with defaults
export function defineComponent(
    component: ComponentType<any>,
    config: Omit<ComponentDefinition, 'component'>
): ComponentDefinition {
    return {
        component,
        ...config,
    };
}
