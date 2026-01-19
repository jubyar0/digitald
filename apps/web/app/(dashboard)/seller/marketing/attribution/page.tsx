"use client";

import { useState } from "react";
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Info,
    Printer,
    Download,
    Activity,
    Settings2
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AttributionPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 11, 13),
        to: new Date(2026, 0, 11),
    });

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-2xl font-bold tracking-tight">Attribution</h2>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        Channels
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-3 w-3" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Select defaultValue="daily">
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Granularity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Select defaultValue="last-non-direct-click">
                        <SelectTrigger className="w-[200px]">
                            <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Attribution model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last-non-direct-click">Last non-direct click</SelectItem>
                            <SelectItem value="last-click">Last click</SelectItem>
                            <SelectItem value="first-click">First click</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Chart Section */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                        Sessions by top 5 channels over time
                        <ChevronDown className="h-3 w-3" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-end justify-between px-4 pb-4 relative border-b border-l">
                        {/* Y-Axis Labels */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground -ml-6 py-4">
                            <span>3</span>
                            <span>2</span>
                            <span>1</span>
                            <span>0</span>
                        </div>

                        {/* Placeholder Chart Line */}
                        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                            <path
                                d="M0,300 L50,300 L100,300 L150,300 L200,300 L250,300 L300,300 L350,300 L400,300 L450,300 L500,300 L550,300 L600,300 L650,300 L700,300 L750,300 L800,300 L850,300 L900,300 L950,250 L1000,50"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>

                        {/* X-Axis Labels (Simplified) */}
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="text-[10px] text-muted-foreground translate-y-6">
                                Dec {13 + i}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>Direct</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                <Info className="h-4 w-4 text-blue-800" />
                <AlertDescription className="text-xs flex items-center justify-between w-full">
                    <span>Cost, click, and impression metrics are now available for supported marketing apps. <a href="#" className="underline">Learn more</a></span>
                    <button className="text-blue-800 hover:text-blue-900">×</button>
                </AlertDescription>
            </Alert>

            {/* Attribution Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50 text-xs uppercase tracking-wider">
                                <TableHead className="w-[150px]">Channel</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Sessions</TableHead>
                                <TableHead className="text-right">Sales</TableHead>
                                <TableHead className="text-right">Orders</TableHead>
                                <TableHead className="text-right">Conversion rate</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                                <TableHead className="text-right">ROAS</TableHead>
                                <TableHead className="text-right">CPA</TableHead>
                                <TableHead className="text-right">CTR</TableHead>
                                <TableHead className="text-right">AOV</TableHead>
                                <TableHead className="text-right">Orders from new customers</TableHead>
                                <TableHead className="text-right">Orders from returning customers</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="text-xs">
                                <TableCell className="font-medium flex items-center gap-2">
                                    <span className="text-base">🏛️</span> Direct
                                </TableCell>
                                <TableCell>direct</TableCell>
                                <TableCell className="text-right">3</TableCell>
                                <TableCell className="text-right">DZD 0.00</TableCell>
                                <TableCell className="text-right">0</TableCell>
                                <TableCell className="text-right">0%</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">0</TableCell>
                                <TableCell className="text-right">0</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
