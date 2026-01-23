"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  ShoppingCartIcon,
  StoreIcon,
  PackageIcon,
  CreditCardIcon,
  FileDigitIcon,
  TrendingUpIcon,
  FileSearchIcon,
  MegaphoneIcon,
  ShieldIcon,
  TicketIcon,
  FileCogIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
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
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users Management",
      url: "#",
      icon: UsersIcon,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Banned Users",
          url: "/admin/users/banned",
        },
      ],
    },
    {
      title: "Vendors Management",
      url: "#",
      icon: StoreIcon,
      items: [
        {
          title: "All Vendors",
          url: "/admin/vendors",
        },
        {
          title: "Vendor Applications",
          url: "/admin/vendors/applications",
        },
      ],
    },
    {
      title: "Products Management",
      url: "#",
      icon: PackageIcon,
      items: [
        {
          title: "Add New Product",
          url: "/admin/products/new",
        },
        {
          title: "All Products",
          url: "/admin/products",
        },
        {
          title: "In House Products",
          url: "/admin/products/in-house",
        },
        {
          title: "Add New Digital Product",
          url: "/admin/products/digital/new",
        },
        {
          title: "Seller Products",
          url: "/admin/products/seller",
        },
        {
          title: "Bulk Import",
          url: "/admin/products/import",
        },
        {
          title: "Bulk Export",
          url: "/admin/products/export",
        },
        {
          title: "Categories",
          url: "/admin/products/categories",
        },
        {
          title: "Category Based Discount",
          url: "/admin/products/category-discounts",
        },
        {
          title: "Brand",
          url: "/admin/products/brands",
        },
        {
          title: "Custom Label",
          url: "/admin/products/custom-labels",
        },
        {
          title: "Attribute",
          url: "/admin/products/attributes",
        },
        {
          title: "Colors",
          url: "/admin/products/colors",
        },
        {
          title: "Size Guide",
          url: "/admin/products/size-guide",
        },
        {
          title: "Warranty",
          url: "/admin/products/warranty",
        },
        {
          title: "Smart Bar",
          url: "/admin/products/smart-bar",
        },
        {
          title: "Product Reviews",
          url: "/admin/products/reviews",
        },
      ],
    },
    {
      title: "Orders & Transactions",
      url: "#",
      icon: ShoppingCartIcon,
      items: [
        {
          title: "Orders",
          url: "/admin/orders",
        },
        {
          title: "Transaction Logs",
          url: "/admin/transactions/logs",
        },
      ],
    },
    {
      title: "Apps Management",
      url: "#",
      icon: ShoppingCartIcon,
      items: [
        {
          title: "All Apps",
          url: "/admin/apps",
        },
      ],
    },
    {
      title: "Withdrawals",
      url: "/admin/withdrawals",
      icon: CreditCardIcon,
    },
    {
      title: "Digital Files",
      url: "/admin/files",
      icon: FileDigitIcon,
    },
    {
      title: "Reports & Analytics",
      url: "/admin/reports",
      icon: TrendingUpIcon,
    },
    {
      title: "Platform Settings",
      url: "#",
      icon: SettingsIcon,
      items: [
        {
          title: "General Settings",
          url: "/admin/settings/general",
        },
        {
          title: "Payment Settings",
          url: "/admin/settings/payments",
        },
        {
          title: "Email Settings",
          url: "/admin/settings/email",
        },
        {
          title: "Theme Settings",
          url: "/admin/settings/theme",
        },
      ],
    },
    {
      title: "SEO Management",
      url: "/admin/seo",
      icon: FileSearchIcon,
    },
    {
      title: "CMS Pages",
      url: "/admin/cms",
      icon: FileTextIcon,
    },
    {
      title: "Support & Tickets",
      url: "/admin/support",
      icon: TicketIcon,
    },
    {
      title: "System Logs",
      url: "/admin/logs",
      icon: FileCogIcon,
    },
    {
      title: "Announcements",
      url: "/admin/announcements",
      icon: MegaphoneIcon,
    },
    {
      title: "Admin Accounts",
      url: "/admin/accounts",
      icon: ShieldIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link href="/admin">
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
        {data.documents.length > 0 && <NavDocuments items={data.documents} />}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2 bg-sidebar">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}