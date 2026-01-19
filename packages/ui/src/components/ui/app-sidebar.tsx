"use client";

import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Settings,
  Home,
  User,
  Layers,
  FileText
} from "lucide-react";
import { Sidebar } from "./sidebar";
import { cn } from "@repo/lib";
import { Button } from "./button";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: 'admin' | 'user';
}

export function AppSidebar({ userRole = 'admin', className, ...props }: AppSidebarProps) {
  // Different nav items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: "Dashboard",
            url: "/dashboard/admin",
            icon: Home,
            isActive: true,
          },
          {
            title: "Users",
            url: "/users",
            icon: Users,
          },
          {
            title: "Products",
            url: "/products",
            icon: Package,
          },
          {
            title: "Orders",
            url: "/orders",
            icon: ShoppingCart,
          },
          {
            title: "Analytics",
            url: "/analytics",
            icon: BarChart,
          },
          {
            title: "Settings",
            url: "/settings",
            icon: Settings,
          },
        ];
      case 'user':
        return [
          {
            title: "Dashboard",
            url: "/dashboard/user",
            icon: Home,
            isActive: true,
          },
          {
            title: "My Orders",
            url: "/orders",
            icon: ShoppingCart,
          },
          {
            title: "Wishlist",
            url: "/wishlist",
            icon: Layers,
          },
          {
            title: "Profile",
            url: "/profile",
            icon: User,
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <Sidebar className={cn("border-r p-4 flex flex-col gap-2", className)} {...props}>
      <div className="px-2 py-1.5 text-lg font-semibold">Navigation</div>
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.title}
            variant={item.isActive ? "secondary" : "ghost"}
            className="justify-start"
            asChild
          >
            <a href={item.url}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </a>
          </Button>
        ))}
      </div>
    </Sidebar>
  );
}