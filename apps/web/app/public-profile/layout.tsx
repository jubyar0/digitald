import { UnifiedNavbarWrapper } from '@/components/unified-navbar-wrapper'

export default function PublicProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen dark bg-[#09090b]">
            <UnifiedNavbarWrapper />
            {children}
        </div>
    )
}
