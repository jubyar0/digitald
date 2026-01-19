import { UnifiedNavbar } from "@/components/unified-navbar";
import { getTopLevelCategories } from "@/actions/public-categories";

/**
 * Server component wrapper for UnifiedNavbar that fetches categories
 * Use this in server components or layouts
 */
export async function UnifiedNavbarWrapper() {
    const categories = await getTopLevelCategories();
    return <UnifiedNavbar categories={categories} />;
}
