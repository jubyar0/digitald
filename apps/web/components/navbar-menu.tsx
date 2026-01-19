"use client"

import Link from "next/link"
import type { NavigationItem } from "@/actions/navigation-actions"

interface NavbarMenuProps {
    items: NavigationItem[]
}

export function NavbarMenu({ items }: NavbarMenuProps) {
    if (!items || items.length === 0) {
        return null
    }

    return (
        <nav className="flex items-center gap-6">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={item.url}
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}

