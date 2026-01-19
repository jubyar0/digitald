"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Github } from "lucide-react";

export function ThreeDMFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-[#09090b] mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">3</span>
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight">3daxes</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            High-quality 3D materials, models, and HDRIs for your creative projects.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="/"
                                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/"
                                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/"
                                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/"
                                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                aria-label="YouTube"
                            >
                                <Youtube className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/"
                                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                aria-label="GitHub"
                            >
                                <Github className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white">Products</h4>
                        <div className="space-y-3">
                            <Link href="/3dm" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Materials
                            </Link>
                            <Link href="/3dm/models" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                3D Models
                            </Link>
                            <Link href="/3dm/hdri" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                HDRIs
                            </Link>
                            <Link href="/3dm/textures" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Textures
                            </Link>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white">Resources</h4>
                        <div className="space-y-3">
                            <Link href="/docs" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Documentation
                            </Link>
                            <Link href="/tutorials" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Tutorials
                            </Link>
                            <Link href="/blog" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Blog
                            </Link>
                            <Link href="/support" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Support
                            </Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white">Company</h4>
                        <div className="space-y-3">
                            <Link href="/about" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                About Us
                            </Link>
                            <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Contact
                            </Link>
                            <Link href="/privacy" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="block text-sm text-gray-400 hover:text-white transition-colors" prefetch={true}>
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400 text-center md:text-left">
                            © {currentYear} 3daxes. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-400 text-center md:text-right">
                            Made with ❤️ for 3D artists
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
