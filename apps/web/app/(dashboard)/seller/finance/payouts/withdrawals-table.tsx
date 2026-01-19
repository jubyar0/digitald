'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Withdrawal {
    id: string
    amount: number
    method: string
    status: string
    details: string
    createdAt: Date
    processedAt: Date | null
}

interface WithdrawalsTableProps {
    withdrawals: Withdrawal[]
}

export function WithdrawalsTable({ withdrawals }: WithdrawalsTableProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'default'
            case 'PROCESSING':
                return 'secondary'
            case 'PENDING':
                return 'outline'
            case 'FAILED':
            case 'REJECTED':
            case 'CANCELLED':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-600 dark:text-green-400'
            case 'PROCESSING':
                return 'text-blue-600 dark:text-blue-400'
            case 'PENDING':
                return 'text-yellow-600 dark:text-yellow-400'
            case 'FAILED':
            case 'REJECTED':
            case 'CANCELLED':
                return 'text-red-600 dark:text-red-400'
            default:
                return ''
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Processed</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {withdrawals.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No withdrawal requests yet.
                        </TableCell>
                    </TableRow>
                ) : (
                    withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                            <TableCell className="font-medium">
                                {withdrawal.id.slice(-8).toUpperCase()}
                            </TableCell>
                            <TableCell className="font-semibold">
                                ${withdrawal.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{withdrawal.method}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={getStatusVariant(withdrawal.status) as any}
                                    className={getStatusColor(withdrawal.status)}
                                >
                                    {withdrawal.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                                {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </TableCell>
                            <TableCell className="text-sm">
                                {withdrawal.processedAt
                                    ? new Date(withdrawal.processedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                    : '-'}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
