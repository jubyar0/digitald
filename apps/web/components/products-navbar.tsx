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
import { MenuIcon, ChevronDown, EyeIcon } from "lucide-react";
import { useState } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    _count: {
        products: number;
    };
}

interface ProductsNavbarProps {
    categories: Category[];
}

export function ProductsNavbar({ categories }: ProductsNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2" prefetch={true}>
                        <div className="h-6 w-6 bg-foreground rounded-sm flex items-center justify-center">
                            <span className="text-background font-bold text-lg leading-none">3D</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-foreground">
                            3D Marketplace
                        </span>
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            href="/products"
                            className="transition-colors hover:text-foreground/80 text-foreground font-medium"
                        >
                            Products
                        </Link>

                        {/* Categories Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60 font-medium outline-none">
                                Categories
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 bg-popover border-border text-popover-foreground max-h-[400px] overflow-y-auto">
                                <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                                    <Link href="/products" className="w-full">
                                        All Categories
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.id} asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                                        <Link href={`/products?category=${category.id}`} className="w-full flex items-center justify-between">
                                            <span>{category.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({category._count.products})
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </button>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here if needed */}
                    </div>
                    <nav className="flex items-center gap-2">
                        {!isLoading && session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                                            <span className="text-foreground text-xs font-medium">
                                                {session.user?.name?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                                        <Link href={`/public-profile/profiles/${session.user?.id || 'default'}`} prefetch={true} className="flex items-center">
                                            <EyeIcon className="mr-2 h-4 w-4" />
                                            Public Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                                        <Link href="/dashboard" prefetch={true}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/signin" prefetch={true}>
                                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                                    Sign in
                                </div>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </nav>
    );
}
