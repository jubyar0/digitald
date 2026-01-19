// lib/page-builder/components/Container.tsx
// Layout component: Container with max-width

import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, className, style, maxWidth = 'xl', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'mx-auto px-4 sm:px-6 lg:px-8',
                    maxWidthClasses[maxWidth],
                    className
                )}
                style={style}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Container.displayName = 'Container';
