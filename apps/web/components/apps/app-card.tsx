"use client"

import { Star, ShoppingBag, Check, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AppCardProps {
    app: {
        id: string
        name: string
        slug?: string
        shortDescription: string | null
        description: string | null
        icon: string | null
        rating: number
        reviewCount: number
        category: string | null
        pricingType: string | null
        createdByAdmin?: boolean
    }
    isInstalled?: boolean
    onInstall?: (appId: string) => void
    variant?: 'grid' | 'compact'
}

export function AppCard({ app, isInstalled = false, onInstall, variant = 'grid' }: AppCardProps) {
    // Compact variant - Shopify style horizontal row
    if (variant === 'compact') {
        return (
            <Link
                href={`/seller/apps/${app.id}`}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
                {/* App Icon */}
                <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border bg-white",
                    !app.icon && "bg-primary/5 text-primary"
                )}>
                    {app.icon ? (
                        <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain rounded" />
                    ) : (
                        <ShoppingBag className="h-6 w-6" />
                    )}
                </div>

                {/* App Info */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {app.name}
                        </h3>
                        {isInstalled && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 gap-0.5 text-[10px] px-1.5 py-0 h-4">
                                <Check className="h-2.5 w-2.5" />
                            </Badge>
                        )}
                    </div>

                    {/* Rating & Pricing */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{app.rating.toFixed(1)}</span>
                        <span>({app.reviewCount.toLocaleString()})</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{app.pricingType === 'free' ? 'Free' : app.pricingType === 'freemium' ? 'Free plan available' : 'Paid'}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {app.shortDescription || app.description}
                    </p>

                    {/* Built for badge */}
                    {app.createdByAdmin && (
                        <div className="flex items-center gap-1 mt-1.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-1 font-normal border-orange-300 text-orange-700 bg-orange-50">
                                <Zap className="h-2.5 w-2.5 fill-orange-500" />
                                Built for dIGO
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>
        )
    }

    // Grid variant - Original card style
    return (
        <Link
            href={`/seller/apps/${app.id}`}
            className="group block bg-card border rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* App Icon */}
                    <div className={cn(
                        "h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border bg-white",
                        !app.icon && "bg-primary/5 text-primary"
                    )}>
                        {app.icon ? (
                            <img src={app.icon} alt={app.name} className="h-10 w-10 object-contain rounded" />
                        ) : (
                            <ShoppingBag className="h-7 w-7" />
                        )}
                    </div>

                    {/* App Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                                {app.name}
                            </h3>
                            {isInstalled && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 gap-0.5 text-[10px] px-1.5 h-5">
                                    <Check className="h-2.5 w-2.5" /> Installed
                                </Badge>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-foreground">{app.rating.toFixed(1)}</span>
                            <span>({app.reviewCount.toLocaleString()})</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{app.pricingType === 'free' ? 'Free' : app.pricingType === 'freemium' ? 'Free plan available' : 'Paid'}</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {app.shortDescription || app.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer with badge */}
            {app.createdByAdmin && (
                <div className="px-5 py-2.5 border-t bg-muted/30">
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 gap-1 font-normal border-orange-300 text-orange-700 bg-orange-50">
                        <Zap className="h-2.5 w-2.5 fill-orange-500" />
                        Built for dIGO
                    </Badge>
                </div>
            )}
        </Link>
    )
}
