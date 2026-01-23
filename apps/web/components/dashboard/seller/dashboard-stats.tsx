import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { DollarSign, ShoppingBag, Package, TrendingUp, Users } from 'lucide-react'

interface DashboardStatsProps {
    stats: {
        sales: { total: number; growth: number }
        orders: { total: number; pending: number }
        products: { total: number; unpublished: number }
        customers: { total: number; new: number }
        revenue: { total: number; growth: number }
    }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return null
}
