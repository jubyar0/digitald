// lib/page-builder/components/FeatureCard.tsx
// Feature Card component for Page Builder

import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface FeatureCardProps {
    icon?: string;
    title?: string;
    description?: string;
    className?: string;
}

export function FeatureCard({
    icon = 'Zap',
    title = 'Feature Title',
    description = 'A brief description of this amazing feature that your product offers.',
    className,
}: FeatureCardProps) {
    // Dynamically get icon from Lucide
    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Star;

    return (
        <div
            className={cn(
                'relative p-6 rounded-xl bg-card border hover:border-primary/50 transition-colors',
                className
            )}
        >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
