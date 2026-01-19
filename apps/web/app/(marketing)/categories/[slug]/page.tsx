import { getCategoryBySlug } from "@/actions/public-categories";
import { getProductsByCategory } from "@/actions/public-products";
import { ProductCard } from "@/components/products/product-card";
import { ProductSort } from "@/components/products/product-sort";
import { UnifiedNavbarWrapper } from "@/components/unified-navbar-wrapper";
import { DynamicFooter } from "@/components/footer/dynamic-footer";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams: { page?: string; sort?: string };
}) {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
        notFound();
    }

    const page = parseInt(searchParams.page || "1");
    const sortBy = (searchParams.sort as any) || "newest";

    const productsData = await getProductsByCategory(params.slug, page, 12);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <UnifiedNavbarWrapper />
            <div className="flex-1">
                {/* Header */}
                <div className="border-b border-border bg-card/50 backdrop-blur">
                    <div className="container mx-auto px-4 py-8">
                        {/* Breadcrumb */}
                        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/categories" className="hover:text-foreground transition-colors">
                                Categories
                            </Link>
                            <span>/</span>
                            {category.parent && (
                                <>
                                    <Link
                                        href={`/categories/${category.parent.slug}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {category.parent.name}
                                    </Link>
                                    <span>/</span>
                                </>
                            )}
                            <span className="text-foreground">{category.name}</span>
                        </nav>

                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground mb-2">
                                    {category.name}
                                </h1>
                                {category.description && (
                                    <p className="text-muted-foreground max-w-2xl">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-muted">
                                <p className="text-sm text-muted-foreground">
                                    {category._count.products} products
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Subcategories */}
                    {category.children && category.children.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">Subcategories</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {category.children.map((child) => (
                                    <Link
                                        key={child.id}
                                        href={`/categories/${child.slug}`}
                                        className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg"
                                    >
                                        <h3 className="font-semibold text-foreground mb-1">{child.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {child._count.products} products
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sort Options */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {productsData.data.length} of {productsData.total} products
                        </p>
                        <div className="flex items-center gap-2">
                            <ProductSort sortBy={sortBy} baseUrl={`/categories/${params.slug}`} />
                        </div>
                    </div>

                    {/* Products Grid */}
                    {productsData.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground text-lg">
                                No products found in this category yet.
                            </p>
                            <Link
                                href="/products"
                                className="mt-4 inline-block text-primary hover:text-primary/80 transition-colors"
                            >
                                Browse all products
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {productsData.data.map((product, index) => (
                                    <ProductCard key={product.id} product={product} priority={index === 0} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {productsData.totalPages > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {page > 1 && (
                                        <Link
                                            href={`/categories/${params.slug}?page=${page - 1}${sortBy !== "newest" ? `&sort=${sortBy}` : ""}`}
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
                                                    href={`/categories/${params.slug}?page=${pageNum}${sortBy !== "newest" ? `&sort=${sortBy}` : ""}`}
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
                                            href={`/categories/${params.slug}?page=${page + 1}${sortBy !== "newest" ? `&sort=${sortBy}` : ""}`}
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
            <DynamicFooter />
        </div>
    );
}
