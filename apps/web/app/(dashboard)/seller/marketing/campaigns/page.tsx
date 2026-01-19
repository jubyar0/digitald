"use client";

import Link from "next/link";
import { Folder, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CampaignsPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
                </div>
                <Link href="/seller/marketing/campaigns/new-campaign">
                    <Button>Create campaign</Button>
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex items-center">
                    <Badge variant="secondary" className="rounded-sm px-3 py-1 text-sm font-normal bg-muted hover:bg-muted/80 cursor-pointer">
                        All
                    </Badge>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[50px]">
                                        <Checkbox />
                                    </TableHead>
                                    <TableHead className="w-[300px]">
                                        <Button variant="ghost" className="p-0 hover:bg-transparent font-medium text-xs text-muted-foreground uppercase tracking-wider">
                                            Campaign
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="p-0 hover:bg-transparent font-medium text-xs text-muted-foreground uppercase tracking-wider">
                                            Updated
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Created</TableHead>
                                    <TableHead className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider">Sessions (YTD)</TableHead>
                                    <TableHead className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider">Sales (YTD)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link href="/seller/marketing/campaigns/new-campaign" className="hover:underline">
                                            dfdf
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">Jan 12, 2026</TableCell>
                                    <TableCell className="text-muted-foreground">Jan 12, 2026</TableCell>
                                    <TableCell className="text-right text-muted-foreground">—</TableCell>
                                    <TableCell className="text-right text-muted-foreground">—</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-xs text-muted-foreground mt-8">
                Learn more about <a href="#" className="underline text-blue-600">campaigns</a>
            </div>
        </div>
    );
}
