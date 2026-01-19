import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon } from "lucide-react"

const mockPromotions = [
    { id: "1", name: "Buy 2 Get 1 Free", type: "BUY_X_GET_Y", startDate: "2024-01-01", endDate: "2024-03-31", isActive: true, conversions: 234 },
    { id: "2", name: "Bundle Deal", type: "BUNDLE", startDate: "2024-02-01", endDate: "2024-02-29", isActive: true, conversions: 89 },
]

export default function PromotionsPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Promotions</h3>
                                <p className="dashboard-card-description">Create special promotional campaigns</p>
                            </div>
                            <Button className="btn-primary"><PlusIcon className="mr-2 h-4 w-4" />Create Promotion</Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Conversions</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockPromotions.map((promo) => (
                                        <TableRow key={promo.id}>
                                            <TableCell className="font-medium">{promo.name}</TableCell>
                                            <TableCell><Badge variant="outline">{promo.type}</Badge></TableCell>
                                            <TableCell className="text-sm">{promo.startDate} - {promo.endDate}</TableCell>
                                            <TableCell>{promo.conversions}</TableCell>
                                            <TableCell><Badge variant={promo.isActive ? "default" : "secondary"}>{promo.isActive ? "Active" : "Inactive"}</Badge></TableCell>
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
