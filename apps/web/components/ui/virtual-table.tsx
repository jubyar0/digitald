'use client'

import { useRef, useMemo, ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualTableProps<T> {
    data: T[]
    rowHeight?: number
    overscan?: number
    renderRow: (item: T, index: number) => ReactNode
    className?: string
    headerContent?: ReactNode
    emptyContent?: ReactNode
}

/**
 * VirtualTable - A virtualized table component for large datasets
 * Uses @tanstack/react-virtual for efficient rendering
 * Only renders visible rows + overscan for smooth scrolling
 */
export function VirtualTable<T>({
    data,
    rowHeight = 52,
    overscan = 5,
    renderRow,
    className = '',
    headerContent,
    emptyContent = <div className="p-8 text-center text-muted-foreground">No data available</div>,
}: VirtualTableProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan,
    })

    const items = virtualizer.getVirtualItems()

    if (data.length === 0) {
        return (
            <div className={className}>
                {headerContent}
                {emptyContent}
            </div>
        )
    }

    return (
        <div className={className}>
            {headerContent}
            <div
                ref={parentRef}
                className="overflow-auto"
                style={{ maxHeight: '600px' }}
            >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {items.map((virtualRow) => (
                        <div
                            key={virtualRow.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {renderRow(data[virtualRow.index], virtualRow.index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

interface VirtualListProps<T> {
    data: T[]
    itemHeight?: number
    overscan?: number
    renderItem: (item: T, index: number) => ReactNode
    className?: string
    maxHeight?: number
}

/**
 * VirtualList - A virtualized list component
 * Perfect for long lists like notifications, messages, etc.
 */
export function VirtualList<T>({
    data,
    itemHeight = 48,
    overscan = 5,
    renderItem,
    className = '',
    maxHeight = 400,
}: VirtualListProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null)

    const virtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => itemHeight,
        overscan,
    })

    const items = virtualizer.getVirtualItems()

    if (data.length === 0) {
        return null
    }

    return (
        <div
            ref={parentRef}
            className={`overflow-auto ${className}`}
            style={{ maxHeight }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {items.map((virtualRow) => (
                    <div
                        key={virtualRow.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {renderItem(data[virtualRow.index], virtualRow.index)}
                    </div>
                ))}
            </div>
        </div>
    )
}
