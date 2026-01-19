"use client"

import Link from "next/link"
import {
  BarChartIcon,
  PackageIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  SettingsIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Globe } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    url: "/seller",
    icon: BarChartIcon,
  },
  {
    title: "Products",
    url: "/seller/products",
    icon: PackageIcon,
  },
  {
    title: "Orders",
    url: "/seller/orders",
    icon: ShoppingCartIcon,
  },
  {
    title: "Earnings",
    url: "/seller/earnings",
    icon: CreditCardIcon,
  },
  {
    title: "Analytics",
    url: "/seller/analytics",
    icon: TrendingUpIcon,
  },
  {
    title: "Upload Product",
    url: "/seller/upload-product",
    icon: FileTextIcon,
  },
  {
    title: "Settings",
    url: "/seller/settings",
    icon: SettingsIcon,
  },
]

export function SellerNavbar() {
  return (
    <div className="border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/seller" prefetch={true}>
            <span className="hidden font-bold sm:inline-block">Seller Dashboard</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="transition-colors hover:text-foreground/80"
                prefetch={true}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="ml-6 flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80"
            prefetch={true}
          >
            <Globe className="h-4 w-4" />
            Go to Website
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/seller" className="flex items-center" prefetch={true}>
                <span className="font-bold">Seller Dashboard</span>
              </Link>
              <nav className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="text-sm font-medium transition-colors hover:text-foreground"
                    prefetch={true}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </div>
                  </Link>
                ))}
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-foreground"
                  prefetch={true}
                >
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Go to Website
                  </div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}