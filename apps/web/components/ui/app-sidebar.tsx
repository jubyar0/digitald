"use client"

import * as React from "react"
import {
    Package,
    ShoppingCart,
    Users,
    BarChart,
    Settings,
    Home,
    User,
    Store,
    LayoutTemplate
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"

interface NavItem {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    isActive?: boolean
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    userRole?: 'admin' | 'user'
}

function NavMain({ items }: { items: NavItem[] }) {
    return (
        <nav className="space-y-1">
            {items.map((item) => (
                <a
                    key={item.url}
                    href={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${item.isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                </a>
            ))}
        </nav>
    )
}

function NavProjects({ projects }: { projects: { name: string; url: string }[] }) {
    return (
        <div className="mt-6">
            <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Projects</h4>
            <nav className="space-y-1">
                {projects.map((project) => (
                    <a
                        key={project.url}
                        href={project.url}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        {project.name}
                    </a>
                ))}
            </nav>
        </div>
    )
}

function NavUser({ user }: { user: { name: string; email: string } }) {
    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
        </div>
    )
}

function TeamSwitcher() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-4 w-4" />
            </div>
            <span className="font-semibold">Digital Stock</span>
        </div>
    )
}

export function AppSidebar({ userRole = 'admin', ...props }: AppSidebarProps): JSX.Element {
    // Different nav items based on user role
    const getNavItems = (): NavItem[] => {
        switch (userRole) {
            case 'admin':
                return [
                    {
                        title: "Dashboard",
                        url: "/admin",
                        icon: Home,
                        isActive: true,
                    },
                    {
                        title: "Users",
                        url: "/admin/users",
                        icon: Users,
                    },
                    {
                        title: "Products",
                        url: "/admin/products",
                        icon: Package,
                    },
                    {
                        title: "Page Builder",
                        url: "/admin/page-builder",
                        icon: LayoutTemplate,
                    },
                    {
                        title: "Orders",
                        url: "/admin/orders",
                        icon: ShoppingCart,
                    },
                    {
                        title: "Analytics",
                        url: "/admin/analytics",
                        icon: BarChart,
                    },
                    {
                        title: "Settings",
                        url: "/admin/settings",
                        icon: Settings,
                    },
                ]
            case 'user':
                return [
                    {
                        title: "Dashboard",
                        url: "/user",
                        icon: Home,
                        isActive: true,
                    },
                    {
                        title: "My Orders",
                        url: "/user/orders",
                        icon: ShoppingCart,
                    },
                    {
                        title: "Wishlist",
                        url: "/user/wishlist",
                        icon: Package,
                    },
                    {
                        title: "Profile",
                        url: "/user/profile",
                        icon: User,
                    },
                ]
            default:
                return []
        }
    }

    const projects = [
        {
            name: "Project 1",
            url: "#",
        },
        {
            name: "Project 2",
            url: "#",
        },
    ]

    const user = {
        name: userRole === 'admin' ? "Admin User" : "Regular User",
        email: `${userRole}@example.com`,
    }

    return (
        <Sidebar className="border-r" {...props}>
            <SidebarHeader className="flex h-16 items-center border-b px-4">
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent className="flex-1 overflow-auto p-4">
                <NavMain items={getNavItems()} />
                <NavProjects projects={projects} />
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}