'use client';

import Link from 'next/link';
import { SearchResult } from '@/types/search';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Store,
    Package,
    ShoppingCart,
    MessageSquare,
    Search
} from 'lucide-react';

interface SearchResultItemProps {
    result: SearchResult;
    onClick?: () => void;
}

export function SearchResultItem({ result, onClick }: SearchResultItemProps) {
    const getIcon = () => {
        switch (result.type) {
            case 'USER':
                return <User className="size-4" />;
            case 'VENDOR':
                return <Store className="size-4" />;
            case 'PRODUCT':
                return <Package className="size-4" />;
            case 'ORDER':
                return <ShoppingCart className="size-4" />;
            case 'TICKET':
                return <MessageSquare className="size-4" />;
            default:
                return <Search className="size-4" />;
        }
    };

    const getBadgeVariant = (variant: string) => {
        switch (variant) {
            case 'destructive':
                return 'destructive';
            case 'success':
                return 'default'; // Map to default or success if available in your theme
            case 'warning':
                return 'secondary'; // Map to secondary or warning
            default:
                return 'outline';
        }
    };

    return (
        <Link
            href={result.url}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors group"
            onClick={onClick}
        >
            <div className="flex items-center justify-center size-8 rounded-md bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground transition-colors border">
                {getIcon()}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">
                        {result.title}
                    </span>
                    {result.badge && (
                        <Badge variant={getBadgeVariant(result.badge.variant) as any} className="text-[10px] h-5 px-1.5">
                            {result.badge.text}
                        </Badge>
                    )}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                    {result.subtitle}
                </span>
            </div>
        </Link>
    );
}
