import { notFound } from "next/navigation"
import { getSellerOrderById, updateOrderStatus } from "@/actions/seller"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Calendar, Mail, MapPin, Package, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { OrderStatusSelector } from "./order-status-selector"

interface PageProps {
    params: {
        id: string
    }
}

export default async function OrderDetailPage({ params }: PageProps) {
    const order = await getSellerOrderById(params.id)

    if (!order) {
        notFound()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'DELIVERED':
                return 'default'
            case 'PENDING':
                return 'secondary'
            case 'CANCELLED':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/seller/orders">
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(-6)}</h2>
                                <p className="text-muted-foreground">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Content - Order Items */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-start gap-4">
                                                <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                                                    {item.product.thumbnail ? (
                                                        <Image
                                                            src={item.product.thumbnail}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Package className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 flex-col gap-1">
                                                    <h4 className="font-medium leading-none">{item.product.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Unit Price: {formatCurrency(item.price)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="font-medium">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                        <Separator />
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>{formatCurrency(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Customer & Details */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            {order.customer.avatar ? (
                                                <Image
                                                    src={order.customer.avatar}
                                                    alt={order.customer.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{order.customer.name}</p>
                                            <p className="text-xs text-muted-foreground">Customer ID: {order.customer.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${order.customer.email}`} className="hover:underline">
                                            {order.customer.email}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Current Status</span>
                                            <Badge variant={getStatusColor(order.status) as any}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Last Updated</span>
                                            <span className="text-sm">
                                                {new Date(order.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
