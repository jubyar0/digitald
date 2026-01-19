import { Card, CardContent } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/dashboard/ui/table'
import { SearchIcon, EyeIcon } from 'lucide-react'
import { getVendors } from '@/actions/admin'

interface PageProps {
    searchParams: {
        page?: string
        search?: string
    }
}

// ✅ Server Component for instant LCP
export default async function AllVendorsPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const search = searchParams.search || ''
    const pageSize = 10

    const result = await getVendors(page, pageSize, search)
    const vendors = result.data

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">All Vendors</h3>
                            <p className="dashboard-card-description">
                                Manage vendor accounts and their stores
                            </p>
                        </div>

                        <form method="get" className="mt-6 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="search"
                                    placeholder="Search vendors..."
                                    className="pl-10"
                                    defaultValue={search}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor Name</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vendors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No vendors found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        vendors.map((vendor: any) => (
                                            <TableRow key={vendor.id}>
                                                <TableCell className="font-medium">{vendor.name}</TableCell>
                                                <TableCell>{vendor.user.name || 'N/A'}</TableCell>
                                                <TableCell>{vendor.user.email}</TableCell>
                                                <TableCell>{vendor._count.products}</TableCell>
                                                <TableCell>{vendor._count.orders}</TableCell>
                                                <TableCell>
                                                    {new Date(vendor.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {vendors.length} of {result.total} vendors
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page === 1} asChild>
                                <a href={`?page=${page - 1}&search=${search}`}>Previous</a>
                            </Button>
                            <Button variant="outline" size="sm" disabled={page * pageSize >= result.total} asChild>
                                <a href={`?page=${page + 1}&search=${search}`}>Next</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
