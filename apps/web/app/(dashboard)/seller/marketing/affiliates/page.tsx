import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, Users } from "lucide-react"
import { getSellerAffiliates } from "@/actions/seller"

export const dynamic = 'force-dynamic'

export default async function AffiliatesPage() {
    const { affiliates, total } = await getSellerAffiliates()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Affiliate Program</h3>
                                <p className="dashboard-card-description">Manage affiliate partners and commissions ({total} total)</p>
                            </div>
                            <Button className="btn-primary"><PlusIcon className="mr-2 h-4 w-4" />Add Affiliate</Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Affiliate</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Commission Rate</TableHead>
                                        <TableHead>Referrals</TableHead>
                                        <TableHead>Total Earnings</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {affiliates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Users className="h-12 w-12" />
                                                    <p className="text-lg font-medium">No affiliates yet</p>
                                                    <p className="text-sm">Start your affiliate program to grow your sales</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        affiliates.map((affiliate) => (
                                            <TableRow key={affiliate.id}>
                                                <TableCell className="font-medium">{affiliate.name}</TableCell>
                                                <TableCell className="font-mono">{affiliate.code}</TableCell>
                                                <TableCell>{affiliate.commissionRate}%</TableCell>
                                                <TableCell>{affiliate.referrals}</TableCell>
                                                <TableCell>${affiliate.totalEarnings.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={affiliate.status === "ACTIVE" ? "default" : "secondary"}>
                                                        {affiliate.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
