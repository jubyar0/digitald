"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";
import { FadeIn, SlideIn, AnimatedButton, StaggerContainer, StaggerItem } from "@/components/sera";

export function CTA() {
    const benefits = [
        "Access to 5,000+ premium assets",
        "Weekly new releases",
        "Compatible with all major 3D software",
        "Commercial license included"
    ];

    return (
        <section className="bg-[#111] py-20 lg:py-32 border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn delay={0.2}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Getting started is easy
                        </h2>
                    </FadeIn>
                    <SlideIn delay={0.4} direction="up">
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                            Join millions of 3D artists and start creating stunning renders today. No credit card required.
                        </p>
                    </SlideIn>

                    <SlideIn delay={0.6} direction="up">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <AnimatedButton asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-14 text-lg">
                                <Link href="/register">Create Free Account</Link>
                            </AnimatedButton>
                            <AnimatedButton asChild variant="outline" size="lg" className="border-gray-600 text-white hover:bg-white/10 hover:text-white px-8 h-14 text-lg bg-transparent">
                                <Link href="/pricing">View Pricing</Link>
                            </AnimatedButton>
                        </div>
                    </SlideIn>

                    <StaggerContainer className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto" staggerDelay={0.1}>
                        {benefits.map((benefit, index) => (
                            <StaggerItem
                                key={index}
                            >
                                <div className="flex items-center gap-3 text-left bg-white/5 border border-white/10 rounded-xl p-4">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <span className="text-gray-300">{benefit}</span>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    );
}
