"use client";

import { CalendarIcon, LayersIcon, SparklesIcon } from "lucide-react";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/sera";

export function Features() {
    const features = [
        {
            icon: CalendarIcon,
            title: "Weekly Drop",
            description: "Get access to brand new 3D assets every week. Stay ahead with the latest textures, models, and HDRIs.",
            highlight: "200 new assets this month"
        },
        {
            icon: LayersIcon,
            title: "Compatible with all 3D software",
            description: "Works seamlessly with Blender, 3ds Max, Cinema 4D, Maya, Unreal Engine, Unity and more.",
            highlight: "15+ integrations"
        },
        {
            icon: SparklesIcon,
            title: "High quality PBR textures",
            description: "Industry-leading physically based rendering materials with up to 16K resolution for photorealistic results.",
            highlight: "Up to 16K resolution"
        }
    ];

    return (
        <section className="bg-[#0a0a0a] py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
                    {features.map((feature, index) => (
                        <StaggerItem key={index}>
                            <div
                                className="group relative bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                            >
                                <div className="mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                        <feature.icon className="w-7 h-7 text-blue-500" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {feature.description}
                                </p>

                                <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full">
                                    <SparklesIcon className="w-4 h-4" />
                                    {feature.highlight}
                                </div>

                                {/* Decorative gradient */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
