'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard/ui/card';
import { Package, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/ui/tabs';
import { ProductsTable } from './products-table';
import { getInventoryStats } from '@/actions/vendor-products';

interface InventoryStats {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    pendingProducts: number;
    totalValue: number;
    lowStock: number;
}

interface InventoryClientProps {
    initialStats: InventoryStats;
}

export function InventoryClient({ initialStats }: InventoryClientProps) {
    const [stats, setStats] = useState<InventoryStats>(initialStats);

    const fetchInventoryStats = async () => {
        try {
            const newStats = await getInventoryStats();
            setStats(newStats);
        } catch (error) {
            console.error('Failed to fetch inventory stats:', error);
        }
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            description: 'All products in inventory',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Active Products',
            value: stats.activeProducts,
            icon: TrendingUp,
            description: 'Published and visible',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Value',
            value: `$${stats.totalValue.toFixed(2)}`,
            icon: DollarSign,
            description: 'Combined product value',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Pending Review',
            value: stats.pendingProducts,
            icon: AlertCircle,
            description: 'Awaiting approval',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Products Table with Tabs */}
            <div className="dashboard-card p-6">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">
                            All ({stats.totalProducts})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Active ({stats.activeProducts})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending ({stats.pendingProducts})
                        </TabsTrigger>
                        <TabsTrigger value="draft">
                            Drafts ({stats.draftProducts})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-6">
                        <ProductsTable statusFilter="all" onUpdate={fetchInventoryStats} />
                    </TabsContent>
                    <TabsContent value="active" className="mt-6">
                        <ProductsTable statusFilter="active" onUpdate={fetchInventoryStats} />
                    </TabsContent>
                    <TabsContent value="pending" className="mt-6">
                        <ProductsTable statusFilter="pending" onUpdate={fetchInventoryStats} />
                    </TabsContent>
                    <TabsContent value="draft" className="mt-6">
                        <ProductsTable statusFilter="draft" onUpdate={fetchInventoryStats} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
