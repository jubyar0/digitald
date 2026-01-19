import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface DashboardImageProps extends Omit<ImageProps, 'src'> {
    src: string
    alt: string
    priority?: boolean
    className?: string
}

/**
 * Optimized Image component for dashboards with LCP improvements
 * - Automatically sets priority for above-the-fold images
 * - Proper sizes attribute for responsive images
 * - Loading states
 */
export function DashboardImage({
    src,
    alt,
    priority = false,
    className,
    sizes,
    ...props
}: DashboardImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            priority={priority}
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            className={cn('object-cover', className)}
            {...props}
        />
    )
}

/**
 * Hero image variant - Always prioritized for LCP
 */
export function DashboardHeroImage(props: DashboardImageProps) {
    return <DashboardImage {...props} priority={true} />
}

/**
 * Thumbnail image variant with standard sizes
 */
export function DashboardThumbnail(props: DashboardImageProps) {
    return (
        <DashboardImage
            {...props}
            sizes="(max-width: 768px) 100px, 150px"
            className={cn('rounded-lg', props.className)}
        />
    )
}

/**
 * Gallery image variant
 */
export function DashboardGalleryImage({
    isFirst = false,
    ...props
}: DashboardImageProps & { isFirst?: boolean }) {
    return (
        <DashboardImage
            {...props}
            priority={isFirst} // First gallery image gets priority for LCP
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            loading={isFirst ? 'eager' : 'lazy'}
        />
    )
}
