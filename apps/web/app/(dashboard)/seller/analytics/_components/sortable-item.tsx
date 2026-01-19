'use client'

import React, { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from "@/components/ui/button"
import { GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableItemProps {
    id: string
    children: React.ReactNode
    className?: string
    isEditing: boolean
    onRemove?: (id: string) => void
}

function SortableItemComponent({ id, children, className, isEditing, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className={cn("relative group h-full", className)}>
            {isEditing && (
                <>
                    <div
                        {...attributes}
                        {...listeners}
                        className="absolute top-0 left-0 right-0 h-8 z-20 cursor-move group-hover:bg-accent/10 rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => onRemove?.(id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                </>
            )}
            {children}
        </div>
    )
}

// Memoize to prevent unnecessary re-renders
export const SortableItem = memo(SortableItemComponent)
