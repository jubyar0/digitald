import { Suspense } from 'react';
import { getWithdrawals } from '@/actions/admin';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card';
import { Badge } from '@/components/dashboard/ui/badge';
import { Button } from '@/components/dashboard/ui/button';
import { formatCurrency } from '@/lib/utils';
import { WithdrawalApprovalButtons } from './withdrawal-approval-buttons';

async function WithdrawalsContent() {
    const session = await getCurrentSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/unauthorized');
    }

    const { data: withdrawals } = await getWithdrawals(1, 50);

    return (
        <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {withdrawals.filter(w => w.status === 'PENDING').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount (Pending)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(
                                withdrawals
                                    .filter(w => w.status === 'PENDING')
                                    .reduce((sum, w) => sum + w.amount, 0)
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {withdrawals.filter(w => w.status === 'COMPLETED').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Withdrawals Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {withdrawals.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No withdrawal requests found.
                            </p>
                        ) : (
                            withdrawals.map((withdrawal) => (
                                <div
                                    key={withdrawal.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{withdrawal.vendor.name}</p>
                                            <Badge
                                                variant={
                                                    withdrawal.status === 'PENDING'
                                                        ? 'default'
                                                        : withdrawal.status === 'COMPLETED'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                }
                                            >
                                                {withdrawal.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {withdrawal.vendor.user.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Method: {withdrawal.method} | Details: {withdrawal.details}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}
                                            {withdrawal.processedAt && (
                                                <> | Processed: {new Date(withdrawal.processedAt).toLocaleDateString()}</>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-lg font-bold">{formatCurrency(withdrawal.amount)}</p>
                                            <p className="text-xs text-muted-foreground">{withdrawal.currency}</p>
                                        </div>

                                        {withdrawal.status === 'PENDING' && (
                                            <WithdrawalApprovalButtons
                                                withdrawalId={withdrawal.id}
                                                vendorName={withdrawal.vendor.name}
                                                amount={withdrawal.amount}
                                                currency={withdrawal.currency}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminWithdrawalsPage() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="dashboard-grid dashboard-grid-cols-4 dashboard-padding">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold">Withdrawal Management</h1>
                        <p className="text-muted-foreground">
                            Review and process seller withdrawal requests
                        </p>
                    </div>

                    <Suspense
                        fallback={
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader>
                                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <Card>
                                    <CardHeader>
                                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        }
                    >
                        <WithdrawalsContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
