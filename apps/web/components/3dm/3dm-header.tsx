"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchIcon, MenuIcon, User, LogOut, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/providers/dynamic-theme-provider";

export function ThreeDMHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const { branding } = useBranding();

    return (
        <nav className="w-full border-b border-white/10 bg-[#09090b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo and Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2" prefetch={true}>
                        {branding.logoUrl || branding.logoDarkUrl ? (
                            <Image
                                src={branding.logoDarkUrl || branding.logoUrl}
                                alt={branding.siteName}
                                width={parseInt(branding.logoWidth) || 150}
                                height={parseInt(branding.logoHeight) || 40}
                                className="object-contain"
                            />
                        ) : (
                            <>
                                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">{branding.siteName?.charAt(0) || '3'}</span>
                                </div>
                                <span className="text-white font-bold text-xl tracking-tight">{branding.siteName || '3daxes'}</span>
                            </>
                        )}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    <div className="relative w-96">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search 5,000+ Textures, Models and HDRIs"
                            className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link href="/3dm" className="hover:text-white transition-colors" prefetch={true}>
                            Materials
                        </Link>
                        <Link href="/3dm/models" className="hover:text-white transition-colors" prefetch={true}>
                            Models
                        </Link>
                        <Link href="/3dm/hdri" className="hover:text-white transition-colors" prefetch={true}>
                            HDRIs
                        </Link>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                        <ShoppingCart className="h-5 w-5" />
                    </Button>
                    {!isLoading && session ? (
                        <>
                            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors" prefetch={true}>
                                <User className="h-4 w-4" />
                                My Account
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#09090b] border-white/10">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{session.user?.name || "User"}</p>
                                            <p className="text-xs leading-none text-gray-400">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem asChild className="text-gray-300 focus:text-white focus:bg-white/10">
                                        <Link href="/dashboard" prefetch={true}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-300 focus:text-white focus:bg-white/10">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors" prefetch={true}>
                                Login
                            </Link>
                            <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors" prefetch={true}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-white/10 bg-[#09090b] p-4 space-y-4">
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full bg-white/10 border border-white/10 rounded-lg py-2 px-4 text-sm text-white placeholder:text-gray-400"
                    />
                    <div className="flex flex-col gap-4 text-sm font-medium text-gray-300">
                        <Link href="/3dm" className="hover:text-white" prefetch={true}>Materials</Link>
                        <Link href="/3dm/models" className="hover:text-white" prefetch={true}>Models</Link>
                        <Link href="/3dm/hdri" className="hover:text-white" prefetch={true}>HDRIs</Link>
                        {session && (
                            <Link href="/dashboard" className="hover:text-white" prefetch={true}>My Account</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
