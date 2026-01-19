import { getPublishedProducts } from "@/actions/public-products";
import { getTopLevelCategories } from "@/actions/public-categories";
import { ProductCard } from "@/components/products/product-card";
import { UnifiedNavbar } from "@/components/unified-navbar";
import { ProductsBreadcrumbs } from "@/components/products-breadcrumbs";
import { RecentlyViewedSection } from "@/components/recently-viewed-section";
import Link from "next/link";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { page?: string; sort?: string; category?: string };
}) {
    const page = parseInt(searchParams.page || "1");
    const sortBy = (searchParams.sort as any) || "featured";
    const categoryId = searchParams.category || "";

    const [productsData, categories] = await Promise.all([
        getPublishedProducts({
            page,
            pageSize: 12,
            search: "",
            categoryId,
            sortBy,
        }),
        getTopLevelCategories(),
    ]);

    const sortOptions = [
        { value: "featured", label: "Featured (Default)" },
        { value: "newest", label: "Newest" },
        { value: "popular", label: "Popular" },
    ];

    const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Featured (Default)";
    const currentCategory = categoryId ? categories.find(cat => cat.id === categoryId) : null;

    return (
        <>
            {/* Navbar */}
            <UnifiedNavbar categories={categories} />

            {/* Breadcrumbs */}
            <ProductsBreadcrumbs category={currentCategory} />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b border-border bg-card/50 backdrop-blur">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground mb-2">
                                    {currentCategory ? currentCategory.name : "Browse Products"}
                                </h1>
                                <p className="text-muted-foreground">
                                    Discover {productsData.total} premium digital assets
                                </p>
                            </div>

                            {/* Sort By Dropdown */}
                            <div className="relative group">
                                <button className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center gap-2">
                                    <span className="text-sm font-medium">Sort By: {currentSortLabel}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                    {sortOptions.map((option) => (
                                        <Link
                                            key={option.value}
                                            href={`/products?sort=${option.value}${categoryId ? `&category=${categoryId}` : ""}`}
                                            className={`block px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${sortBy === option.value
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground hover:bg-muted"
                                                }`}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {productsData.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground text-lg">
                                No products found.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {productsData.data.map((product, index) => (
                                    <ProductCard key={product.id} product={product} priority={index === 0} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {productsData.totalPages > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {page > 1 && (
                                        <Link
                                            href={`/products?page=${page - 1}${sortBy !== "featured" ? `&sort=${sortBy}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
                                            className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                                        >
                                            Previous
                                        </Link>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <Link
                                                    key={pageNum}
                                                    href={`/products?page=${pageNum}${sortBy !== "featured" ? `&sort=${sortBy}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${page === pageNum
                                                        ? "bg-primary text-primary-foreground"
                                                        : "border border-border bg-background hover:bg-muted"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {page < productsData.totalPages && (
                                        <Link
                                            href={`/products?page=${page + 1}${sortBy !== "featured" ? `&sort=${sortBy}` : ""}${categoryId ? `&category=${categoryId}` : ""}`}
                                            className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Recently Viewed Section */}
            <RecentlyViewedSection />
        </>
    );
}
