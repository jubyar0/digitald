'use client'

import { ReactNode } from 'react'

export function PosLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-muted/20">
            {children}
        </div>
    )
}
