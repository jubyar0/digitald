'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { AdminSearchDialog } from '@/partials/dialogs/search/admin-search-dialog';
import { AdminNotificationsSheet } from '@/partials/topbar/admin-notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import {
    Bell,
    Menu,
    Search,
    LayoutDashboard,
    Globe,
    Users,
    Package,
    ShoppingCart,
    BarChart,
    Settings,
    Plus,
    Headphones,
    LayoutTemplate,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Button } from '@/components/dashboard/ui/button';
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/dashboard/ui/sheet';
import { Container } from '@/components/common/container';
import { SidebarMenu } from './sidebar-menu';
import { ThemeToggle } from '@/components/dashboard/ui/theme-toggle';
import { Badge as BadgeComponent } from '@/components/dashboard/ui/badge';

export function AdminHeader() {
    const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
    const pathname = usePathname();
    const mobileMode = useIsMobile();
    const scrollPosition = useScrollPosition();
    const headerSticky: boolean = scrollPosition > 0;

    // Close sheet when route changes
    useEffect(() => {
        setIsSidebarSheetOpen(false);
    }, [pathname]);

    return (
        <header
            className={cn(
                'header fixed top-0 z-10 start-0 flex items-center shrink-0 border-b border-border bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)] h-16',
                headerSticky && 'border-b border-border',
            )}
        >
            <Container className="flex justify-between items-stretch lg:gap-4">
                {/* Left Section - Logo & Mobile Menu */}
                <div className="flex gap-1 lg:hidden items-center gap-2.5">
                    <Link href="/admin" className="shrink-0 flex items-center gap-2" prefetch={true}>
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg hidden sm:inline-block">
                            Admin Dashboard
                        </span>
                    </Link>
                    <div className="flex items-center">
                        {mobileMode && (
                            <Sheet
                                open={isSidebarSheetOpen}
                                onOpenChange={setIsSidebarSheetOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button variant="ghost" mode="icon">
                                        <Menu className="text-muted-foreground/70" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    className="p-0 gap-0 w-[275px]"
                                    side="left"
                                    close={false}
                                >
                                    <SheetHeader className="p-0 space-y-0" />
                                    <SheetBody className="p-0 overflow-y-auto">
                                        <SidebarMenu />
                                    </SheetBody>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                </div>

                {/* Center Section - Quick Actions (Desktop) */}
                {!mobileMode && (
                    <div className="flex items-center gap-2">
                        <Link href="/admin/users" prefetch={true}>
                            <Button
                                variant="primary"
                                size="sm"
                                className="gap-2 bg-primary hover:bg-primary/90"
                            >
                                <Users className="size-4" />
                                <span>Users</span>
                            </Button>
                        </Link>
                        <Link href="/admin/products" prefetch={true}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Package className="size-4" />
                                <span>Products</span>
                            </Button>
                        </Link>
                        <Link href="/admin/orders" prefetch={true}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <ShoppingCart className="size-4" />
                                <span>Orders</span>
                                <BadgeComponent
                                    variant="secondary"
                                    className="ml-1 px-1.5 py-0.5 text-xs"
                                >
                                    5
                                </BadgeComponent>
                            </Button>
                        </Link>
                        <Link href="/admin/reports" prefetch={true}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <BarChart className="size-4" />
                                <span>Reports</span>
                            </Button>
                        </Link>
                        <Link href="/admin/support" prefetch={true}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Headphones className="size-4" />
                                <span>Support</span>
                            </Button>
                        </Link>
                        <Link href="/admin/page-builder" prefetch={true}>
                            <Button variant="outline" size="sm" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                                <LayoutTemplate className="size-4" />
                                <span>Page Builder</span>
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Right Section - Search, Notifications, User */}
                <div className="flex items-center gap-2 lg:gap-3">
                    {!mobileMode && (
                        <AdminSearchDialog
                            trigger={
                                <Button
                                    variant="ghost"
                                    mode="icon"
                                    shape="circle"
                                    className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                                >
                                    <Search className="size-4.5!" />
                                </Button>
                            }
                        />
                    )}

                    {/* Quick Actions Mobile */}
                    {mobileMode && (
                        <Link href="/admin/users" prefetch={true}>
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                            >
                                <Users className="size-4.5!" />
                            </Button>
                        </Link>
                    )}

                    <AdminNotificationsSheet
                        trigger={
                            <Button
                                variant="ghost"
                                mode="icon"
                                shape="circle"
                                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                            >
                                <Bell className="size-4.5!" />
                            </Button>
                        }
                    />

                    <Link href="/" prefetch={true}>
                        <Button
                            variant="ghost"
                            mode="icon"
                            shape="circle"
                            className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                            title="Go to Website"
                        >
                            <Globe className="size-4.5!" />
                        </Button>
                    </Link>

                    <ThemeToggle />

                    <UserDropdownMenu
                        trigger={
                            <NextImage
                                className="size-9 rounded-full border-2 border-primary shrink-0 cursor-pointer"
                                src={toAbsoluteUrl('/media/avatars/300-2.png')}
                                alt="User Avatar"
                                width={36}
                                height={36}
                                priority
                                unoptimized
                            />
                        }
                    />
                </div>
            </Container>
        </header>
    );
}
