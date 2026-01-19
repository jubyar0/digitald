import { Suspense } from 'react';
import { getEscrowAccounts, getEscrowStats } from '@/actions/escrow';
import { getCurrentSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Wallet, ArrowUpDown, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';

async function EscrowContent() {
    const session = await getCurrentSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/unauthorized');
    }

    const [{ data: accounts }, stats] = await Promise.all([
        getEscrowAccounts(1, 50),
        getEscrowStats()
    ]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAccounts}</div>
                        <p className="text-xs text-muted-foreground">Active escrow accounts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
                        <p className="text-xs text-muted-foreground">Across all vendors</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAvailable)}</div>
                        <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {formatCurrency(stats.pendingWithdrawalsAmount)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pendingWithdrawalsCount} withdrawal requests
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Escrow Accounts Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Vendor Escrow Accounts
                    </CardTitle>
                    <CardDescription>
                        Manage vendor escrow balances and view transaction history
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {accounts.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No escrow accounts found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-medium">Vendor</th>
                                            <th className="text-left p-3 font-medium">Email</th>
                                            <th className="text-right p-3 font-medium">Balance</th>
                                            <th className="text-right p-3 font-medium">Available</th>
                                            <th className="text-right p-3 font-medium">Held</th>
                                            <th className="text-center p-3 font-medium">Transactions</th>
                                            <th className="text-right p-3 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((account) => {
                                            const heldAmount = account.balance - account.availableBalance;
                                            return (
                                                <tr key={account.id} className="border-b hover:bg-muted/50">
                                                    <td className="p-3 font-medium">
                                                        {account.vendor?.name || 'Unknown'}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {account.vendor?.user?.email || '-'}
                                                    </td>
                                                    <td className="p-3 text-right font-medium">
                                                        {formatCurrency(account.balance)}
                                                    </td>
                                                    <td className="p-3 text-right text-green-600">
                                                        {formatCurrency(account.availableBalance)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {heldAmount > 0 ? (
                                                            <Badge variant="outline" className="text-yellow-600">
                                                                {formatCurrency(heldAmount)}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Badge variant="secondary">
                                                            {account._count?.transactions || 0}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <Link href={`/admin/escrow/${account.vendorId}`}>
                                                            <Button size="sm" variant="outline">
                                                                <ArrowUpDown className="h-4 w-4 mr-1" />
                                                                Manage
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminEscrowPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Escrow Management</h2>
                    <p className="text-muted-foreground">
                        View and manage vendor escrow accounts and transactions
                    </p>
                </div>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
                <EscrowContent />
            </Suspense>
        </div>
    );
}
