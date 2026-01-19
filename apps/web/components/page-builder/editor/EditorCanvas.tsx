// components/page-builder/editor/EditorCanvas.tsx
'use client';

import { useCallback, useState } from 'react';
import { useEditorStore } from '@/lib/page-builder/store';
import { PageRenderer } from '@/lib/page-builder/renderer';
import { registry } from '@/lib/page-builder/components';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Plus, MousePointer } from 'lucide-react';

export function EditorCanvas() {
    const schema = useEditorStore((state) => state.schema);
    const device = useEditorStore((state) => state.device);
    const editorMode = useEditorStore((state) => state.editorMode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const hoveredId = useEditorStore((state) => state.hoveredId);
    const selectElement = useEditorStore((state) => state.selectElement);
    const hoverElement = useEditorStore((state) => state.hoverElement);
    const moveElement = useEditorStore((state) => state.moveElement);
    const addElement = useEditorStore((state) => state.addElement);
    const saveToHistory = useEditorStore((state) => state.saveToHistory);

    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | null>(null);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        // Save current state to history before drag
        saveToHistory();
    }, [saveToHistory]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find indices for move operation
        if (schema?.elements) {
            const activeIndex = schema.elements.findIndex((el) => el.id === activeId);
            const overIndex = schema.elements.findIndex((el) => el.id === overId);

            if (activeIndex !== -1 && overIndex !== -1) {
                moveElement(activeId, null, overIndex);
            }
        }
    }, [schema, moveElement]);

    // Handle drop from sidebar (native HTML DnD)
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        setDropPosition(null);

        const componentType = e.dataTransfer.getData('application/page-builder-component');
        if (!componentType) return;

        const definition = registry.get(componentType);
        if (!definition) return;

        saveToHistory();

        addElement({
            type: componentType,
            props: { ...definition.defaultProps },
            styles: { ...definition.defaultStyles },
            meta: {
                label: definition.label,
                locked: false,
                hidden: false,
                zIndex: 1,
            },
            children: definition.allowChildren ? [] : undefined,
        });
    }, [addElement, saveToHistory]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsDraggingOver(true);

        // Determine drop position based on mouse Y
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        setDropPosition(y < rect.height / 2 ? 'top' : 'bottom');
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        setIsDraggingOver(false);
        setDropPosition(null);
    }, []);

    // Device-specific widths
    const deviceStyles = {
        desktop: 'w-full max-w-none',
        tablet: 'w-[768px] max-w-[768px]',
        mobile: 'w-[375px] max-w-[375px]',
    };

    if (!schema) {
        return (
            <div className="flex-1 flex items-center justify-center bg-muted/50">
                <div className="text-center text-muted-foreground">
                    <p>No page loaded</p>
                </div>
            </div>
        );
    }

    const isEditMode = editorMode === 'edit';

    return (
        <div
            className="flex-1 bg-muted/30 overflow-auto p-8"
            onClick={() => selectElement(null)}
        >
            <div
                className={cn(
                    'mx-auto bg-background rounded-lg shadow-xl min-h-[600px] transition-all duration-300 overflow-hidden relative',
                    deviceStyles[device],
                    isDraggingOver && 'ring-2 ring-primary ring-offset-2'
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {/* Drop indicator at top */}
                {isDraggingOver && dropPosition === 'top' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-50 animate-pulse" />
                )}

                {isEditMode ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={schema.elements.map((el) => el.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {schema.elements.length === 0 ? (
                                <div
                                    className={cn(
                                        "flex flex-col items-center justify-center min-h-[400px] text-muted-foreground border-2 border-dashed m-4 rounded-lg transition-all",
                                        isDraggingOver
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted-foreground/20'
                                    )}
                                >
                                    {isDraggingOver ? (
                                        <>
                                            <Plus className="h-12 w-12 text-primary mb-4 animate-bounce" />
                                            <p className="text-lg font-medium text-primary">Drop component here</p>
                                        </>
                                    ) : (
                                        <>
                                            <MousePointer className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                            <p className="text-lg font-medium">Empty Page</p>
                                            <p className="text-sm">Drag components from the sidebar or click to add</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <PageRenderer
                                    elements={schema.elements}
                                    device={device}
                                    isEditor
                                    onSelect={selectElement}
                                    onHover={hoverElement}
                                    selectedId={selectedId ?? undefined}
                                    hoveredId={hoveredId ?? undefined}
                                />
                            )}
                        </SortableContext>
                        <DragOverlay>
                            {/* Drag preview could be rendered here */}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <PageRenderer elements={schema.elements} device={device} />
                )}

                {/* Drop indicator at bottom */}
                {isDraggingOver && dropPosition === 'bottom' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary z-50 animate-pulse" />
                )}
            </div>
        </div>
    );
}
