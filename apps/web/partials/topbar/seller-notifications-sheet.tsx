'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import {
    Package,
    ShoppingCart,
    MessageSquare,
    CreditCard,
    Eye,
    CheckCheck,
    Archive
} from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import { ScrollArea } from '@/components/dashboard/ui/scroll-area';
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/dashboard/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/ui/tabs';
import { Badge } from '@/components/dashboard/ui/badge';
import { toAbsoluteUrl } from '@/lib/helpers';

// Notification item component
interface NotificationItemProps {
    icon: ReactNode;
    title: string;
    description: string;
    time: string;
    isRead?: boolean;
    actionLink?: string;
    actionLabel?: string;
}

function NotificationItem({
    icon,
    title,
    description,
    time,
    isRead = false,
    actionLink,
    actionLabel,
}: NotificationItemProps) {
    return (
        <div className={`px-5 py-3.5 ${!isRead ? 'bg-muted/30' : ''}`}>
            <div className="flex gap-3.5">
                <div className="flex items-start">
                    <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary">
                        {icon}
                    </div>
                </div>
                <div className="flex flex-col gap-1 grow">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-foreground">
                                {title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {description}
                            </span>
                        </div>
                        {!isRead && (
                            <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{time}</span>
                        {actionLink && actionLabel && (
                            <Link href={actionLink}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    {actionLabel}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SellerNotificationsSheet({ trigger }: { trigger: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
                <SheetHeader className="mb-0">
                    <SheetTitle className="p-3">
                        Notifications
                    </SheetTitle>
                </SheetHeader>
                <SheetBody className="p-0">
                    <ScrollArea className="h-[calc(100vh-10.5rem)]">
                        <Tabs defaultValue="all" className="w-full relative">
                            <TabsList className="w-full px-5 mb-5">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="orders" className="relative">
                                    Orders
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1 -end-1" />
                                </TabsTrigger>
                                <TabsTrigger value="products">Products</TabsTrigger>
                                <TabsTrigger value="customers">Customers</TabsTrigger>
                                <TabsTrigger value="payments">Payments</TabsTrigger>
                            </TabsList>

                            {/* All Tab */}
                            <TabsContent value="all" className="mt-0">
                                <div className="flex flex-col">
                                    <NotificationItem
                                        icon={<ShoppingCart className="size-4" />}
                                        title="New Order #12345"
                                        description="Customer John Doe placed a new order"
                                        time="2 minutes ago"
                                        isRead={false}
                                        actionLink="/seller/orders/12345"
                                        actionLabel="View Order"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<Package className="size-4" />}
                                        title="Low Stock Alert"
                                        description="Product 'Premium Headphones' has only 3 items left"
                                        time="1 hour ago"
                                        isRead={false}
                                        actionLink="/seller/products"
                                        actionLabel="Update Stock"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<MessageSquare className="size-4" />}
                                        title="New Review"
                                        description="Customer Sarah left a 5-star review on 'Wireless Mouse'"
                                        time="3 hours ago"
                                        isRead={true}
                                        actionLink="/seller/reviews"
                                        actionLabel="View Review"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<CreditCard className="size-4" />}
                                        title="Payment Received"
                                        description="Payment of $234.50 has been processed"
                                        time="5 hours ago"
                                        isRead={true}
                                        actionLink="/seller/finance/payments"
                                        actionLabel="View Details"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<ShoppingCart className="size-4" />}
                                        title="Order Shipped"
                                        description="Order #12340 has been marked as shipped"
                                        time="1 day ago"
                                        isRead={true}
                                        actionLink="/seller/orders/12340"
                                        actionLabel="Track Order"
                                    />
                                </div>
                            </TabsContent>

                            {/* Orders Tab */}
                            <TabsContent value="orders" className="mt-0">
                                <div className="flex flex-col">
                                    <NotificationItem
                                        icon={<ShoppingCart className="size-4" />}
                                        title="New Order #12345"
                                        description="Customer John Doe placed a new order"
                                        time="2 minutes ago"
                                        isRead={false}
                                        actionLink="/seller/orders/12345"
                                        actionLabel="View Order"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<ShoppingCart className="size-4" />}
                                        title="Order Cancelled"
                                        description="Order #12342 was cancelled by customer"
                                        time="4 hours ago"
                                        isRead={false}
                                        actionLink="/seller/orders/12342"
                                        actionLabel="View Details"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<ShoppingCart className="size-4" />}
                                        title="Order Completed"
                                        description="Order #12338 has been delivered successfully"
                                        time="2 days ago"
                                        isRead={true}
                                        actionLink="/seller/orders/12338"
                                        actionLabel="View Order"
                                    />
                                </div>
                            </TabsContent>

                            {/* Products Tab */}
                            <TabsContent value="products" className="mt-0">
                                <div className="flex flex-col">
                                    <NotificationItem
                                        icon={<Package className="size-4" />}
                                        title="Low Stock Alert"
                                        description="Product 'Premium Headphones' has only 3 items left"
                                        time="1 hour ago"
                                        isRead={false}
                                        actionLink="/seller/products"
                                        actionLabel="Update Stock"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<Package className="size-4" />}
                                        title="Product Approved"
                                        description="Your product 'Gaming Keyboard' has been approved"
                                        time="1 day ago"
                                        isRead={true}
                                        actionLink="/seller/products"
                                        actionLabel="View Product"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<Package className="size-4" />}
                                        title="Out of Stock"
                                        description="Product 'USB Cable' is now out of stock"
                                        time="2 days ago"
                                        isRead={true}
                                        actionLink="/seller/inventory"
                                        actionLabel="Restock"
                                    />
                                </div>
                            </TabsContent>

                            {/* Customers Tab */}
                            <TabsContent value="customers" className="mt-0">
                                <div className="flex flex-col">
                                    <NotificationItem
                                        icon={<MessageSquare className="size-4" />}
                                        title="New Review"
                                        description="Customer Sarah left a 5-star review on 'Wireless Mouse'"
                                        time="3 hours ago"
                                        isRead={true}
                                        actionLink="/seller/reviews"
                                        actionLabel="View Review"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<MessageSquare className="size-4" />}
                                        title="Customer Question"
                                        description="Mike asked about shipping time for 'Laptop Stand'"
                                        time="6 hours ago"
                                        isRead={false}
                                        actionLink="/seller/customers"
                                        actionLabel="Reply"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<MessageSquare className="size-4" />}
                                        title="New Message"
                                        description="Customer Emma sent you a message"
                                        time="1 day ago"
                                        isRead={true}
                                        actionLink="/seller/customers"
                                        actionLabel="View Message"
                                    />
                                </div>
                            </TabsContent>

                            {/* Payments Tab */}
                            <TabsContent value="payments" className="mt-0">
                                <div className="flex flex-col">
                                    <NotificationItem
                                        icon={<CreditCard className="size-4" />}
                                        title="Payment Received"
                                        description="Payment of $234.50 has been processed"
                                        time="5 hours ago"
                                        isRead={true}
                                        actionLink="/seller/finance/payments"
                                        actionLabel="View Details"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<CreditCard className="size-4" />}
                                        title="Payout Processed"
                                        description="Your payout of $1,250.00 has been sent"
                                        time="2 days ago"
                                        isRead={true}
                                        actionLink="/seller/finance/payouts"
                                        actionLabel="View Payout"
                                    />
                                    <div className="border-b border-border" />

                                    <NotificationItem
                                        icon={<CreditCard className="size-4" />}
                                        title="Invoice Generated"
                                        description="Invoice #INV-2024-001 is ready"
                                        time="3 days ago"
                                        isRead={true}
                                        actionLink="/seller/finance/invoices"
                                        actionLabel="Download"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </SheetBody>
                <SheetFooter className="border-t border-border p-5 grid grid-cols-2 gap-2.5">
                    <Button variant="outline" className="gap-2">
                        <Archive className="size-4" />
                        Archive All
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <CheckCheck className="size-4" />
                        Mark All Read
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
