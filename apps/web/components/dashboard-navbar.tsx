

import Link from "next/link";
import { Eye, Download, Heart } from "lucide-react";
import { getNavigationItems } from "@/actions/navigation-actions";
import { NavbarMenu } from "./navbar-menu";

export async function DashboardNavbar() {
    const { data: items } = await getNavigationItems();

    return (
        <nav className="w-full border-b border-white/10 bg-[#1c1c1c] sticky top-16 z-40">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                {/* Left Navigation */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                    {items && items.length > 0 ? (
                        <NavbarMenu items={items} />
                    ) : (
                        // Fallback if no items or error
                        <>
                            <Link href="#" className="hover:text-white transition-colors">
                                Textures
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                Models
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                HDRIs
                            </Link>
                            <Link href="/3dm" className="hover:text-white transition-colors">
                                3DM
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                New assets
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Navigation */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/recently-viewed"
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        title="Recently Viewed"
                    >
                        <Eye className="h-4 w-4" />
                        <span className="hidden md:inline">Recently Viewed</span>
                    </Link>
                    <Link
                        href="/dashboard/downloads"
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        title="Downloads"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden md:inline">Downloads</span>
                    </Link>
                    <Link
                        href="/dashboard/favorites"
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        title="Favorites"
                    >
                        <Heart className="h-4 w-4" />
                        <span className="hidden md:inline">Favorites</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
