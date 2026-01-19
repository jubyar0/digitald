import { getFeaturedProducts } from "@/actions/public-products"
import { getFeaturedCategories } from "@/actions/public-categories"
import HeroSectionClient from "./hero-section-client"

export default async function HeroSection() {
    const [products, categories] = await Promise.all([
        getFeaturedProducts(8),
        getFeaturedCategories(8)
    ])

    return (
        <HeroSectionClient
            products={products || []}
            categories={categories || []}
        />
    )
}
