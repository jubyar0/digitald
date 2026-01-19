import { getProductBySlug, getRelatedProducts } from "@/actions/public-products";
import { notFound } from "next/navigation";
import LandingNavbar from "@/components/landing/navbar";
import FooterSection from "@/components/landing/footer";
import { EtsyProductContent } from "@/components/3dm/etsy-product-content";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ThreeDModelsProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductBySlug(id);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, 8);

    // Prepare images array
    const productImages = product.images && Array.isArray(product.images)
        ? product.images.map((img: any) => typeof img === 'string' ? img : img.url)
        : product.thumbnail
            ? [product.thumbnail]
            : [];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <LandingNavbar />

            {/* Spacer for fixed navbar */}
            <div className="h-[140px]" />

            <EtsyProductContent
                product={product}
                productImages={productImages}
                relatedProducts={relatedProducts}
            />

            <FooterSection />
        </div>
    );
}
