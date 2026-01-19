// lib/page-builder/components/Button.tsx
// Interactive component: Button

import { forwardRef, type CSSProperties } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonComponentProps {
    text: string;
    href?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: CSSProperties;
}

const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
};

const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
};

export const ButtonComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonComponentProps>(
    ({ text, href, variant = 'default', size = 'md', className, style, ...props }, ref) => {
        const classes = cn(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:pointer-events-none disabled:opacity-50',
            variantClasses[variant],
            sizeClasses[size],
            className
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={classes}
                    style={style}
                    {...(props as any)}
                >
                    {text}
                </Link>
            );
        }

        return (
            <button
                ref={ref as any}
                className={classes}
                style={style}
                {...(props as any)}
            >
                {text}
            </button>
        );
    }
);

ButtonComponent.displayName = 'ButtonComponent';
