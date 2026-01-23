import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, CopyIcon, TicketIcon } from "lucide-react"
import { getSellerCoupons } from "@/actions/seller"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function CouponsPage() {
    const { coupons, total } = await getSellerCoupons()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Coupon Codes</h3>
                                <p className="dashboard-card-description">Manage promotional coupon codes ({total} total)</p>
                            </div>
                            <Button className="btn-primary"><PlusIcon className="mr-2 h-4 w-4" />Create Coupon</Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Used / Limit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coupons.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <TicketIcon className="h-12 w-12" />
                                                    <p className="text-lg font-medium">No coupons yet</p>
                                                    <p className="text-sm">Create your first coupon to offer discounts to customers</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        coupons.map((coupon) => (
                                            <TableRow key={coupon.id}>
                                                <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                                <TableCell><Badge variant="outline">{coupon.type}</Badge></TableCell>
                                                <TableCell>
                                                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` :
                                                        coupon.type === "FREE_SHIPPING" ? "Free" : `$${coupon.value}`}
                                                </TableCell>
                                                <TableCell>{coupon.usageCount} / {coupon.usageLimit || "∞"}</TableCell>
                                                <TableCell>
                                                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                                                        {coupon.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm">
                                                        <CopyIcon className="mr-2 h-4 w-4" />Copy Code
                                                    </Button>
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
