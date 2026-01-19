import HeroSection from "@/components/landing/hero-section"
import BrandsSection from "@/components/landing/brands-section"
import FeaturedProductsSection from "@/components/landing/featured-products"
import CTASection from "@/components/landing/cta-section"

export default function MarketingPage() {
  return (
    <>
      {/* Hero with Particles background */}
      <HeroSection />

      {/* Trusted brands with Marquee */}
      <BrandsSection />

      {/* New products with DotPattern background */}
      <FeaturedProductsSection />

      {/* CTA with Particles and NumberTicker */}
      <CTASection />
    </>
  )
}