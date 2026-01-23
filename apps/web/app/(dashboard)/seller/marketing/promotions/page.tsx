import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, Megaphone } from "lucide-react"
import { getSellerPromotions } from "@/actions/seller"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function PromotionsPage() {
    const { promotions, total } = await getSellerPromotions()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Promotions</h3>
                                <p className="dashboard-card-description">Create special promotional campaigns ({total} total)</p>
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
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {promotions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-4">
                                                    <img
                                                        src="/media/illustrations/26.svg"
                                                        alt="No promotions"
                                                        className="h-32 w-32 object-contain dark:opacity-80"
                                                    />
                                                    <div>
                                                        <p className="text-lg font-medium">No promotions yet</p>
                                                        <p className="text-sm text-muted-foreground">Create your first promotion to boost sales</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        promotions.map((promo) => (
                                            <TableRow key={promo.id}>
                                                <TableCell className="font-medium">{promo.name}</TableCell>
                                                <TableCell><Badge variant="outline">{promo.type}</Badge></TableCell>
                                                <TableCell className="text-sm">
                                                    {format(new Date(promo.startDate), "MMM d, yyyy")} - {format(new Date(promo.endDate), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell>{promo.priority}</TableCell>
                                                <TableCell>
                                                    <Badge variant={promo.isActive ? "default" : "secondary"}>
                                                        {promo.isActive ? "Active" : "Inactive"}
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
