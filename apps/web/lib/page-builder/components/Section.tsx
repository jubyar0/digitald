// lib/page-builder/components/Section.tsx
// Layout component: Section

import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    fullWidth?: boolean;
    minHeight?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
    ({ children, className, style, fullWidth = true, minHeight = 'auto', ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn(
                    'relative',
                    fullWidth && 'w-full',
                    className
                )}
                style={{
                    minHeight,
                    ...style,
                }}
                {...props}
            >
                {children}
            </section>
        );
    }
);

Section.displayName = 'Section';
