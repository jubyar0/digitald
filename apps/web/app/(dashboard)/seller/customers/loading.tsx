import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function CustomersLoading() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>

                        <div className="mt-6">
                            <Skeleton className="h-10 w-full max-w-md" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-8 w-16" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Total Spent</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
