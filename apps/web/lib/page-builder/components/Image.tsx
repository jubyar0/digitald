// lib/page-builder/components/Image.tsx
// Content component: Image

import { forwardRef, type CSSProperties } from 'react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';

interface ImageComponentProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none';
    className?: string;
    style?: CSSProperties;
}

export const ImageComponent = forwardRef<HTMLDivElement, ImageComponentProps>(
    ({
        src,
        alt,
        width = 400,
        height = 300,
        objectFit = 'cover',
        className,
        style,
        ...props
    }, ref) => {
        // Handle external vs internal images
        const isExternal = src.startsWith('http://') || src.startsWith('https://');

        return (
            <div
                ref={ref}
                className={cn('relative overflow-hidden', className)}
                style={{
                    width: width ? `${width}px` : '100%',
                    height: height ? `${height}px` : 'auto',
                    ...style,
                }}
                {...props}
            >
                {isExternal ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full"
                        style={{ objectFit }}
                    />
                ) : (
                    <NextImage
                        src={src}
                        alt={alt}
                        fill
                        style={{ objectFit }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </div>
        );
    }
);

ImageComponent.displayName = 'ImageComponent';
