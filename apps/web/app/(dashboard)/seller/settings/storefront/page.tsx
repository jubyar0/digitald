import { getStorefrontSettings } from "@/actions/storefront"
import { StorefrontCustomizer } from "./storefront-customizer"

export default async function StorefrontPage() {
    const settings = await getStorefrontSettings()

    if (!settings) {
        return <div>Error loading settings</div>
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="flex flex-1 flex-col gap-8 dashboard-padding">
                <div className="dashboard-card p-6">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Storefront Customizer</h3>
                        <p className="dashboard-card-description">
                            Customize how your store looks to customers
                        </p>
                    </div>
                </div>

                <StorefrontCustomizer initialSettings={settings} />
            </div>
        </div>
    )
}
