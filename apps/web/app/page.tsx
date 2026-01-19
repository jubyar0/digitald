import LandingNavbar from "@/components/landing/navbar"
import HeroSection from "@/components/landing/hero-section"
import FeaturedTextures from "@/components/landing/featured-textures"
import FooterSection from "@/components/landing/footer"
import GiftBanner from "@/components/landing/gift-banner"
import ShopSelections from "@/components/landing/shop-selections"
import { getAllFeaturedCollections } from "@/actions/admin-featured-collections"
import { getLandingSections, getShopCategories, getFreshCommunityProducts } from "@/actions/landing-section-actions"

interface LandingSection {
  id: string
  identifier: string
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  isActive: boolean
}

export default async function HomePage() {
  const [featuredCollections, sectionsResult, categoriesResult, freshProductsResult] = await Promise.all([
    getAllFeaturedCollections(),
    getLandingSections(),
    getShopCategories(),
    getFreshCommunityProducts(),
  ])

  const sections = (sectionsResult.data || []) as LandingSection[]
  const giftBannerSection = sections.find((s: LandingSection) => s.identifier === 'gift-banner')
  const shopCategorySection = sections.find((s: LandingSection) => s.identifier === 'shop-category')
  const freshCommunitySection = sections.find((s: LandingSection) => s.identifier === 'fresh-community')


  return (
    <div className="flex min-h-screen flex-col bg-white">
      <LandingNavbar categories={categoriesResult.data || []} />
      <main>
        <HeroSection />
        {/* Holiday Finds & Picks */}
        <FeaturedTextures collections={featuredCollections} />
        {/* Promo Banner */}
        {giftBannerSection?.isActive !== false && (
          <GiftBanner
            title={giftBannerSection?.title}
            subtitle={giftBannerSection?.subtitle}
            buttonText={giftBannerSection?.buttonText}
            buttonLink={giftBannerSection?.buttonLink}
          />
        )}
        {/* Additional Categories & Items */}
        <ShopSelections
          shopCategoriesVisible={shopCategorySection?.isActive !== false}
          freshCommunityVisible={freshCommunitySection?.isActive !== false}
          categories={categoriesResult.data || []}
          freshProducts={freshProductsResult.data || []}
        />
      </main>
      <FooterSection />
    </div>
  )
}
