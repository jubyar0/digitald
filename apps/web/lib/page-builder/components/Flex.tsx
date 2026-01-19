// lib/page-builder/components/Flex.tsx
// Layout component: Flexbox

import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface FlexProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
    wrap?: boolean;
    gap?: number;
}

const justifyMap = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
};

const alignMap = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
    ({
        children,
        className,
        style,
        direction = 'row',
        justify = 'start',
        align = 'stretch',
        wrap = false,
        gap = 0,
        ...props
    }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex',
                    direction === 'column' && 'flex-col',
                    direction === 'row-reverse' && 'flex-row-reverse',
                    direction === 'column-reverse' && 'flex-col-reverse',
                    justifyMap[justify],
                    alignMap[align],
                    wrap && 'flex-wrap',
                    className
                )}
                style={{
                    gap: gap ? `${gap}px` : undefined,
                    ...style,
                }}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Flex.displayName = 'Flex';
