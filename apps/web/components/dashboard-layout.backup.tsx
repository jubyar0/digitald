import { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SellerSidebar } from "@/components/seller-sidebar"

interface DashboardLayoutProps {
    children: ReactNode
    layoutRole?: 'admin' | 'seller' | 'user'
}

export function DashboardLayout({ children, layoutRole = 'seller' }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            {layoutRole === 'seller' ? (
                <SellerSidebar />
            ) : (
                <AppSidebar userRole={layoutRole === 'admin' ? 'admin' : 'user'} />
            )}
            <main className="flex-1 flex flex-col min-h-screen">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1">
                        <span className="font-semibold">
                            {layoutRole === 'admin' ? 'Admin Dashboard' :
                                layoutRole === 'seller' ? 'Seller Dashboard' : 'Dashboard'}
                        </span>
                    </div>
                </header>
                <div className="flex-1 p-4 md:p-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
