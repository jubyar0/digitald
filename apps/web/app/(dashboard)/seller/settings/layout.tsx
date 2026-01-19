import { getSellerProfile } from "@/actions/seller"
import { SettingsLayout } from "./settings-layout"

export default async function SettingsLayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const profile = await getSellerProfile()

    return (
        <SettingsLayout
            storeName={profile?.vendorName || "My Store"}
            storeLocation={profile?.location || "Location not set"}
            storeAvatar={profile?.avatar || undefined}
            userName={profile?.userName || "Store Owner"}
            userEmail={profile?.email || "user@example.com"}
            userAvatar={profile?.userAvatar}
        >
            {children}
        </SettingsLayout>
    )
}
