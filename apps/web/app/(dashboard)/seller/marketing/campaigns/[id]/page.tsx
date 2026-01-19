"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Settings
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
    const [campaignName, setCampaignName] = useState("dfdf");

    // Placeholder for charts - in a real app these would be Recharts components
    const EmptyChart = ({ title }: { title: string }) => (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[150px] text-xs text-muted-foreground">
                No data for this date range
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/seller/marketing" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">Marketing</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Search placeholder */}
                    <div className="relative w-64 hidden md:block">
                        <span className="absolute left-2 top-2.5 text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </span>
                        <Input placeholder="Search" className="pl-8 h-9 bg-muted/50 border-none" />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto">
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Main Content */}
                    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <span className="w-4 h-4 border rounded flex items-center justify-center">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                                    </span>
                                    <span>{campaignName}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Created on January 12, 2026</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8">
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    Year to date
                                </Button>
                            </div>
                        </div>

                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Sessions", value: "0" },
                                { label: "Sales", value: "DZD 0" },
                                { label: "Orders", value: "0" },
                                { label: "Average order value", value: "DZD 0" },
                            ].map((metric, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <div className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</div>
                                        <div className="text-2xl font-bold">{metric.value}</div>
                                        <div className="mt-4 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[0%]"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EmptyChart title="Sessions by channel" />
                            <EmptyChart title="Sales by channel" />
                            <EmptyChart title="Sessions by UTM parameters" />
                            <EmptyChart title="Sales by UTM parameters" />
                            <EmptyChart title="Orders from new vs. returning customers" />
                            <EmptyChart title="Sales by order" />
                            <EmptyChart title="Items sold by product" />
                            <EmptyChart title="Sessions by device" />
                            <div className="md:col-span-2">
                                <EmptyChart title="Sessions by location" />
                            </div>
                        </div>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="w-full lg:w-80 border-l bg-muted/10 p-4 space-y-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Back</span>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">More actions <ChevronDown className="ml-1 h-3 w-3" /></Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    className="font-medium"
                                />
                                <div className="text-xs text-muted-foreground">
                                    ID<br />
                                    <span className="font-mono">fc4186</span>
                                </div>
                            </div>

                            <Card>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                        Shareable links
                                        <Plus className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                                        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                                            <span className="font-mono">QR</span>
                                            <span className="truncate">/s/fc4186</span>
                                            <span className="font-mono">URL</span>
                                            <span className="truncate">/utm_campaign=fc4186&utm_source...</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                        Auto-match rules
                                        <Plus className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <p className="text-xs text-muted-foreground">Create rules to automatically assign traffic</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                        Campaign activities
                                        <Plus className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <p className="text-xs text-muted-foreground">Manually assign existing marketing traffic</p>
                                </CardContent>
                            </Card>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
