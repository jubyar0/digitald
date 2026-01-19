"use client"

import { Marquee } from "@/components/ui/marquee"
import { BlurFade } from "@/components/ui/blur-fade"

const brands = [
    { name: "Google", logo: "G" },
    { name: "Apple", logo: "🍎" },
    { name: "Microsoft", logo: "M" },
    { name: "Adobe", logo: "A" },
    { name: "Figma", logo: "F" },
    { name: "Sketch", logo: "S" },
    { name: "Spotify", logo: "S" },
    { name: "Netflix", logo: "N" },
    { name: "Airbnb", logo: "A" },
    { name: "Uber", logo: "U" },
]

function BrandCard({ name, logo }: { name: string; logo: string }) {
    return (
        <div className="flex items-center gap-3 px-6 py-3 mx-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="h-10 w-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-xl font-bold text-neutral-900 dark:text-white shadow-sm">
                {logo}
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {name}
            </span>
        </div>
    )
}

export default function BrandsSection() {
    return (
        <section className="py-16 bg-white dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-800">
            <div className="container mx-auto px-4">
                <BlurFade delay={0.1} inView>
                    <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 mb-8">
                        Trusted by teams at the world&apos;s leading companies
                    </p>
                </BlurFade>
            </div>

            <BlurFade delay={0.2} inView>
                <Marquee pauseOnHover className="[--duration:40s]">
                    {brands.map((brand) => (
                        <BrandCard key={brand.name} {...brand} />
                    ))}
                </Marquee>
            </BlurFade>

            <BlurFade delay={0.3} inView>
                <Marquee reverse pauseOnHover className="[--duration:35s] mt-4">
                    {[...brands].reverse().map((brand) => (
                        <BrandCard key={brand.name} {...brand} />
                    ))}
                </Marquee>
            </BlurFade>
        </section>
    )
}
