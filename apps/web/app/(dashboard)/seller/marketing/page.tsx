"use client";

import { useState } from "react";
import { CalendarIcon, ChevronDown, Info } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import Link from "next/link";

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
    CardDescription,
    CardFooter,
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
import { Separator } from "@/components/ui/separator";

export default function MarketingPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 10, 12),
        to: new Date(2025, 11, 12),
    });

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
            </div>

            {/* Date Range and Comparison Controls */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
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
                </div>
                <div className="flex items-center space-x-2">
                    <span>Compare to:</span>
                    <span className="font-medium text-foreground">Nov 12–Dec 12, 2025</span>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                    <Select defaultValue="last-non-direct-click">
                        <SelectTrigger className="w-[180px]">
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

            {/* Summary Metrics */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-5 gap-4 divide-x">
                        <div className="px-4 first:pl-0">
                            <div className="text-sm font-medium text-muted-foreground">Sessions</div>
                            <div className="text-2xl font-bold">3</div>
                            <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[10%]"></div>
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="text-sm font-medium text-muted-foreground">Sales attributed to marketing</div>
                            <div className="text-2xl font-bold">DZD 0</div>
                            <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[0%]"></div>
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="text-sm font-medium text-muted-foreground">Orders attributed to marketing</div>
                            <div className="text-2xl font-bold">0</div>
                            <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[0%]"></div>
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="text-sm font-medium text-muted-foreground">Conversion rate</div>
                            <div className="text-2xl font-bold">0%</div>
                            <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[0%]"></div>
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="text-sm font-medium text-muted-foreground">AOV attributed to marketing</div>
                            <div className="text-2xl font-bold">DZD 0</div>
                            <div className="mt-2 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[0%]"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Marketing Channels */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Top marketing channels</CardTitle>
                    <Button variant="link" className="text-blue-600 h-auto p-0">View report</Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md bg-blue-50 p-4 mb-4 flex items-start space-x-2 text-sm text-blue-700">
                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            Cost, click, and impression metrics are now available for supported marketing apps. <a href="#" className="underline font-medium">Learn more</a>
                        </div>
                        <Button variant="ghost" size="icon" className="h-4 w-4 text-blue-700 hover:text-blue-900 hover:bg-blue-100">
                            <span className="sr-only">Dismiss</span>
                            <span aria-hidden="true">×</span>
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Channel</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Sessions <ChevronDown className="inline h-3 w-3" /></TableHead>
                                <TableHead className="text-right">Sales</TableHead>
                                <TableHead className="text-right">Orders</TableHead>
                                <TableHead className="text-right">Conversion rate</TableHead>
                                <TableHead className="text-right">ROAS</TableHead>
                                <TableHead className="text-right">CPA</TableHead>
                                <TableHead className="text-right">CTR</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium flex items-center">
                                    <span className="mr-2">🏛️</span> Direct
                                </TableCell>
                                <TableCell>direct</TableCell>
                                <TableCell className="text-right">3</TableCell>
                                <TableCell className="text-right">DZD 0.00</TableCell>
                                <TableCell className="text-right">0</TableCell>
                                <TableCell className="text-right">0%</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">—</TableCell>
                                <TableCell className="text-right">—</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Campaign Tracking */}
            <Card className="bg-muted/50">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-2 max-w-xl">
                        <h3 className="font-semibold text-lg">Centralize your campaign tracking</h3>
                        <p className="text-sm text-muted-foreground">
                            Create campaigns to evaluate how marketing initiatives drive business goals. Capture online and offline touchpoints, add campaign activities from multiple marketing channels, and monitor results.
                        </p>
                        <Link href="/seller/marketing/campaigns/new-campaign">
                            <Button variant="outline" className="mt-4">Create campaign</Button>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        {/* Placeholder for the folder illustration */}
                        <div className="w-32 h-24 bg-blue-500 rounded-lg relative flex items-center justify-center shadow-lg transform rotate-[-5deg]">
                            <div className="absolute inset-0 bg-blue-400 rounded-lg transform translate-x-1 translate-y-1 opacity-50"></div>
                            <div className="text-white text-4xl">📊</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Marketing Apps */}
            <Card className="bg-muted/50">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-2 max-w-xl">
                        <h3 className="font-semibold text-lg">Generate traffic with marketing apps</h3>
                        <p className="text-sm text-muted-foreground">
                            Grow your audience on social platforms, capture new leads with newsletter sign-ups, increase conversion with chat, and more.
                        </p>
                        <Link href="/seller/app-store">
                            <Button variant="link" className="p-0 h-auto text-blue-600 mt-2">Explore marketing apps</Button>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        {/* Placeholder for the apps illustration */}
                        <div className="w-32 h-24 bg-gray-100 rounded-lg relative flex items-center justify-center border border-gray-200">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="w-8 h-2 bg-gray-300 rounded"></div>
                                <div className="w-8 h-2 bg-blue-300 rounded"></div>
                                <div className="w-8 h-2 bg-green-300 rounded"></div>
                                <div className="w-8 h-2 bg-yellow-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground mt-8">
                Learn more about <a href="#" className="underline text-blue-600">marketing campaigns</a> and how <a href="#" className="underline text-blue-600">dIGO syncs report data</a>.
            </div>
        </div>
    );
}
