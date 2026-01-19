import { Suspense } from 'react';
import { getEscrowAccountDetails, getEscrowTransactions } from '@/actions/escrow';
import { getCurrentSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';
import { AdjustBalanceDialog } from '../adjust-balance-dialog';

interface EscrowDetailPageProps {
    params: Promise<{ vendorId: string }>;
}

async function EscrowDetailContent({ vendorId }: { vendorId: string }) {
    const session = await getCurrentSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/unauthorized');
    }

    const [account, { data: transactions }] = await Promise.all([
        getEscrowAccountDetails(vendorId),
        getEscrowTransactions(vendorId, 1, 50)
    ]);

    if (!account) {
        notFound();
    }

    const heldAmount = account.balance - account.availableBalance;

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return <ArrowDownRight className="h-4 w-4 text-green-600" />;
            case 'RELEASE':
                return <ArrowUpRight className="h-4 w-4 text-red-600" />;
            case 'HOLD':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'UNHOLD':
                return <RefreshCw className="h-4 w-4 text-blue-600" />;
            default:
                return <Wallet className="h-4 w-4" />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return 'text-green-600';
            case 'RELEASE':
                return 'text-red-600';
            case 'HOLD':
                return 'text-yellow-600';
            case 'UNHOLD':
                return 'text-blue-600';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/escrow">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold">{account.vendor?.name}</h2>
                        <p className="text-muted-foreground">{account.vendor?.user?.email}</p>
                    </div>
                </div>
                <AdjustBalanceDialog
                    vendorId={vendorId}
                    vendorName={account.vendor?.name || 'Vendor'}
                    currentBalance={account.balance}
                />
            </div>

            {/* Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(account.balance)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {formatCurrency(account.availableBalance)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">On Hold</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">
                            {formatCurrency(heldAmount)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All escrow transactions for this vendor</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No transactions found
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx: any) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {getTransactionIcon(tx.type)}
                                        <div>
                                            <p className="font-medium">{tx.type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {tx.description || '-'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(tx.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                                            {tx.type === 'DEPOSIT' ? '+' : tx.type === 'RELEASE' ? '-' : ''}
                                            {formatCurrency(tx.amount)}
                                        </p>
                                        <Badge variant={tx.status === 'COMPLETED' ? 'secondary' : 'outline'}>
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="h-10 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardContent className="pt-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted animate-pulse rounded mb-3" />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default async function EscrowDetailPage({ params }: EscrowDetailPageProps) {
    const { vendorId } = await params;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<LoadingSkeleton />}>
                <EscrowDetailContent vendorId={vendorId} />
            </Suspense>
        </div>
    );
}
