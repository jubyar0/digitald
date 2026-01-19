// lib/page-builder/components/Heading.tsx
// Content component: Heading

import { forwardRef, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    style?: CSSProperties;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ text, level = 2, className, style, ...props }, ref) => {
        const Tag = `h${level}` as const;

        const sizeClasses = {
            1: 'text-4xl font-bold tracking-tight lg:text-5xl',
            2: 'text-3xl font-semibold tracking-tight',
            3: 'text-2xl font-semibold tracking-tight',
            4: 'text-xl font-semibold',
            5: 'text-lg font-medium',
            6: 'text-base font-medium',
        };

        return (
            // @ts-ignore - Dynamic tag
            <Tag
                ref={ref}
                className={cn(sizeClasses[level], className)}
                style={style}
                {...props}
            >
                {text}
            </Tag>
        );
    }
);

Heading.displayName = 'Heading';
