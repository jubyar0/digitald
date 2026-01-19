import { getActiveCategories } from "@/actions/public-categories";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function CategoriesPage() {
    const categories = await getActiveCategories();

    // Group categories by parent
    const topLevelCategories = categories.filter((cat) => !cat.parentId);
    const childCategories = categories.filter((cat) => cat.parentId);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/50 backdrop-blur">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Browse Categories
                    </h1>
                    <p className="text-muted-foreground">
                        Explore our {categories.length} categories
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Top Level Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topLevelCategories.map((category) => {
                        const children = childCategories.filter(
                            (child) => child.parentId === category.id
                        );

                        return (
                            <div
                                key={category.id}
                                className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                                        {category.collection?.icon || "📁"}
                                    </div>
                                    <div className="px-3 py-1 text-xs font-medium bg-muted rounded-full">
                                        {category._count.products} products
                                    </div>
                                </div>

                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="group block mb-3"
                                >
                                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}
                                </Link>

                                {/* Subcategories */}
                                {children.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                            Subcategories:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {children.slice(0, 5).map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={`/categories/${child.slug}`}
                                                    className="px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                            {children.length > 5 && (
                                                <span className="px-2 py-1 text-xs text-muted-foreground">
                                                    +{children.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="mt-4 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                                >
                                    Explore
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
