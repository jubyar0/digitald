"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MenuIcon,
    Search,
    ShoppingCart,
    Heart,
    User,
    LogOut,
    LayoutDashboard,
    Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavbarMenu } from "@/components/navbar-menu";
import { getNavigationItems } from "@/actions/navigation-actions";
import type { NavigationItem } from "@/actions/navigation-actions";

export function ProductNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navItems, setNavItems] = useState<NavigationItem[]>([]);
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    useEffect(() => {
        async function loadNavigation() {
            const result = await getNavigationItems();
            if (result.success && result.data) {
                setNavItems(result.data as NavigationItem[]);
            }
        }
        loadNavigation();
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/95 backdrop-blur-md">
            <div className="container flex h-16 max-w-screen-2xl items-center px-4">
                {/* Logo & Navigation */}
                <div className="mr-4 hidden md:flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-2" prefetch={true}>
                        <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-lg leading-none">3D</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-white text-lg">
                            3D Marketplace
                        </span>
                    </Link>
                    <NavbarMenu items={navItems} />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none h-9 py-2 mr-2 px-0 text-base hover:bg-white/10 md:hidden text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </button>

                {/* Right Side Actions */}
                <div className="flex flex-1 items-center justify-end space-x-3">
                    {/* Search */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>

                    {/* Wishlist */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                    </Button>

                    {/* Cart */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10 relative"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                            0
                        </span>
                        <span className="sr-only">Cart</span>
                    </Button>

                    {/* User Menu */}
                    {!isLoading && session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/20">
                                        <span className="text-white text-sm font-medium">
                                            {session.user?.name?.charAt(0) || "U"}
                                        </span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#1c1c1c] border-white/10 text-white">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                                        <p className="text-xs leading-none text-gray-400">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    <Link href={`/public-profile/profiles/${session.user?.id || 'default'}`} prefetch={true} className="flex items-center">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Public Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    <Link href="/dashboard" prefetch={true} className="flex items-center">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/signin" prefetch={true}>
                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 h-9 px-4">
                                Sign in
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
