"use client";

import { UnifiedNavbar } from "@/components/unified-navbar";
import { useEffect, useState } from "react";
import { getTopLevelCategories } from "@/actions/public-categories";

interface ParentCategory {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    children: any[];
    _count: {
        products: number;
    };
    products?: any[];
}

/**
 * Client component wrapper for UnifiedNavbar that fetches categories
 * Use this in client components ("use client")
 */
export function UnifiedNavbarClient() {
    const [categories, setCategories] = useState<ParentCategory[]>([]);

    useEffect(() => {
        async function loadCategories() {
            const cats = await getTopLevelCategories();
            setCategories(cats);
        }
        loadCategories();
    }, []);

    return <UnifiedNavbar categories={categories} />;
}
