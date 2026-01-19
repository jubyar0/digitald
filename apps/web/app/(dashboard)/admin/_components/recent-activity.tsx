import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
    recentOrders: any[]
    newUsers: any[]
}

export function RecentActivity({ recentOrders, newUsers }: RecentActivityProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                        Latest transactions across the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{order.user.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{order.user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.user.email}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    +{formatCurrency(order.totalAmount)}
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <p className="text-sm text-muted-foreground">No recent orders found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>
                        Latest user registrations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {newUsers.map((user) => (
                            <div key={user.email} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {newUsers.length === 0 && (
                            <p className="text-sm text-muted-foreground">No new users found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
