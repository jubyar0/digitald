import { ReactNode } from 'react'
import { Demo1Layout } from '@/components/layouts/demo1/layout'

interface DashboardLayoutProps {
    children: ReactNode
    layoutRole?: 'admin' | 'seller' | 'user' | 'developer'
}

export async function DashboardLayout({ children, layoutRole = 'seller' }: DashboardLayoutProps) {
    return (
        <Demo1Layout layoutRole={layoutRole}>
            {children}
        </Demo1Layout>
    )
}

