// lib/page-builder/components/HeroSection.tsx
// Pre-built Hero Section template for Page Builder

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundStyle?: 'gradient' | 'solid' | 'image';
    className?: string;
}

export function HeroSection({
    title = 'Welcome to Our Platform',
    subtitle = 'Build beautiful pages with our drag-and-drop page builder',
    ctaText = 'Get Started',
    ctaLink = '#',
    backgroundStyle = 'gradient',
    className,
}: HeroSectionProps) {
    const backgroundClasses = {
        gradient: 'bg-gradient-to-br from-primary/20 via-background to-secondary/20',
        solid: 'bg-primary/10',
        image: 'bg-cover bg-center',
    };

    return (
        <section
            className={cn(
                'relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24',
                backgroundClasses[backgroundStyle],
                className
            )}
        >
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    {subtitle}
                </p>
                {ctaText && (
                    <div className="pt-4">
                        <Button size="lg" asChild>
                            <a href={ctaLink}>{ctaText}</a>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
