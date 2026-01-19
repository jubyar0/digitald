'use client'

import React, { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, RefreshCw, Maximize2, Pencil, ArrowRightLeft, BarChart, GripVertical, X, Plus, Search, Check, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    SalesOverTimeChart,
    SessionsOverTimeChart,
    DeviceSessionsChart,
    ConversionRateChart,
    ConversionFunnelChart
} from "./analytics-charts"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

// --- Types ---
type WidgetId = string

interface DashboardItem {
    id: WidgetId
    colSpan: string
}

interface WidgetDefinition {
    id: WidgetId
    title: string
    category: string
    defaultColSpan: string
}

// --- Widget Definitions ---
const AVAILABLE_WIDGETS: WidgetDefinition[] = [
    { id: 'gross_sales', title: 'Gross sales', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'net_sales', title: 'Net sales', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'orders', title: 'Orders', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'avg_order_value', title: 'Average order value', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'returns', title: 'Returns', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'discounts', title: 'Discounts', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sales_over_time', title: 'Total sales over time', category: 'Sales', defaultColSpan: 'col-span-1 md:col-span-2' },
    { id: 'sales_breakdown', title: 'Total sales breakdown', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sales_by_channel', title: 'Sales by channel', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sales_by_product', title: 'Sales by product', category: 'Sales', defaultColSpan: 'col-span-1' },
    { id: 'sessions_over_time', title: 'Sessions over time', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'sessions_by_referrer', title: 'Sessions by referrer', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'sessions_by_location', title: 'Sessions by location', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'device_sessions', title: 'Sessions by device', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'social_sessions', title: 'Sessions by social', category: 'Acquisition', defaultColSpan: 'col-span-1' },
    { id: 'returning_rate', title: 'Returning customer rate', category: 'Customers', defaultColSpan: 'col-span-1' },
    { id: 'cohort_analysis', title: 'Cohort analysis', category: 'Customers', defaultColSpan: 'col-span-1 md:col-span-2' },
    { id: 'orders_fulfilled', title: 'Orders fulfilled', category: 'Customers', defaultColSpan: 'col-span-1' },
    { id: 'conversion_rate', title: 'Conversion rate', category: 'Behavior', defaultColSpan: 'col-span-1' },
    { id: 'conversion_breakdown', title: 'Conversion funnel', category: 'Behavior', defaultColSpan: 'col-span-1' },
    { id: 'landing_page', title: 'Sessions by landing page', category: 'Behavior', defaultColSpan: 'col-span-1' },
]

// --- Currency List ---
const CURRENCIES = [
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'DZD' },
    { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'AED' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'ALL' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ANG' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'AOA Kz' },
    { code: 'ARS', name: 'Argentine Peso', symbol: 'ARS $' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'AUD $' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
]

// --- Date Presets ---
const DATE_PRESETS = [
    'Today', 'Yesterday', 'Last 30 minutes', 'Last 12 hours',
    'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days',
    'Last 12 months', 'Last week', 'Last month'
]

const COMPARISON_PRESETS = [
    'No comparison', 'Yesterday', 'Previous week', 'Previous month',
    'Previous quarter', 'Previous year', 'Previous year (match day of week)',
    'Black Friday Cyber Monday'
]

// --- Sortable Item Component ---
interface SortableItemProps {
    id: string
    children: React.ReactNode
    className?: string
    isEditing: boolean
    onRemove?: (id: string) => void
}

function SortableItem({ id, children, className, isEditing, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className={cn("relative group h-full", className)}>
            {isEditing && (
                <>
                    <div
                        {...attributes}
                        {...listeners}
                        className="absolute top-0 left-0 right-0 h-8 z-20 cursor-move group-hover:bg-accent/10 rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => onRemove?.(id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                </>
            )}
            {children}
        </div>
    )
}

// --- Dashboard Component ---

export default function DraggableDashboard() {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [lastRefreshed, setLastRefreshed] = useState(new Date())
    const [autoRefresh, setAutoRefresh] = useState(false)

    // Filter States
    const [selectedPreset, setSelectedPreset] = useState('Today')
    const [selectedComparison, setSelectedComparison] = useState('No comparison')
    const [selectedCurrency, setSelectedCurrency] = useState('DZD')
    const [currencySearch, setCurrencySearch] = useState('')
    const [dateRangeTab, setDateRangeTab] = useState<'fixed' | 'rolling'>('fixed')

    // Date Range
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date()
    })

    // Popover states
    const [todayOpen, setTodayOpen] = useState(false)
    const [comparisonOpen, setComparisonOpen] = useState(false)
    const [currencyOpen, setCurrencyOpen] = useState(false)

    // Initial Items Config
    const initialItems: DashboardItem[] = [
        { id: 'gross_sales', colSpan: 'col-span-1' },
        { id: 'returning_rate', colSpan: 'col-span-1' },
        { id: 'orders_fulfilled', colSpan: 'col-span-1' },
        { id: 'orders', colSpan: 'col-span-1' },
        { id: 'sales_over_time', colSpan: 'col-span-1 md:col-span-2' },
        { id: 'sales_breakdown', colSpan: 'col-span-1' },
        { id: 'sales_by_channel', colSpan: 'col-span-1' },
        { id: 'avg_order_value', colSpan: 'col-span-1' },
        { id: 'sales_by_product', colSpan: 'col-span-1' },
        { id: 'sessions_over_time', colSpan: 'col-span-1' },
        { id: 'conversion_rate', colSpan: 'col-span-1' },
        { id: 'conversion_breakdown', colSpan: 'col-span-1' },
        { id: 'device_sessions', colSpan: 'col-span-1' },
        { id: 'sessions_by_location', colSpan: 'col-span-1' },
        { id: 'cohort_analysis', colSpan: 'col-span-1 md:col-span-2' },
        { id: 'landing_page', colSpan: 'col-span-1' },
    ]

    const [items, setItems] = useState<DashboardItem[]>(initialItems)
    const [searchQuery, setSearchQuery] = useState('')

    // Auto Refresh Logic
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (autoRefresh) {
            interval = setInterval(() => {
                handleRefresh()
            }, 60000)
        }
        return () => clearInterval(interval)
    }, [autoRefresh])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        if (active.id.toString().startsWith('sidebar-')) {
            const widgetId = active.id.toString().replace('sidebar-', '')
            const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId)
            if (widget && !items.find(i => i.id === widget.id)) {
                setItems(prev => [...prev, { id: widget.id, colSpan: widget.defaultColSpan }])
            }
            return
        }

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen?.()
            setIsFullscreen(false)
        }
    }

    const handleRefresh = () => {
        router.refresh()
        setLastRefreshed(new Date())
        if (!autoRefresh) setAutoRefresh(true)
    }

    const filteredWidgets = AVAILABLE_WIDGETS.filter(w =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !items.find(i => i.id === w.id)
    )

    const groupedWidgets = filteredWidgets.reduce((acc, widget) => {
        if (!acc[widget.category]) acc[widget.category] = []
        acc[widget.category].push(widget)
        return acc
    }, {} as Record<string, WidgetDefinition[]>)

    const filteredCurrencies = CURRENCIES.filter(c =>
        c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(currencySearch.toLowerCase())
    )

    const renderCardContent = (id: string) => {
        switch (id) {
            case 'gross_sales':
                return (
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gross sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">DZD 0 —</div>
                            <p className="text-xs text-muted-foreground">DZD 0</p>
                        </CardContent>
                    </Card>
                )
            case 'returning_rate':
                return (
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Returning customer rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0% —</div>
                            <p className="text-xs text-muted-foreground">—</p>
                        </CardContent>
                    </Card>
                )
            case 'orders_fulfilled':
                return (
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orders fulfilled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0 —</div>
                            <p className="text-xs text-muted-foreground">—</p>
                        </CardContent>
                    </Card>
                )
            case 'orders':
                return (
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0 —</div>
                            <p className="text-xs text-muted-foreground">—</p>
                        </CardContent>
                    </Card>
                )
            case 'sales_over_time':
                return (
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total sales over time</CardTitle>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">DZD 0 —</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <SalesOverTimeChart />
                        </CardContent>
                    </Card>
                )
            case 'sales_breakdown':
                return (
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total sales breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                {['Gross sales', 'Discounts', 'Returns', 'Net sales', 'Shipping charges', 'Return fees', 'Taxes', 'Total sales'].map((label, i) => (
                                    <div key={label} className={cn("flex justify-between items-center", i < 7 && "border-b pb-2")}>
                                        <span className="text-blue-600">{label}</span>
                                        <span>DZD 0.00 —</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            default:
                const widget = AVAILABLE_WIDGETS.find(w => w.id === id)
                return (
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">{widget?.title || id}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-[150px]">
                            <p className="text-sm text-muted-foreground">No data available</p>
                        </CardContent>
                    </Card>
                )
        }
    }

    return (
        <div className={cn("flex flex-col min-h-screen bg-muted/10", isEditing ? "fixed inset-0 z-50 bg-background" : "p-6")}>

            {/* Edit Mode Top Bar */}
            {isEditing && (
                <div className="h-14 bg-zinc-900 text-white flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <BarChart className="h-5 w-5" />
                        <span className="font-semibold">Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="text-white hover:bg-zinc-800" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-white text-black hover:bg-zinc-200" onClick={() => setIsEditing(false)}>
                            Save
                        </Button>
                    </div>
                </div>
            )}

            {/* Normal Header */}
            {!isEditing && (
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <BarChart className="h-5 w-5" />
                                Analytics
                            </h1>
                            <span className="text-xs text-muted-foreground">
                                Last refreshed: {format(lastRefreshed, 'h:mm a')}
                                {autoRefresh && <span className="text-green-600 ml-1">• Auto</span>}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-8 w-8", autoRefresh && "text-green-600")}
                                onClick={handleRefresh}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="h-8 bg-zinc-800 text-white hover:bg-zinc-700 ml-2 text-xs gap-1">
                                <Plus className="h-3 w-3" />
                                New exploration
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Today Popover */}
                        <Popover open={todayOpen} onOpenChange={setTodayOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal border-dashed px-3">
                                    <CalendarIcon className="h-4 w-4" />
                                    Today
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                                <div className="flex">
                                    {/* Left Sidebar: Tabs and Presets */}
                                    <div className="w-48 border-r flex flex-col">
                                        <div className="flex border-b">
                                            <button
                                                onClick={() => setDateRangeTab('fixed')}
                                                className={cn(
                                                    "flex-1 py-2 text-sm font-medium",
                                                    dateRangeTab === 'fixed' ? "border-b-2 border-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                Fixed
                                            </button>
                                            <button
                                                onClick={() => setDateRangeTab('rolling')}
                                                className={cn(
                                                    "flex-1 py-2 text-sm font-medium",
                                                    dateRangeTab === 'rolling' ? "border-b-2 border-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                Rolling
                                            </button>
                                        </div>
                                        <ScrollArea className="flex-1 h-[300px]">
                                            <div className="p-1">
                                                {DATE_PRESETS.map(preset => (
                                                    <button
                                                        key={preset}
                                                        onClick={() => setSelectedPreset(preset)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent flex items-center justify-between",
                                                            selectedPreset === preset && "bg-accent"
                                                        )}
                                                    >
                                                        <span>{preset}</span>
                                                        {selectedPreset === preset && <Check className="h-4 w-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Right: Calendar */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex-1 px-3 py-2 border rounded-md text-sm bg-muted/30">
                                                {dateRange?.from ? format(dateRange.from, 'MMMM d, yyyy') : 'Start date'}
                                            </div>
                                            <span className="text-muted-foreground">→</span>
                                            <div className="flex-1 px-3 py-2 border rounded-md text-sm bg-muted/30">
                                                {dateRange?.to ? format(dateRange.to, 'MMMM d, yyyy') : 'End date'}
                                            </div>
                                            <Button variant="outline" size="icon" className="h-9 w-9">
                                                <Clock className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                            className="rounded-md border"
                                        />
                                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                            <Button variant="outline" size="sm" onClick={() => setTodayOpen(false)}>Cancel</Button>
                                            <Button size="sm" onClick={() => setTodayOpen(false)}>Apply</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Comparison Popover */}
                        <Popover open={comparisonOpen} onOpenChange={setComparisonOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal border-dashed px-3">
                                    <CalendarIcon className="h-4 w-4" />
                                    {format(new Date(), 'MMM d, yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                                <div className="flex">
                                    {/* Left Sidebar: Comparison Presets */}
                                    <div className="w-56 border-r">
                                        <ScrollArea className="h-[380px]">
                                            <div className="p-1">
                                                {COMPARISON_PRESETS.map(preset => (
                                                    <button
                                                        key={preset}
                                                        onClick={() => setSelectedComparison(preset)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-accent flex items-center justify-between",
                                                            selectedComparison === preset && "bg-accent"
                                                        )}
                                                    >
                                                        <span>{preset}</span>
                                                        {selectedComparison === preset && <Check className="h-4 w-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Right: Calendar */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex-1 px-3 py-2 border rounded-md text-sm">
                                                {dateRange?.from ? format(dateRange.from, 'MMMM d, yyyy') : 'Start date'}
                                            </div>
                                            <span className="text-muted-foreground">→</span>
                                            <div className="flex-1 px-3 py-2 bg-zinc-800 text-white rounded-md text-sm">
                                                {dateRange?.to ? format(dateRange.to, 'MMMM d, yyyy') : 'End date'}
                                            </div>
                                            <Button variant="outline" size="icon" className="h-9 w-9">
                                                <Clock className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                            className="rounded-md border"
                                        />
                                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                            <Button variant="outline" size="sm" onClick={() => setComparisonOpen(false)}>Cancel</Button>
                                            <Button size="sm" onClick={() => setComparisonOpen(false)}>Apply</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Currency Popover */}
                        <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-2 text-sm font-normal border-dashed px-3">
                                    <ArrowRightLeft className="h-4 w-4" />
                                    {selectedCurrency}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-0" align="start" sideOffset={8}>
                                <div className="p-3 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="currencySearch"
                                            name="currencySearch"
                                            placeholder="Search for a currency"
                                            className="pl-9"
                                            value={currencySearch}
                                            onChange={(e) => setCurrencySearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <ScrollArea className="h-64">
                                    <div className="p-1">
                                        {filteredCurrencies.map(currency => (
                                            <button
                                                key={currency.code}
                                                onClick={() => {
                                                    setSelectedCurrency(currency.code)
                                                    setCurrencySearch('')
                                                    setCurrencyOpen(false)
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-accent flex items-center justify-between",
                                                    selectedCurrency === currency.code && "bg-accent"
                                                )}
                                            >
                                                <span>{currency.name} ({currency.code})</span>
                                                {selectedCurrency === currency.code && <Check className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Edit Mode) */}
                {isEditing && (
                    <div className="w-72 border-r bg-background flex flex-col shrink-0">
                        <div className="p-3 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="widgetSearch"
                                    name="widgetSearch"
                                    placeholder="Search"
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-3 space-y-4">
                                {Object.entries(groupedWidgets).map(([category, widgets]) => (
                                    <div key={category}>
                                        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">{category}</h3>
                                        <div className="space-y-1">
                                            {widgets.map(widget => (
                                                <button
                                                    key={widget.id}
                                                    onClick={() => setItems(prev => [...prev, { id: widget.id, colSpan: widget.defaultColSpan }])}
                                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted flex items-center justify-between group"
                                                >
                                                    <span>{widget.title}</span>
                                                    <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {/* Main Dashboard */}
                <div className={cn("flex-1 overflow-auto", isEditing ? "p-6 bg-muted/30" : "")}>
                    {isEditing && (
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Dashboard</h2>
                        </div>
                    )}

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
                                {items.map((item) => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        className={item.colSpan}
                                        isEditing={isEditing}
                                        onRemove={removeItem}
                                    >
                                        {renderCardContent(item.id)}
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}
