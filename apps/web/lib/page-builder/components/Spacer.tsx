// lib/page-builder/components/Spacer.tsx
// Utility component: Spacer

import { forwardRef, type CSSProperties } from 'react';

interface SpacerProps {
    height?: number;
    className?: string;
    style?: CSSProperties;
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
    ({ height = 32, className, style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={className}
                style={{
                    height: `${height}px`,
                    width: '100%',
                    ...style,
                }}
                aria-hidden="true"
                {...props}
            />
        );
    }
);

Spacer.displayName = 'Spacer';
