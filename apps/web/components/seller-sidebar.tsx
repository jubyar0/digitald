"use client"
// re-trigger build

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChartIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  SettingsIcon,
  StoreIcon,
  CreditCardIcon,
  FileDigitIcon,
  TrendingUpIcon,
  FileSearchIcon,
  TicketIcon,
  BellIcon,
  HomeIcon,
  PlusIcon,
  ListIcon,
  TagIcon,
  ImageIcon,
  TruckIcon,
  PercentIcon,
  GiftIcon,
  MessageSquareIcon,
  StarIcon,
  EyeIcon,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarFormActions } from "@/components/seller/sidebar-form-actions"

const data = {
  user: {
    name: "Seller User",
    email: "seller@example.com",
    avatar: "/avatars/seller.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/seller",
      icon: HomeIcon,
    },
    {
      title: "Products",
      url: "#",
      icon: PackageIcon,
      items: [
        {
          title: "All Products",
          url: "/seller/products",
        },
        {
          title: "Add Product",
          url: "/seller/products/add",
          tooltip: "Add a new product to your store",
        },

        {
          title: "Inventory",
          url: "/seller/products/inventory",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingCartIcon,
      tooltip: "Manage your orders",
      badge: "3",
      items: [
        {
          title: "All Orders",
          url: "/seller/orders",
        },
        {
          title: "Pending",
          url: "/seller/orders/pending",
        },
        {
          title: "Completed",
          url: "/seller/orders/completed",
        },
        {
          title: "Returns",
          url: "/seller/orders/returns",
        },
      ],
    },
    {
      title: "Apps",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "My Apps",
          url: "/seller/apps",
        },
        {
          title: "App Store",
          url: "/seller/app-store",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: UsersIcon,
      isActive: true,
      items: [
        {
          title: "All Customers",
          url: "/seller/customers",
        },
        {
          title: "Segments",
          url: "/seller/customers/segments",
        },
        {
          title: "Reviews",
          url: "/seller/reviews",
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: TrendingUpIcon,
      items: [
        {
          title: "Discounts",
          url: "/seller/marketing/discounts",
        },
        {
          title: "Coupons",
          url: "/seller/marketing/coupons",
        },
        {
          title: "Promotions",
          url: "/seller/marketing/promotions",
        },
        {
          title: "Affiliates",
          url: "/seller/marketing/affiliates",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/seller/analytics",
      icon: BarChartIcon,
      tooltip: "View your store analytics",
    },
    {
      title: "Finance",
      url: "#",
      icon: CreditCardIcon,
      items: [
        {
          title: "Payments",
          url: "/seller/finance/payments",
        },
        {
          title: "Payouts",
          url: "/seller/finance/payouts",
        },
        {
          title: "Invoices",
          url: "/seller/finance/invoices",
        },
      ],
    },
    {
      title: "Store Settings",
      url: "#",
      icon: SettingsIcon,
      items: [
        {
          title: "Store Profile",
          url: "/seller/settings/profile",
        },
        {
          title: "Shipping",
          url: "/seller/settings/shipping",
        },
        {
          title: "Tax Settings",
          url: "/seller/settings/tax",
        },
        {
          title: "Payout Methods",
          url: "/seller/settings/payout-methods",
        },
        {
          title: "Notifications",
          url: "/seller/settings/notifications",
        },
      ],
    },
    {
      title: "Support",
      url: "/seller/support",
      icon: TicketIcon,
      tooltip: "Get help and support",
    },
  ],
}

export function SellerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar pt-4 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/seller">
                <div className="dark:hidden">
                  <Image
                    src="/media/app/default-logo.svg"
                    className="h-[22px] w-auto max-w-none"
                    alt="Logo"
                    width={150}
                    height={22}
                    priority
                    style={{ height: 'auto' }}
                  />
                </div>
                <div className="hidden dark:block">
                  <Image
                    src="/media/app/default-logo-dark.svg"
                    className="h-[22px] w-auto max-w-none"
                    alt="Logo"
                    width={150}
                    height={22}
                    priority
                    style={{ height: 'auto' }}
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-2 p-2 bg-sidebar">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2 bg-sidebar">
        <SidebarFormActions />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
