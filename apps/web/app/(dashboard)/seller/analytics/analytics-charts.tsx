'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load recharts components - they are heavy (~250KB)
const LazyLineChart = dynamic(
    () => import('recharts').then(mod => ({ default: mod.LineChart })),
    { ssr: false, loading: () => <ChartSkeleton /> }
)
const LazyAreaChart = dynamic(
    () => import('recharts').then(mod => ({ default: mod.AreaChart })),
    { ssr: false, loading: () => <ChartSkeleton /> }
)
const LazyPieChart = dynamic(
    () => import('recharts').then(mod => ({ default: mod.PieChart })),
    { ssr: false, loading: () => <ChartSkeleton /> }
)
const LazyResponsiveContainer = dynamic(
    () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })),
    { ssr: false }
)

// Re-export other components that are needed
import { Line, XAxis, YAxis, Tooltip, Area, Pie, Cell } from 'recharts'

function ChartSkeleton() {
    return <Skeleton className="w-full h-[200px] rounded" />
}

export function SalesOverTimeChart() {
    const data = [
        { time: "12 AM", value: 0 }, { time: "4 AM", value: 0 }, { time: "8 AM", value: 0 },
        { time: "12 PM", value: 0 }, { time: "4 PM", value: 0 }, { time: "8 PM", value: 0 },
        { time: "11 PM", value: 0 },
    ]
    return (
        <LazyResponsiveContainer width="100%" height={300}>
            <LazyLineChart data={data}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LazyLineChart>
        </LazyResponsiveContainer>
    )
}

export function SessionsOverTimeChart() {
    const data = [
        { time: "12 AM", value: 0 }, { time: "2 AM", value: 0 }, { time: "4 AM", value: 3 },
        { time: "6 AM", value: 0 }, { time: "8 AM", value: 0 }, { time: "10 AM", value: 0 },
        { time: "12 PM", value: 0 }, { time: "2 PM", value: 0 }, { time: "4 PM", value: 0 },
        { time: "6 PM", value: 0 }, { time: "8 PM", value: 0 }, { time: "10 PM", value: 0 },
    ]
    return (
        <LazyResponsiveContainer width="100%" height={200}>
            <LazyAreaChart data={data}>
                <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            </LazyAreaChart>
        </LazyResponsiveContainer>
    )
}

export function DeviceSessionsChart() {
    const data = [
        { name: 'Desktop', value: 3 },
    ]
    const COLORS = ['#0ea5e9'];

    return (
        <LazyResponsiveContainer width="100%" height={200}>
            <LazyPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-0.5em" fontSize="24" fontWeight="bold">3</tspan>
                    <tspan x="50%" dy="1.5em" fontSize="12" fill="#888">Sessions</tspan>
                </text>
            </LazyPieChart>
        </LazyResponsiveContainer>
    )
}

export function ConversionRateChart() {
    const data = [
        { time: "12 AM", value: 0 }, { time: "4 AM", value: 0 }, { time: "8 AM", value: 0 },
        { time: "12 PM", value: 0 }, { time: "4 PM", value: 0 }, { time: "8 PM", value: 0 },
    ]
    return (
        <LazyResponsiveContainer width="100%" height={200}>
            <LazyLineChart data={data}>
                <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LazyLineChart>
        </LazyResponsiveContainer>
    )
}

export function ConversionFunnelChart() {
    const data = [
        { name: 'Sessions', value: 3, percentage: '100%' },
        { name: 'Added to cart', value: 0, percentage: '0%' },
        { name: 'Reached checkout', value: 0, percentage: '0%' },
        { name: 'Converted', value: 0, percentage: '0%' },
    ]

    return (
        <div className="flex items-end justify-between h-[200px] pt-8">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="text-xs text-muted-foreground text-center h-8">{item.name}</div>
                    <div className="text-sm font-bold">{item.percentage}</div>
                    <div className="text-xs text-muted-foreground">{item.value}</div>
                    <div
                        className="w-full bg-blue-500/20 rounded-t-sm"
                        style={{ height: item.value === 0 ? '4px' : `${(item.value / 3) * 100}px`, minHeight: '4px' }}
                    >
                        {item.value > 0 && <div className="w-full h-full bg-blue-500 opacity-80" />}
                    </div>
                </div>
            ))}
        </div>
    )
}

export function LocationMapChart() {
    return (
        <div className="w-full h-[200px] bg-blue-500 rounded-md flex items-center justify-center text-white">
            Map Visualization Placeholder
        </div>
    )
}
