import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, CopyIcon } from "lucide-react"

const mockCoupons = [
    { id: "1", code: "SAVE20", type: "PERCENTAGE", value: 20, used: 89, limit: 100, isActive: true },
    { id: "2", code: "FREESHIP", type: "FREE_SHIPPING", value: 0, used: 156, limit: null, isActive: true },
]

export default function CouponsPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Coupon Codes</h3>
                                <p className="dashboard-card-description">Manage promotional coupon codes</p>
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
                                    {mockCoupons.map((coupon) => (
                                        <TableRow key={coupon.id}>
                                            <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                                            <TableCell><Badge variant="outline">{coupon.type}</Badge></TableCell>
                                            <TableCell>{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : coupon.type === "FREE_SHIPPING" ? "Free" : `$${coupon.value}`}</TableCell>
                                            <TableCell>{coupon.used} / {coupon.limit || "∞"}</TableCell>
                                            <TableCell><Badge variant={coupon.isActive ? "default" : "secondary"}>{coupon.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm"><CopyIcon className="mr-2 h-4 w-4" />Copy Code</Button>
                                            </TableCell>
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
