import { getFeaturedProducts } from "@/actions/public-products"
import FeaturedProductsClient from "./featured-products-client"

export default async function FeaturedProductsSection() {
    const products = await getFeaturedProducts(8)

    return <FeaturedProductsClient products={products || []} />
}
