// lib/page-builder/components/Paragraph.tsx
// Content component: Paragraph

import { forwardRef, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ParagraphProps {
    text: string;
    className?: string;
    style?: CSSProperties;
    size?: 'sm' | 'base' | 'lg' | 'xl';
}

const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
};

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
    ({ text, className, style, size = 'base', ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn(
                    sizeClasses[size],
                    'leading-relaxed',
                    className
                )}
                style={style}
                {...props}
            >
                {text}
            </p>
        );
    }
);

Paragraph.displayName = 'Paragraph';
