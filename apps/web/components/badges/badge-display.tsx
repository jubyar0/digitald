'use client';

import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Award,
    Sparkles,
    Printer,
    CheckCircle2,
    Layers,
    Maximize2,
    Play,
    Glasses
} from 'lucide-react';

export type BadgeType =
    | 'GAME_READY'
    | 'PBR_CERTIFIED'
    | 'PRINT_READY'
    | 'QUALITY_VERIFIED'
    | 'LOW_POLY'
    | 'HIGH_DETAIL'
    | 'ANIMATION_READY'
    | 'VR_OPTIMIZED';

interface ProductBadge {
    badgeType: BadgeType;
    assignedAt: Date;
}

interface BadgeDisplayProps {
    badges: ProductBadge[];
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    maxDisplay?: number;
}

const badgeConfig: Record<BadgeType, {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}> = {
    GAME_READY: {
        label: 'Game Ready',
        description: 'Optimized for real-time game engines with proper topology and LODs',
        icon: Award,
        color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    },
    PBR_CERTIFIED: {
        label: 'PBR Certified',
        description: 'Includes physically-based rendering materials with proper texture maps',
        icon: Sparkles,
        color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    },
    PRINT_READY: {
        label: 'Print Ready',
        description: 'Watertight mesh suitable for 3D printing',
        icon: Printer,
        color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    QUALITY_VERIFIED: {
        label: 'Quality Verified',
        description: 'Verified by our team for quality and accuracy',
        icon: CheckCircle2,
        color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    },
    LOW_POLY: {
        label: 'Low Poly',
        description: 'Optimized low-polygon count for performance',
        icon: Layers,
        color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    },
    HIGH_DETAIL: {
        label: 'High Detail',
        description: 'High-resolution model with intricate details',
        icon: Maximize2,
        color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',
    },
    ANIMATION_READY: {
        label: 'Animation Ready',
        description: 'Fully rigged and ready for animation',
        icon: Play,
        color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20',
    },
    VR_OPTIMIZED: {
        label: 'VR Optimized',
        description: 'Optimized for virtual reality applications',
        icon: Glasses,
        color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
    },
};

export function BadgeDisplay({
    badges,
    size = 'md',
    showLabel = true,
    maxDisplay = 4
}: BadgeDisplayProps) {
    if (!badges || badges.length === 0) {
        return null;
    }

    const displayBadges = badges.slice(0, maxDisplay);
    const remainingCount = badges.length - maxDisplay;

    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const badgeSizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-2">
                {displayBadges.map((badge, index) => {
                    const config = badgeConfig[badge.badgeType];
                    const Icon = config.icon;

                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className={`${config.color} ${badgeSizeClasses[size]} flex items-center gap-1.5 cursor-help`}
                                >
                                    <Icon className={sizeClasses[size]} />
                                    {showLabel && <span>{config.label}</span>}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="max-w-xs">
                                    <p className="font-semibold">{config.label}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {config.description}
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}

                {remainingCount > 0 && (
                    <Badge variant="outline" className={badgeSizeClasses[size]}>
                        +{remainingCount}
                    </Badge>
                )}
            </div>
        </TooltipProvider>
    );
}

// Compact version for product cards
export function BadgeIcons({ badges, maxDisplay = 3 }: { badges: ProductBadge[]; maxDisplay?: number }) {
    if (!badges || badges.length === 0) {
        return null;
    }

    const displayBadges = badges.slice(0, maxDisplay);
    const remainingCount = badges.length - maxDisplay;

    return (
        <TooltipProvider>
            <div className="flex items-center gap-1">
                {displayBadges.map((badge, index) => {
                    const config = badgeConfig[badge.badgeType];
                    const Icon = config.icon;

                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div
                                    className={`${config.color} p-1.5 rounded-md cursor-help`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-semibold text-xs">{config.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}

                {remainingCount > 0 && (
                    <div className="bg-muted text-muted-foreground p-1.5 rounded-md text-xs font-medium">
                        +{remainingCount}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
