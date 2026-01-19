"use client"

import * as React from "react"
import {
  HomeIcon,
  ShoppingCartIcon,
  HeartIcon,
  PackageIcon,
  WalletIcon,
  SettingsIcon,
  TicketIcon,
  BellIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  StarIcon,
  MessageSquareIcon,
  GiftIcon,
  FileTextIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "User Account",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/user",
      icon: HomeIcon,
    },
    {
      title: "Profile",
      url: "/user/profile",
      icon: UserIcon,
    },
    {
      title: "Cart",
      url: "/user/cart",
      icon: ShoppingCartIcon,
    },
    {
      title: "Wishlist",
      url: "/user/wishlist",
      icon: HeartIcon,
    },
    {
      title: "Downloads",
      url: "/user/downloads",
      icon: PackageIcon,
    },
    {
      title: "Security",
      url: "/user/security",
      icon: SettingsIcon,
    },
    {
      title: "Account",
      url: "/user/account",
      icon: CreditCardIcon,
    },
    {
      title: "Preferences",
      url: "/user/preferences",
      icon: StarIcon,
    },
    {
      title: "Payment Methods",
      url: "/user/payment-methods",
      icon: WalletIcon,
    },
    {
      title: "Become a Seller",
      url: "/user/become-seller",
      icon: GiftIcon,
    },
  ],
}

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <a href="/user">
                <UserIcon className="h-5 w-5 text-sidebar-primary" />
                <span className="text-lg font-bold text-sidebar-primary">User Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-2 p-2 bg-sidebar">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2 bg-sidebar">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
