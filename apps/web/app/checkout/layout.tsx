import LandingNavbar from "@/components/landing/navbar"
import FooterSection from "@/components/landing/footer"

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <LandingNavbar />
            <main className="flex-1">
                {children}
            </main>
            <FooterSection />
        </div>
    )
}
