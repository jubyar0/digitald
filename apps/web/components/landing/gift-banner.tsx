"use client"

import Link from "next/link"
import { ArrowRight, Gift, ChevronRight } from "lucide-react"
import { cn } from "@repo/lib"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"

interface GiftBannerProps {
    title?: string | null
    subtitle?: string | null
    buttonText?: string | null
    buttonLink?: string | null
}

export default function GiftBanner({
    title = "Send a gift ASAP?!",
    subtitle = "Your presents can be present... instantly. Send a digital gift teaser while the physical item ships!",
    buttonText = "Try Gift Mode",
    buttonLink = "/gift-mode",
}: GiftBannerProps) {
    return (
        <section className="bg-[#19412f] text-white py-12 md:py-16 relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center flex flex-col items-center justify-center">
                <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] mb-4 bg-black/20">
                    <span
                        className={cn(
                            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                        )}
                        style={{
                            WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "destination-out",
                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "subtract",
                            WebkitClipPath: "padding-box",
                        }}
                    />
                    <Gift className="w-4 h-4 mr-2 text-white" />
                    <AnimatedGradientText className="text-sm font-medium">
                        New Feature
                    </AnimatedGradientText>
                    <ChevronRight className="ml-1 size-4 stroke-neutral-300 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </div>
                <h2 className="text-3xl md:text-5xl font-serif mb-4">
                    {title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                    {subtitle}
                </p>

                <Link
                    href={buttonLink || "/gift-mode"}
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#19412f] font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                >
                    {buttonText}
                </Link>
            </div>

            {/* Decorative Background Elements (Simple shapes/gradients to mimic the image) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-white blur-3xl" />
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#e6d089] blur-3xl" />
            </div>
        </section>
    )
}
