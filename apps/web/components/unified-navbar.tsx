"use client";

import Link from "next/link";
import Image from "next/image";
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
import { MenuIcon, ChevronDown, EyeIcon, ArrowRight, Search, LogIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    name: string;
    thumbnail: string | null;
    price: number;
    description?: string | null;
}

interface ChildCategory {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    _count: {
        products: number;
    };
    products?: Product[];
}

interface ParentCategory {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    children: ChildCategory[];
    _count: {
        products: number;
    };
    products?: Product[];
}

interface UnifiedNavbarProps {
    categories?: ParentCategory[];
}

export function UnifiedNavbar({ categories = [] }: UnifiedNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
    const [isHoveringMenu, setIsHoveringMenu] = useState(false);
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (categoryId: string) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setOpenMegaMenu(categoryId);
        setIsHoveringMenu(true);
    };

    const handleMouseLeave = () => {
        setIsHoveringMenu(false);
        closeTimeoutRef.current = setTimeout(() => {
            setOpenMegaMenu(null);
        }, 300); // 300ms delay before closing
    };

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white text-foreground border-b border-gray-200 shadow-sm relative">
            <div className="container mx-auto px-4">
                {/* Top Row: Logo, Search, Auth */}
                <div className="flex items-center justify-between h-[72px] gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 text-orange-600" prefetch={true}>
                        <span className="font-serif font-bold text-3xl tracking-tighter">Poliigon</span>
                    </Link>

                    {/* Search Bar - Etsy Style (Pill shape) */}
                    <div className="hidden md:flex flex-1 max-w-3xl relative">
                        <div className="flex w-full bg-gray-100/50 rounded-full border border-gray-300 hover:shadow-md hover:bg-white transition-all duration-200 h-11 items-center focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black/20 focus-within:bg-white">
                            <input
                                type="text"
                                placeholder="Search for anything"
                                className="flex-1 px-6 text-black text-[15px] outline-none bg-transparent placeholder:text-gray-500 w-full h-full rounded-l-full"
                            />
                            <button className="h-9 w-9 mr-1 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 shrink-0">

                        {!isLoading && session ? (
                            <>
                                <Link href="/account/wishlist" className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative group">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                    <span className="sr-only">Favorites</span>
                                </Link>

                                <Link href="/account/cart" className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                    </div>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 text-gray-700 p-0 ml-1">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
                                                {session.user?.image ? (
                                                    <Image src={session.user.image} alt={session.user.name || "User"} width={32} height={32} className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                )}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200 text-black shadow-lg rounded-xl p-2">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1 p-2">
                                                <p className="text-sm font-semibold leading-none">{session.user?.name}</p>
                                                <p className="text-xs leading-none text-gray-500">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-gray-100" />

                                        {/* My Account Section */}
                                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Account</div>

                                        <DropdownMenuItem asChild className="focus:bg-gray-100 focus:text-black cursor-pointer rounded-lg">
                                            <Link href="/account/profile" className="flex items-center py-2">
                                                My Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-gray-100 focus:text-black cursor-pointer rounded-lg">
                                            <Link href="/account/orders" className="flex items-center py-2">
                                                Purchases and reviews
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-gray-100 focus:text-black cursor-pointer rounded-lg">
                                            <Link href="/account/become-seller" className="flex items-center py-2">
                                                Sell on Poliigon
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-gray-100 my-1" />
                                        <DropdownMenuItem
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="focus:bg-gray-100 focus:text-black cursor-pointer rounded-lg text-red-600 focus:text-red-600"
                                        >
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/signin" className="px-4 py-2 font-medium hover:bg-gray-100 rounded-full transition-colors">
                                    Sign in
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm" className="bg-gray-900 hover:bg-black text-white font-medium border-0 h-10 px-5 rounded-full shadow-sm">
                                        Register
                                    </Button>
                                </Link>
                                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-black"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation */}
                <div className="hidden md:flex items-center justify-between h-10 text-sm pb-2">
                    <div className="flex items-center gap-6 mx-auto">
                        {/* Static Links for common Etsy-like categories */}
                        <Link href="/products?category=deals" className="flex items-center gap-1 font-medium text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all">
                            <span className="text-orange-600">★</span>   Gift Ideas
                        </Link>

                        {/* Dynamic Categories */}
                        {categories.slice(0, 8).map((category) => {
                            const hasChildren = category.children && category.children.length > 0;
                            const showMegaMenu = hasChildren || (category.products && category.products.length > 0);

                            return (
                                <div
                                    key={category.id}
                                    className="relative h-full flex items-center"
                                    onMouseEnter={() => showMegaMenu && handleMouseEnter(category.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        href={`/products?category=${category.id}`}
                                        className={`flex items-center gap-1 font-medium transition-colors px-3 py-1.5 rounded-full ${openMegaMenu === category.id
                                            ? "bg-gray-100 text-black"
                                            : "text-gray-600 hover:text-black hover:bg-gray-100"
                                            }`}
                                    >
                                        {category.name}
                                    </Link>

                                    {/* Mega Menu */}
                                    <AnimatePresence>
                                        {openMegaMenu === category.id && (
                                            <motion.div
                                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[800px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-8 z-50 text-black cursor-default"
                                                onMouseEnter={() => handleMouseEnter(category.id)}
                                                onMouseLeave={handleMouseLeave}
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                            >
                                                <div className="flex gap-10">
                                                    {/* Left side - Child Categories */}
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                            Browse {category.name}
                                                            <ArrowRight className="h-4 w-4 text-gray-400" />
                                                        </h4>

                                                        {hasChildren && (
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                                {category.children.map((childCategory) => (
                                                                    <Link
                                                                        key={childCategory.id}
                                                                        href={`/products?category=${childCategory.id}`}
                                                                        className="text-[15px] text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-2 transition-colors flex items-center justify-between group"
                                                                    >
                                                                        {childCategory.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                                            <Link href={`/products?category=${category.id}`} className="text-sm font-semibold text-gray-900 underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-black transition-all">
                                                                View all {category.name} items
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* Right side - Featured/Visuals */}
                                                    <div className="w-[280px] shrink-0 border-l border-gray-100 pl-8">
                                                        <h4 className="font-bold text-gray-900 mb-4">Editors&apos; Picks</h4>
                                                        <div className="flex flex-col gap-4">
                                                            {category.products?.slice(0, 2).map(product => (
                                                                <Link key={product.id} href={`/products/${product.id}`} className="group flex gap-3 items-center">
                                                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0 relative">
                                                                        {product.thumbnail && (
                                                                            <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:underline">{product.name}</div>
                                                                        <div className="text-xs text-gray-500 mt-0.5">${product.price}</div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <div className="p-4 flex flex-col gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input type="text" placeholder="Search..." className="w-full h-10 pl-9 pr-4 bg-gray-100 rounded-full text-sm outline-none" />
                                </div>

                                <div className="flex flex-col gap-1">
                                    {categories.map((cat) => (
                                        <Link key={cat.id} href={`/products?category=${cat.id}`} className="py-2 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg">
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
