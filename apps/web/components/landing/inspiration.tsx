"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function Inspiration() {
    const showcaseItems = [
        {
            title: "Beach House Render",
            author: "Alex Martinez",
            size: "col-span-2 row-span-2",
            gradient: "from-blue-900/40 to-cyan-900/40"
        },
        {
            title: "Modern Architecture",
            author: "Sarah Chen",
            size: "col-span-1 row-span-2",
            gradient: "from-gray-800/40 to-slate-900/40"
        },
        {
            title: "Interior Design",
            author: "James Wilson",
            size: "col-span-1 row-span-1",
            gradient: "from-amber-900/40 to-orange-900/40"
        },
        {
            title: "Product Visualization",
            author: "Emma Davis",
            size: "col-span-1 row-span-1",
            gradient: "from-stone-800/40 to-neutral-900/40"
        },
        {
            title: "Minimalist Space",
            author: "Michael Brown",
            size: "col-span-1 row-span-1",
            gradient: "from-zinc-800/40 to-gray-900/40"
        }
    ];

    return (
        <section className="bg-[#0a0a0a] py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Get inspired. See how others
                        <br />
                        are creating with Poliigon.
                    </h2>
                    <p className="text-xl text-gray-400">
                        Explore stunning renders from our community
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {showcaseItems.map((item, index) => (
                        <div
                            key={index}
                            className={`group relative ${item.size} rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient} border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer`}
                            style={{ minHeight: index === 0 ? '400px' : index < 3 ? '400px' : '190px' }}
                        >
                            {/* Placeholder gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

                            {/* Content overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-gray-300 text-sm">by {item.author}</p>
                                </div>
                            </div>

                            {/* Hover icon */}
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRightIcon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                    >
                        View all community renders
                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
