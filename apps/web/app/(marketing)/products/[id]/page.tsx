import { getProductBySlug, getRelatedProducts } from "@/actions/public-products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Download, Eye, Share2 } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { ProductNavbar } from "@/components/products/product-navbar";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { AssetDetailsSection } from "@/components/products/asset-details-section";
import { TextureFilesSection } from "@/components/products/texture-files-section";
import { LicenseInfoSection } from "@/components/products/license-info-section";
import { SoftwareCompatibilitySection } from "@/components/products/software-compatibility-section";
import { ProductActions } from "@/components/products/product-actions";

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const product = await getProductBySlug(params.id);

    if (!product) {
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
            <ProductNavbar />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-white transition-colors">
                        Products
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/categories/${product.category.slug}`}
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
                                href={`/categories/${product.category.slug}`}
                                className="inline-block px-3 py-1 text-sm font-medium bg-indigo-500/20 text-indigo-300 rounded-full hover:bg-indigo-500/30 transition-colors border border-indigo-500/30"
                            >
                                {product.category.name}
                            </Link>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-6">
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

                        {/* Stats */}
                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{product.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                <span>{product.downloads} downloads</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                ${product.price.toFixed(2)}
                            </div>
                            <p className="text-sm text-gray-400">
                                One-time payment • Lifetime access
                            </p>
                        </div>

                        {/* Actions */}
                        <ProductActions
                            productId={product.id}
                            productName={product.name}
                        />

                        {/* Vendor Info */}
                        <div className="p-6 rounded-xl border border-white/10 bg-[#1c1c1c]">
                            <h3 className="font-semibold text-white mb-4">About the Creator</h3>
                            <Link
                                href={`/public-profile/profiles/${product.vendor.id}`}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                    {product.vendor.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                                        {product.vendor.name}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            {product.vendor.averageRating.toFixed(1)}
                                        </span>
                                        <span>{product.vendor.totalFollowers} followers</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                    <div className="p-6 rounded-xl border border-white/10 bg-[#1c1c1c]">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
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

                {/* Software Compatibility Section */}
                <div className="mb-12">
                    <SoftwareCompatibilitySection
                        addonSupport={product.addonSupport}
                        compatibleSoftware={product.softwareCompatibility as any}
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
        </div>
    );
}
