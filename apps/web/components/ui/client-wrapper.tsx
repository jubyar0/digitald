"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
        <nav className="flex flex-1 items-center gap-2">
          <ThemeToggle />
        </nav>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </DashboardLayout>
  );
}