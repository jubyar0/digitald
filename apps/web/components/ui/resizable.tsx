// components/ui/resizable.tsx
// Resizable panels component for the editor layout
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResizablePanelGroupProps {
    direction: 'horizontal' | 'vertical';
    className?: string;
    children: React.ReactNode;
}

export function ResizablePanelGroup({
    direction,
    className,
    children,
}: ResizablePanelGroupProps) {
    return (
        <div
            className={cn(
                'flex h-full w-full',
                direction === 'horizontal' ? 'flex-row' : 'flex-col',
                className
            )}
        >
            {children}
        </div>
    );
}

interface ResizablePanelProps {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    className?: string;
    children: React.ReactNode;
}

export function ResizablePanel({
    defaultSize = 50,
    minSize,
    maxSize,
    className,
    children,
}: ResizablePanelProps) {
    return (
        <div
            className={cn('flex-1 overflow-hidden', className)}
            style={{
                flex: `${defaultSize} 1 0px`,
                minWidth: minSize ? `${minSize}%` : undefined,
                maxWidth: maxSize ? `${maxSize}%` : undefined,
            }}
        >
            {children}
        </div>
    );
}

interface ResizableHandleProps {
    withHandle?: boolean;
    className?: string;
}

export function ResizableHandle({
    withHandle = false,
    className,
}: ResizableHandleProps) {
    return (
        <div
            className={cn(
                'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
                className
            )}
        >
            {withHandle && (
                <div className="z-10 flex h-6 w-3 items-center justify-center rounded-sm border bg-border">
                    <svg
                        className="h-2.5 w-2.5 text-muted-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="6" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="18" cy="12" r="1" fill="currentColor" />
                    </svg>
                </div>
            )}
        </div>
    );
}
