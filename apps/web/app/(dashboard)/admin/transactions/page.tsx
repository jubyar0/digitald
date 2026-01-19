import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getTransactions } from '@/actions/admin'

interface PageProps {
    searchParams: {
        page?: string
    }
}

// ✅ Server Component for instant LCP
export default async function TransactionsPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const pageSize = 10

    const result = await getTransactions(page, pageSize)
    const transactions = result.data

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Transaction Logs</h3>
                            <p className="dashboard-card-description">
                                View all platform transactions
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">No transactions found</TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((tx: any) => (
                                            <TableRow key={tx.id}>
                                                <TableCell className="font-medium">{tx.id.slice(0, 8)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{tx.transactionType}</Badge>
                                                </TableCell>
                                                <TableCell>${tx.amount}</TableCell>
                                                <TableCell>
                                                    <Badge variant={tx.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                        {tx.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {transactions.length} of {result.total} transactions
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page === 1} asChild>
                                <a href={`?page=${page - 1}`}>Previous</a>
                            </Button>
                            <Button variant="outline" size="sm" disabled={page * pageSize >= result.total} asChild>
                                <a href={`?page=${page + 1}`}>Next</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
