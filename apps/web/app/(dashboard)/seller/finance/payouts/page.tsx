import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSellerBalance, getSellerWithdrawals, getPayoutMethods } from "@/actions/seller"
import { RequestPayoutForm } from "./request-payout-form"
import { WithdrawalsTable } from "./withdrawals-table"

interface PageProps {
    searchParams: {
        page?: string
    }
}

export default async function PayoutsPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const pageSize = 10

    const [balance, withdrawalsData, payoutMethods] = await Promise.all([
        getSellerBalance(),
        getSellerWithdrawals(page, pageSize),
        getPayoutMethods()
    ])

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Payouts</h3>
                            <p className="dashboard-card-description">Request and track your payouts</p>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Payout</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RequestPayoutForm
                                    availableBalance={balance.availableBalance}
                                    currency={balance.currency || 'USD'}
                                    savedMethods={payoutMethods}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Balance Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Balance</p>
                                        <p className="text-2xl font-bold">${balance.balance.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Available for Withdrawal</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ${balance.availableBalance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">On Hold</p>
                                        <p className="text-2xl font-bold">
                                            ${(balance.balance - balance.availableBalance).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        Funds are held for a period before becoming available for withdrawal to ensure transaction security.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <WithdrawalsTable withdrawals={withdrawalsData.data as any} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
