"use client";

import { useState, useEffect } from "react";
import { publicApi } from "@/lib/api";
import { formatTimeAgo } from "@/lib/utils";

const STORAGE_KEY = "recently_viewed_ids";
const MAX_ITEMS = 20;

export interface RecentlyViewedItem {
    id: string;
    title: string;
    type: "Texture" | "Model" | "HDRI";
    imageUrl: string;
    date: string;
    isFree: boolean;
    price: number;
}

export function useRecentlyViewed() {
    const [items, setItems] = useState<RecentlyViewedItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load items on mount
    useEffect(() => {
        const loadItems = async () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) {
                    setLoading(false);
                    return;
                }

                const ids = JSON.parse(stored) as string[];
                if (ids.length === 0) {
                    setLoading(false);
                    return;
                }

                const response = await publicApi.getPublishedProductsByIds(ids);
                if (response.success && response.data) {
                    const mappedItems: RecentlyViewedItem[] = response.data.map((product: any) => {
                        // Parse images from JSON
                        let productImages: string[] = [];
                        if (product.images) {
                            try {
                                const parsed = typeof product.images === 'string'
                                    ? JSON.parse(product.images)
                                    : product.images;
                                productImages = Array.isArray(parsed) ? parsed : [];
                            } catch (e) {
                                console.error('Failed to parse images for product:', product.id);
                            }
                        }

                        return {
                            id: product.id,
                            title: product.name,
                            type: "Model", // Default, or derive from category/tags
                            imageUrl: product.thumbnail || productImages[0] || "/placeholder.jpg",
                            date: formatTimeAgo(product.createdAt),
                            isFree: product.price === 0,
                            price: product.price,
                        };
                    });
                    setItems(mappedItems);
                }
            } catch (error) {
                console.error("Failed to load recently viewed items:", error);
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    const addProduct = (id: string) => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let ids = stored ? JSON.parse(stored) : [];

            // Remove if already exists (to move to top)
            ids = ids.filter((existingId: string) => existingId !== id);

            // Add to front
            ids.unshift(id);

            // Limit size
            if (ids.length > MAX_ITEMS) {
                ids = ids.slice(0, MAX_ITEMS);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (error) {
            console.error("Failed to save recently viewed item:", error);
        }
    };

    return { items, loading, addProduct };
}
