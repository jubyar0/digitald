"use client";

import * as React from "react";
import { cn } from "@repo/lib";
import { Moon, Sun, Menu, Bell } from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Separator } from "./separator";
import { useTheme } from "next-themes";

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  userRole?: 'admin' | 'user' | 'vendor';
}

export function DashboardLayout({ className, children, sidebar, userRole, ...props }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={cn("flex min-h-screen w-full flex-col bg-muted/40", className)} {...props}>
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              {sidebar}
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <div className="hidden sm:block border-r bg-background">
          {sidebar}
        </div>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}