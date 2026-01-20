import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getPayoutMethods } from "@/actions/seller"
import { PayoutMethodsList } from "./payout-methods-list"

export const dynamic = 'force-dynamic'

export default async function PayoutMethodsPage() {
    const methods = await getPayoutMethods()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Payout Methods</h3>
                            <p className="dashboard-card-description">
                                Manage your payment information for receiving withdrawals
                            </p>
                        </div>
                    </div>

                    <PayoutMethodsList initialMethods={methods} />
                </div>
            </div>
        </div>
    )
}
