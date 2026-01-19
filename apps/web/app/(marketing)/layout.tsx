import LandingNavbar from "@/components/landing/navbar"
import FooterSection from "@/components/landing/footer"
import { getShopCategories } from "@/actions/landing-section-actions"

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const categoriesResult = await getShopCategories()
    const categories = categoriesResult.data || []

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <LandingNavbar categories={categories} />
            <main className="flex-1">
                {children}
            </main>
            <FooterSection />
        </div>
    )
}
