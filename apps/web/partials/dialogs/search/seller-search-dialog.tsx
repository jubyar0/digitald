'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dashboard/ui/dialog';
import { Input } from '@/components/dashboard/ui/input';
import { ScrollArea } from '@/components/dashboard/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/ui/tabs';
import { Badge } from '@/components/dashboard/ui/badge';
import { toAbsoluteUrl } from '@/lib/helpers';

// Product search result
interface ProductResultProps {
    id: string;
    name: string;
    sku: string;
    image: string;
    price: number;
    stock: number;
    status: 'published' | 'draft';
}

function ProductResult({ id, name, sku, image, price, stock, status }: ProductResultProps) {
    return (
        <Link href={`/seller/products/${id}`}>
            <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <img
                    src={toAbsoluteUrl(image)}
                    alt={name}
                    className="size-12 rounded-lg object-cover border border-border"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{name}</p>
                            <p className="text-xs text-muted-foreground">SKU: {sku}</p>
                        </div>
                        <Badge variant={status === 'published' ? 'secondary' : 'outline'} className="shrink-0">
                            {status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-primary">${price}</span>
                        <span className="text-xs text-muted-foreground">
                            Stock: {stock > 0 ? stock : <span className="text-destructive">Out of stock</span>}
                        </span>
                    </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
            </div>
        </Link>
    );
}

// Order search result
interface OrderResultProps {
    id: string;
    orderNumber: string;
    customerName: string;
    status: string;
    total: number;
    date: string;
}

function OrderResult({ id, orderNumber, customerName, status, total, date }: OrderResultProps) {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
        processing: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
        completed: 'bg-green-500/10 text-green-700 dark:text-green-400',
        cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400',
    };

    return (
        <Link href={`/seller/orders/${id}`}>
            <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <ShoppingCart className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">Order {orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{customerName}</p>
                        </div>
                        <Badge className={statusColors[status.toLowerCase()] || ''}>
                            {status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-primary">${total}</span>
                        <span className="text-xs text-muted-foreground">{date}</span>
                    </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
            </div>
        </Link>
    );
}

// Customer search result
interface CustomerResultProps {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    ordersCount: number;
    totalSpent: number;
}

function CustomerResult({ id, name, email, avatar, ordersCount, totalSpent }: CustomerResultProps) {
    return (
        <Link href={`/seller/customers/${id}`}>
            <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                {avatar ? (
                    <img
                        src={toAbsoluteUrl(avatar)}
                        alt={name}
                        className="size-10 rounded-full object-cover border border-border"
                    />
                ) : (
                    <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                        <Users className="size-5 text-muted-foreground" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{email}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{ordersCount} orders</span>
                        <span className="text-xs font-medium text-primary">${totalSpent} spent</span>
                    </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
            </div>
        </Link>
    );
}

export function SellerSearchDialog({ trigger }: { trigger: ReactNode }) {
    const [searchInput, setSearchInput] = useState('');

    // Sample data - in production, this would come from API
    const products: ProductResultProps[] = [
        {
            id: '1',
            name: 'Premium Wireless Headphones',
            sku: 'WH-001',
            image: '/media/product-demos/1.png',
            price: 299.99,
            stock: 45,
            status: 'published',
        },
        {
            id: '2',
            name: 'Gaming Mechanical Keyboard',
            sku: 'KB-002',
            image: '/media/product-demos/2.png',
            price: 149.99,
            stock: 12,
            status: 'published',
        },
        {
            id: '3',
            name: 'USB-C Hub Adapter',
            sku: 'HUB-003',
            image: '/media/product-demos/3.png',
            price: 49.99,
            stock: 0,
            status: 'draft',
        },
    ];

    const orders: OrderResultProps[] = [
        {
            id: '1',
            orderNumber: '#12345',
            customerName: 'John Doe',
            status: 'Processing',
            total: 299.99,
            date: '2 hours ago',
        },
        {
            id: '2',
            orderNumber: '#12344',
            customerName: 'Sarah Smith',
            status: 'Completed',
            total: 149.99,
            date: '1 day ago',
        },
        {
            id: '3',
            orderNumber: '#12343',
            customerName: 'Mike Johnson',
            status: 'Pending',
            total: 499.99,
            date: '2 days ago',
        },
    ];

    const customers: CustomerResultProps[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: '/media/avatars/300-1.png',
            ordersCount: 5,
            totalSpent: 1249.95,
        },
        {
            id: '2',
            name: 'Sarah Smith',
            email: 'sarah.smith@example.com',
            avatar: '/media/avatars/300-2.png',
            ordersCount: 3,
            totalSpent: 749.97,
        },
        {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            ordersCount: 8,
            totalSpent: 2199.92,
        },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="lg:max-w-[700px] lg:top-[15%] lg:translate-y-0 p-0 [&_[data-slot=dialog-close]]:top-5.5 [&_[data-slot=dialog-close]]:end-5.5">
                <DialogHeader className="px-4 py-1 mb-1">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="relative">
                        <Search className="absolute top-1/2 -translate-y-1/2 start-0 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            name="query"
                            value={searchInput}
                            className="ps-6 outline-none! ring-0! shadow-none! border-0"
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search products, orders, customers..."
                        />
                    </div>
                </DialogHeader>
                <div className="p-0 pb-5">
                    <Tabs defaultValue="all">
                        <TabsList className="justify-start px-5 mb-2.5">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="customers">Customers</TabsTrigger>
                        </TabsList>
                        <ScrollArea className="h-[480px]">
                            {/* All Tab - Mixed Results */}
                            <TabsContent value="all" className="mt-0">
                                <div className="flex flex-col">
                                    <div className="px-5 py-2">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                                            Products
                                        </h3>
                                    </div>
                                    {products.slice(0, 2).map((product) => (
                                        <ProductResult key={product.id} {...product} />
                                    ))}

                                    <div className="border-t border-border my-2" />

                                    <div className="px-5 py-2">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                                            Recent Orders
                                        </h3>
                                    </div>
                                    {orders.slice(0, 2).map((order) => (
                                        <OrderResult key={order.id} {...order} />
                                    ))}

                                    <div className="border-t border-border my-2" />

                                    <div className="px-5 py-2">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                                            Customers
                                        </h3>
                                    </div>
                                    {customers.slice(0, 2).map((customer) => (
                                        <CustomerResult key={customer.id} {...customer} />
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Products Tab */}
                            <TabsContent value="products" className="mt-0">
                                <div className="flex flex-col">
                                    {products.map((product) => (
                                        <ProductResult key={product.id} {...product} />
                                    ))}
                                    {products.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 px-5">
                                            <Package className="size-12 text-muted-foreground/50 mb-3" />
                                            <p className="text-sm text-muted-foreground">No products found</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Orders Tab */}
                            <TabsContent value="orders" className="mt-0">
                                <div className="flex flex-col">
                                    {orders.map((order) => (
                                        <OrderResult key={order.id} {...order} />
                                    ))}
                                    {orders.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 px-5">
                                            <ShoppingCart className="size-12 text-muted-foreground/50 mb-3" />
                                            <p className="text-sm text-muted-foreground">No orders found</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Customers Tab */}
                            <TabsContent value="customers" className="mt-0">
                                <div className="flex flex-col">
                                    {customers.map((customer) => (
                                        <CustomerResult key={customer.id} {...customer} />
                                    ))}
                                    {customers.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 px-5">
                                            <Users className="size-12 text-muted-foreground/50 mb-3" />
                                            <p className="text-sm text-muted-foreground">No customers found</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
