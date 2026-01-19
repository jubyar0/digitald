// components/page-builder/sidebar/LayersPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/lib/page-builder/store';
import { registry } from '@/lib/page-builder/components';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ChevronRight,
    ChevronDown,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    GripVertical,
} from 'lucide-react';
import type { PageElement } from '@/lib/page-builder/types';

interface LayerItemProps {
    element: PageElement;
    depth: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

function LayerItem({ element, depth, isExpanded, onToggleExpand }: LayerItemProps) {
    const selectedId = useEditorStore((state) => state.selectedId);
    const selectElement = useEditorStore((state) => state.selectElement);
    const toggleLock = useEditorStore((state) => state.toggleLock);
    const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
    const saveToHistory = useEditorStore((state) => state.saveToHistory);

    const hasChildren = element.children && element.children.length > 0;
    const isSelected = selectedId === element.id;
    const definition = registry.get(element.type);

    return (
        <div
            className={cn(
                'flex items-center gap-1 px-2 py-1.5 rounded-md group transition-colors',
                isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
            {/* Expand/Collapse Toggle */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                }}
                className={cn(
                    'h-5 w-5 flex items-center justify-center rounded hover:bg-muted-foreground/20',
                    !hasChildren && 'invisible'
                )}
            >
                {hasChildren && (
                    isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                    ) : (
                        <ChevronRight className="h-3 w-3" />
                    )
                )}
            </button>

            {/* Drag Handle */}
            <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />

            {/* Label */}
            <button
                onClick={() => selectElement(element.id)}
                className="flex-1 text-left text-sm truncate"
            >
                <span className="font-medium">{element.meta.label}</span>
                <span className={cn(
                    'ml-1 text-xs',
                    isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                    {definition?.label || element.type}
                </span>
            </button>

            {/* Status Indicators */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        saveToHistory();
                        toggleVisibility(element.id);
                    }}
                >
                    {element.meta.hidden ? (
                        <EyeOff className="h-3 w-3" />
                    ) : (
                        <Eye className="h-3 w-3" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        saveToHistory();
                        toggleLock(element.id);
                    }}
                >
                    {element.meta.locked ? (
                        <Lock className="h-3 w-3 text-yellow-500" />
                    ) : (
                        <Unlock className="h-3 w-3" />
                    )}
                </Button>
            </div>
        </div>
    );
}

interface LayerTreeProps {
    elements: PageElement[];
    depth?: number;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
}

function LayerTree({ elements, depth = 0, expandedIds, onToggleExpand }: LayerTreeProps) {
    return (
        <>
            {elements.map((element) => {
                const isExpanded = expandedIds.has(element.id);
                const hasChildren = element.children && element.children.length > 0;

                return (
                    <div key={element.id}>
                        <LayerItem
                            element={element}
                            depth={depth}
                            isExpanded={isExpanded}
                            onToggleExpand={() => onToggleExpand(element.id)}
                        />
                        {hasChildren && isExpanded && (
                            <LayerTree
                                elements={element.children!}
                                depth={depth + 1}
                                expandedIds={expandedIds}
                                onToggleExpand={onToggleExpand}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
}

export function LayersPanel() {
    const schema = useEditorStore((state) => state.schema);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Expand top-level elements by default when schema changes
    useEffect(() => {
        if (schema?.elements) {
            setExpandedIds(new Set(schema.elements.map((el) => el.id)));
        }
    }, [schema?.elements]);

    const handleToggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    if (!schema) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No page loaded
            </div>
        );
    }

    if (schema.elements.length === 0) {
        return (
            <div className="p-6 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                <div className="mb-2 text-4xl">📄</div>
                <p className="font-medium">No Layers</p>
                <p className="text-sm mt-1">Add components to see them here</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-2">
                <h3 className="font-semibold px-2 py-2">Layers</h3>
                <LayerTree
                    elements={schema.elements}
                    expandedIds={expandedIds}
                    onToggleExpand={handleToggleExpand}
                />
            </div>
        </ScrollArea>
    );
}
