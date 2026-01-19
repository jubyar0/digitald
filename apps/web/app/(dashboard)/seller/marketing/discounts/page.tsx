import { Card, CardContent } from "@/components/ui/card"
import { getSellerDiscounts } from "@/actions/seller"
import { DiscountsTable } from "./discounts-table"
import { CreateDiscountDialog } from "./create-discount-dialog"

export default async function DiscountsPage() {
    const discounts = await getSellerDiscounts()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Discounts</h3>
                                <p className="dashboard-card-description">Create and manage discount campaigns</p>
                            </div>
                            <CreateDiscountDialog />
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <DiscountsTable discounts={discounts as any} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
