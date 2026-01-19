import { Card, CardContent } from "@/components/ui/card"
import { getSellerProfile } from "@/actions/seller"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
    const profile = await getSellerProfile()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Seller Profile</h3>
                            <p className="dashboard-card-description">
                                Manage your business profile on the 3DM marketplace
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <ProfileForm profile={profile} />
                        </CardContent>
                    </Card>


                </div>
            </div>
        </div>
    )
}
