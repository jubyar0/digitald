// lib/page-builder/components/Grid.tsx
// Layout component: CSS Grid

import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    columns?: number;
    gap?: number;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
    ({ children, className, style, columns = 3, gap = 16, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('grid', className)}
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gap: `${gap}px`,
                    ...style,
                }}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Grid.displayName = 'Grid';
