import { getCategoryBySlug } from "@/actions/public-categories";
import { getProductBySlug, getRelatedProducts } from "@/actions/public-products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Download, Eye } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { UnifiedNavbarWrapper } from "@/components/unified-navbar-wrapper";
import { DynamicFooter } from "@/components/footer/dynamic-footer";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { AssetDetailsSection } from "@/components/products/asset-details-section";
import { TextureFilesSection } from "@/components/products/texture-files-section";
import { LicenseInfoSection } from "@/components/products/license-info-section";
import { SoftwareCompatibilitySection } from "@/components/products/software-compatibility-section";
import { ProductActions } from "@/components/products/product-actions";

export default async function ProductDetailPage({
    params,
}: {
    params: { category: string; id: string };
}) {
    const product = await getProductBySlug(params.id);

    if (!product) {
        notFound();
    }

    const category = await getCategoryBySlug(params.category);

    if (!category || product.category.slug !== params.category) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, 4);

    // Prepare images array
    const productImages = product.images && Array.isArray(product.images)
        ? product.images.map((img: any) => typeof img === 'string' ? img : img.url)
        : product.thumbnail
            ? [product.thumbnail]
            : [];

    return (
        <div className="min-h-screen bg-[#09090b]">
            {/* Navbar */}
            <UnifiedNavbarWrapper />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/${product.category.slug}`}
                        className="hover:text-white transition-colors"
                    >
                        {product.category.name}
                    </Link>
                    <span>/</span>
                    <span className="text-white">{product.name}</span>
                </nav>

                {/* Product Header & Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Image Gallery */}
                    <div>
                        <ProductImageGallery
                            images={productImages}
                            productName={product.name}
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-4">
                            <Link
                                href={`/${product.category.slug}`}
                                className="inline-block px-3 py-1.5 text-xs font-semibold bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors uppercase tracking-wider"
                            >
                                {product.category.name}
                            </Link>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-600"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-400">
                                {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <div className="text-4xl font-bold text-white mb-2">
                                ${product.price.toFixed(2)}
                            </div>
                        </div>

                        {/* Actions */}
                        <ProductActions
                            productId={product.id}
                            productName={product.name}
                        />

                        {/* Vendor Info */}
                        <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-4">
                            <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Creator</h3>
                            <Link
                                href={`/public-profile/profiles/${product.vendor.id}`}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-bold">
                                    {product.vendor.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-white group-hover:text-gray-300 transition-colors text-sm">
                                        {product.vendor.name}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            {product.vendor.averageRating.toFixed(1)}
                                        </span>
                                        <span>{product.vendor.totalFollowers} followers</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Software Compatibility - Moved here */}
                        <SoftwareCompatibilitySection
                            addonSupport={product.addonSupport}
                            compatibleSoftware={product.softwareCompatibility as any}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                    <div className="p-6 rounded-xl border border-white/10 bg-[#1c1c1c]">
                        <p className="text-gray-400 whitespace-pre-wrap leading-relaxed text-sm">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Asset Details Section */}
                <div className="mb-12">
                    <AssetDetailsSection
                        assetDetails={product.assetDetails || undefined}
                        physicalSize={{
                            height: product.height || undefined,
                            width: product.width || undefined,
                            depth: product.depth || undefined,
                        }}
                        creationMethod="Photogrammetry Capture"
                    />
                </div>

                {/* Texture Files Section */}
                <div className="mb-12">
                    <TextureFilesSection
                        textureFiles={product.textureFiles as any}
                    />
                </div>


                {/* License Information Section */}
                <div className="mb-12">
                    <LicenseInfoSection
                        licenses={product.licenseInfo as any}
                    />
                </div>

                {/* Technical Details */}
                {(product.polygonCount || product.verticesCount || product.isRigged || product.isAnimated) && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-4">Technical Specifications</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.polygonCount && (
                                <div className="p-4 rounded-lg border border-white/10 bg-[#1c1c1c]">
                                    <p className="text-sm text-gray-400 mb-1">Polygons</p>
                                    <p className="text-lg font-semibold text-white">
                                        {product.polygonCount.toLocaleString()}
                                    </p>
                                </div>
                            )}
                            {product.verticesCount && (
                                <div className="p-4 rounded-lg border border-white/10 bg-[#1c1c1c]">
                                    <p className="text-sm text-gray-400 mb-1">Vertices</p>
                                    <p className="text-lg font-semibold text-white">
                                        {product.verticesCount.toLocaleString()}
                                    </p>
                                </div>
                            )}
                            <div className="p-4 rounded-lg border border-white/10 bg-[#1c1c1c]">
                                <p className="text-sm text-gray-400 mb-1">Rigged</p>
                                <p className="text-lg font-semibold text-white">
                                    {product.isRigged ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg border border-white/10 bg-[#1c1c1c]">
                                <p className="text-sm text-gray-400 mb-1">Animated</p>
                                <p className="text-lg font-semibold text-white">
                                    {product.isAnimated ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
                        <div className="space-y-4">
                            {product.reviews.slice(0, 5).map((review) => (
                                <div key={review.id} className="p-6 rounded-xl border border-white/10 bg-[#1c1c1c]">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-white">{review.user.name}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-600"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-300">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">You may also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <DynamicFooter />
        </div >
    );
}
