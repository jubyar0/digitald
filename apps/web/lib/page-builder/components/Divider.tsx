// lib/page-builder/components/Divider.tsx
// Utility component: Divider

import { forwardRef, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    style?: CSSProperties;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
    ({ orientation = 'horizontal', className, style, ...props }, ref) => {
        return (
            <hr
                ref={ref}
                className={cn(
                    'shrink-0 bg-border',
                    orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
                    className
                )}
                style={style}
                {...props}
            />
        );
    }
);

Divider.displayName = 'Divider';
