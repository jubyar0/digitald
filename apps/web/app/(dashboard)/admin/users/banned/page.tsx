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
import { getBannedUsers } from '@/actions/admin'
import { UnbanButton } from './unban-button'

interface PageProps {
    searchParams: {
        page?: string
    }
}

// ✅ Server Component
export default async function BannedUsersPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const pageSize = 10

    const result = await getBannedUsers(page, pageSize)
    const bannedUsers = result.data

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Banned Users</h3>
                            <p className="dashboard-card-description">
                                View and manage banned user accounts
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Banned By</TableHead>
                                        <TableHead>Ban Date</TableHead>
                                        <TableHead>Ban End</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bannedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No banned users found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bannedUsers.map((ban: any) => (
                                            <TableRow key={ban.id}>
                                                <TableCell className="font-medium">
                                                    {ban.user.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>{ban.user.email}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {ban.reason}
                                                </TableCell>
                                                <TableCell>
                                                    {ban.bannedByUser.name || 'System'}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(ban.banStart).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {ban.banEnd ? (
                                                        new Date(ban.banEnd).toLocaleDateString()
                                                    ) : (
                                                        <Badge variant="destructive">Permanent</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <UnbanButton bannedUserId={ban.id} />
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
                            Showing {bannedUsers.length} of {result.total} banned users
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
