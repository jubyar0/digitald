'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { SellerSearchDialog } from '@/partials/dialogs/search/seller-search-dialog';
import { SellerNotificationsSheet } from '@/partials/topbar/seller-notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import {
    Bell,
    Menu,
    Search,
    Plus,
    ShoppingCart,
    BarChart,
    Package,
    Store,
    Globe,
    Headphones,
    Sparkles,
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
import { Badge as BadgeComponent } from '@/components/dashboard/ui/badge';
import { ThemeToggle } from '@/components/dashboard/ui/theme-toggle';
import { useChatbot } from '@/components/chatbot/chatbot-context';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/dashboard/ui/tooltip';

// Default avatar fallback
const DEFAULT_AVATAR = '/media/avatars/300-2.png';

export function SellerHeader() {
    const { data: session } = useSession();
    const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
    const pathname = usePathname();
    const mobileMode = useIsMobile();
    const scrollPosition = useScrollPosition();
    const headerSticky: boolean = scrollPosition > 0;
    const { openChat } = useChatbot();

    // Use session data or fallback values
    const userAvatar = session?.user?.image || DEFAULT_AVATAR;
    const userName = session?.user?.name || 'aiouana HOUSSAM';
    const userEmail = session?.user?.email || 'seller@example.com';

    // Close sheet when route changes
    useEffect(() => {
        setIsSidebarSheetOpen(false);
    }, [pathname]);

    return (
        <header
            className={cn(
                'header fixed top-0 z-10 start-0 flex items-center shrink-0 border-b border-border bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)] h-16',
            )}
        >
            <Container className="flex justify-between items-stretch lg:gap-4">
                {/* Left Section - Logo & Mobile Menu */}
                <div className="flex gap-1 lg:hidden items-center gap-2.5">
                    <Link href="/seller" className="shrink-0 flex items-center gap-2">
                        <Store className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg hidden sm:inline-block">
                            Seller Dashboard
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
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/seller/products/add">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="gap-2 bg-primary hover:bg-primary/90"
                                    >
                                        <Plus className="size-4" />
                                        <span>Add Product</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Add New Product</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/seller/orders">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <ShoppingCart className="size-4" />
                                        <span>Orders</span>
                                        <BadgeComponent
                                            variant="secondary"
                                            className="ml-1 px-1.5 py-0.5 text-xs"
                                        >
                                            3
                                        </BadgeComponent>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>View Orders</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/seller/analytics">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <BarChart className="size-4" />
                                        <span>Analytics</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>View Analytics</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/seller/support">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Headphones className="size-4" />
                                        <span>Support</span>
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Contact Support</TooltipContent>
                        </Tooltip>
                    </div>
                )}

                {/* Right Section - Search, Notifications, User */}
                <div className="flex items-center gap-2 lg:gap-3">
                    {/* Search */}
                    {!mobileMode && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <SellerSearchDialog
                                        trigger={
                                            <Button
                                                variant="ghost"
                                                mode="icon"
                                                shape="circle"
                                                className="size-9 hover:bg-primary/10 hover:[\&_svg]:text-primary"
                                            >
                                                <Search className="size-4.5!" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Search</TooltipContent>
                        </Tooltip>
                    )}

                    {/* Quick Actions Mobile */}
                    {mobileMode && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/seller/products/add">
                                    <Button
                                        variant="ghost"
                                        mode="icon"
                                        shape="circle"
                                        className="size-9 hover:bg-primary/10 hover:[\&_svg]:text-primary"
                                    >
                                        <Plus className="size-4.5!" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Add New Product</TooltipContent>
                        </Tooltip>
                    )}

                    {/* Notifications */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <SellerNotificationsSheet
                                    trigger={
                                        <Button
                                            variant="ghost"
                                            mode="icon"
                                            shape="circle"
                                            className="size-9 hover:bg-primary/10 hover:[\&_svg]:text-primary relative"
                                        >
                                            <Bell className="size-4.5!" />
                                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                            </span>
                                        </Button>
                                    }
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Notifications</TooltipContent>
                    </Tooltip>

                    {/* Go to Website */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    mode="icon"
                                    shape="circle"
                                    className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
                                >
                                    <Globe className="size-4.5!" />
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>Go to Website</TooltipContent>
                    </Tooltip>

                    {/* AI Ask Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-9 px-3 gap-1.5 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                                onClick={openChat}
                            >
                                <Sparkles className="size-4" />
                                <span className="text-sm font-medium">Ask</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ask AI Assistant</TooltipContent>
                    </Tooltip>

                    <ThemeToggle />

                    {/* User Profile */}
                    <UserDropdownMenu
                        trigger={
                            <img
                                className="size-9 rounded-full border-2 border-primary shrink-0 cursor-pointer"
                                src={userAvatar.startsWith('/') ? toAbsoluteUrl(userAvatar) : userAvatar}
                                alt={userName}
                            />
                        }
                    />
                </div>
            </Container>
        </header>
    );
}

