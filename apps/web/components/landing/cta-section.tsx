"use client"

import Link from "next/link"
import { Particles } from "@/components/ui/particles"
import { NumberTicker } from "@/components/ui/number-ticker"
import { BlurFade } from "@/components/ui/blur-fade"
import { ShimmerButton } from "@/components/ui/shimmer-button"

const stats = [
  { label: "Products", value: 50000, suffix: "+" },
  { label: "Creators", value: 5000, suffix: "+" },
  { label: "Customers", value: 100000, suffix: "+" },
]

export default function CTASection() {
  return (
    <section className="relative py-32 bg-black dark:bg-neutral-950 overflow-hidden">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={80}
        staticity={30}
        ease={80}
        size={0.5}
        color="#ffffff"
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Stats */}
          <BlurFade delay={0.1} inView>
            <div className="flex justify-center gap-12 md:gap-20 mb-16">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white flex items-baseline justify-center">
                    <NumberTicker
                      value={stat.value}
                      delay={index * 0.2}
                      className="text-white"
                    />
                    <span className="text-neutral-500">{stat.suffix}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </BlurFade>

          {/* Main Content */}
          <BlurFade delay={0.3} inView>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Start selling your work today
            </h2>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
              Join thousands of creators earning from their digital products.
              No subscription required.
            </p>
          </BlurFade>

          {/* CTA Buttons */}
          <BlurFade delay={0.5} inView>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sell">
                <ShimmerButton
                  shimmerColor="#000000"
                  background="rgba(255, 255, 255, 1)"
                  borderRadius="12px"
                  className="h-14 px-10 text-base font-medium text-black"
                >
                  Open a Shop
                </ShimmerButton>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center h-14 px-10 bg-transparent text-white font-medium rounded-xl border border-neutral-700 hover:border-neutral-500 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </BlurFade>

          {/* Trust Text */}
          <BlurFade delay={0.6} inView>
            <p className="mt-10 text-sm text-neutral-600">
              ✓ Free to start &nbsp;&nbsp; ✓ No monthly fees &nbsp;&nbsp; ✓ Instant payouts
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
