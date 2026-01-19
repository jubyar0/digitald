"use client";

import { useRouter } from "next/navigation";

interface ProductSortProps {
    sortBy: string;
    baseUrl: string;
}

export function ProductSort({ sortBy, baseUrl }: ProductSortProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => {
                    router.push(`${baseUrl}?sort=${e.target.value}`);
                }}
            >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
            </select>
        </div>
    );
}
