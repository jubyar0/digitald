"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { FadeIn, SlideIn, AnimatedButton } from "@/components/sera";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative bg-[#111] text-white overflow-hidden py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 max-w-2xl">
                        <FadeIn delay={0.2}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                                Make Better <br />
                                <span className="text-white">Renders, Faster</span>
                            </h1>
                        </FadeIn>
                        <SlideIn delay={0.4} direction="up">
                            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
                                Thousands of 3D textures, models and HDRIs for Blender, 3ds Max, SketchUp, Cinema 4D, Unreal Engine and more.
                            </p>
                        </SlideIn>
                        <SlideIn delay={0.6} direction="up">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <AnimatedButton asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-12 text-base">
                                    <Link href="/register">Create Free Account</Link>
                                </AnimatedButton>
                                <AnimatedButton asChild variant="outline" size="lg" className="border-gray-600 text-white hover:bg-white/10 hover:text-white px-8 h-12 text-base bg-transparent">
                                    <Link href="/pricing">View Pricing</Link>
                                </AnimatedButton>
                            </div>
                        </SlideIn>

                        <FadeIn delay={0.8}>
                            <div className="pt-8 flex items-center gap-6 text-sm text-gray-400">
                                <div className="flex -space-x-2">
                                    {[
                                        { src: "/avatars/avatar-1.jpg", ring: "from-pink-500 via-purple-500 to-pink-500" },
                                        { src: "/avatars/avatar-2.jpg", ring: "from-green-400 via-emerald-500 to-green-400" },
                                        { src: "/avatars/avatar-3.jpg", ring: "from-orange-400 via-red-500 to-orange-400" },
                                        { src: "/avatars/avatar-4.jpg", ring: "from-yellow-400 via-amber-500 to-yellow-400" }
                                    ].map((avatar, i) => (
                                        <div key={i} className="group relative">
                                            {/* Animated gradient ring */}
                                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${avatar.ring} rounded-full blur-sm opacity-75 group-hover:opacity-100 animate-pulse transition-opacity`} />
                                            {/* Avatar image */}
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#111] transform group-hover:scale-110 transition-transform duration-300">
                                                <Image
                                                    src={avatar.src}
                                                    alt={`Artist ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-white">Trusted by 3M+</span>
                                    <span>artists worldwide</span>
                                </div>
                                <div className="h-8 w-px bg-gray-800" />
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="w-4 h-4 bg-blue-500 rounded-sm" />
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-white">Support for your</span>
                                    <span>favorite software</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Content - 3D Grid Visualization */}
                    <FadeIn delay={0.3}>
                        <div className="relative">
                            <div className="grid grid-cols-4 gap-2 md:gap-4 transform rotate-[-5deg] scale-110 opacity-90">
                                {/* Generate a grid of placeholder textures */}
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-lg overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 ${i % 2 === 0 ? 'mt-8' : ''
                                            }`}
                                    >
                                        <div className={`w-full h-full bg-gradient-to-br ${[
                                            'from-gray-800 to-gray-900',
                                            'from-blue-900 to-slate-900',
                                            'from-stone-800 to-stone-900',
                                            'from-zinc-800 to-zinc-900',
                                            'from-neutral-800 to-neutral-900'
                                        ][i % 5]
                                            } p-1`}>
                                            <div className="w-full h-full rounded border border-white/10 bg-white/5 backdrop-blur-sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Overlay gradient to fade edges */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-[#111] pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-[#111] pointer-events-none" />
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
