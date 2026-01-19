"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    Settings2,
    ChevronRight,
    ChevronLeft,
    ShoppingBag,
    Mail,
    Info,
    X,
    ZoomIn,
    ZoomOut,
    Maximize,
    Download
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const templates = [
    {
        title: "Recover abandoned checkout",
        description: "Send an email 10 hours after a customer gets to checkout but doesn't place an order to...",
        creator: "dIGO",
        icon: ShoppingBag,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Recover abandoned cart",
        description: "Send a marketing email when a customer adds at least one product to their cart but doesn't...",
        creator: "dIGO",
        icon: ShoppingBag,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Convert abandoned product browse",
        description: "Send a marketing email to customers who viewed a product but didn't add it to their cart...",
        creator: "dIGO",
        icon: ShoppingBag,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Welcome new subscribers with a discount email",
        description: "Send new subscribers a welcome email with a discount when they subscribe through a form ...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Thank customers after they purchase",
        description: "Send a different thank you email to customers after their first and second purchases. 1 day...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Welcome new subscribers with a discount series",
        description: "Send new subscribers a welcome series with 4 emails when they subscribe through a form on...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Celebrate customer birthday",
        description: "Build customer loyalty by offering customers a special discount on their birthday. This...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Win back customers",
        description: "Give a discount to customers who haven't placed an order at your store in the last 60 day...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Upsell customers after their first purchase",
        description: "Send a marketing email showcasing featured products after a customer makes their first...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Show your brand story with new subscribers",
        description: "Introduce new subscribers to your brand with 4 emails when they subscribe through a form on...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Welcome VIP customers",
        description: "Send high value customers a marketing email once they join the VIP customers segment. Thi...",
        creator: "dIGO",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Email waitlisted customers when a product is back in stock",
        description: "Automatically send an email to waitlisted customers via Mini: Coming Soon & Waitlist Ap...",
        creator: "Restock Alert & Waitlist Mini",
        icon: Mail,
        color: "bg-purple-100 text-purple-600",
    },
];

export default function AutomationTemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller/marketing/automations" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-xl font-semibold tracking-tight">Automation templates</h2>
                    </div>
                </div>
                <Button variant="secondary" size="sm" className="bg-muted hover:bg-muted/80">
                    Create custom automation
                </Button>
            </div>

            {/* Search and Filters */}
            <Card className="rounded-lg shadow-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="template-search"
                            name="template-search"
                            type="search"
                            placeholder="Searching all templates"
                            className="pl-9 bg-muted/50 border-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select name="required-apps">
                            <SelectTrigger id="required-apps-trigger" className="w-[150px] h-8 text-xs">
                                <SelectValue placeholder="Required apps" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All apps</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select name="app-status">
                            <SelectTrigger id="app-status-trigger" className="w-[150px] h-8 text-xs">
                                <SelectValue placeholder="App status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template, i) => (
                    <Card
                        key={i}
                        className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTemplate(template)}
                    >
                        <CardHeader className="p-4 pb-2 space-y-2">
                            <CardTitle className="text-sm font-semibold leading-tight">
                                {template.title}
                            </CardTitle>
                            <CardDescription className="text-xs line-clamp-3">
                                {template.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-1">
                            <p className="text-[10px] text-muted-foreground mt-2">
                                Created by {template.creator}
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-end">
                            <div className={`p-1 rounded ${template.color}`}>
                                <template.icon className="h-4 w-4" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">1-30</span>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Template Details Dialog */}
            <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="flex items-center justify-between">
                            <span>{selectedTemplate?.title}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-6 pb-6 space-y-6">
                        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                            <Info className="h-4 w-4 text-blue-800" />
                            <AlertDescription className="text-xs">
                                Marketing automations are not available on trial. <a href="#" className="underline">Upgrade your plan to create an automation.</a>
                            </AlertDescription>
                        </Alert>

                        {/* Workflow Visualization */}
                        <div className="relative w-full h-[300px] bg-muted/20 rounded-lg border overflow-hidden">
                            {/* Dot Pattern Background */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            {/* Mock Workflow Nodes */}
                            <div className="absolute inset-0 flex items-center justify-center gap-8">
                                {/* Node 1 */}
                                <div className="w-48 bg-white rounded-lg border shadow-sm p-3 relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-semibold">Customer abandons checkout</span>
                                        <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">This workflow starts when a customer abandons a checkout</p>
                                    {/* Connector Line */}
                                    <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-border"></div>
                                </div>

                                {/* Node 2 */}
                                <div className="w-48 bg-white rounded-lg border shadow-sm p-3 relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-semibold">Condition</span>
                                        <Settings2 className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Customer abandoned checkout on online store</p>
                                    <div className="mt-2 flex flex-col items-end text-[8px] text-muted-foreground">
                                        <span>✓ True</span>
                                        <span>× False</span>
                                    </div>
                                    {/* Connector Line */}
                                    <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-border"></div>
                                </div>

                                {/* Node 3 */}
                                <div className="w-48 bg-white rounded-lg border shadow-sm p-3 relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-semibold">Condition</span>
                                        <Settings2 className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Total price of checkout is more than $0.00</p>
                                    <div className="mt-2 flex flex-col items-end text-[8px] text-muted-foreground">
                                        <span>✓ True</span>
                                        <span>× False</span>
                                    </div>
                                </div>
                            </div>

                            {/* Zoom Controls */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white rounded-md border shadow-sm p-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ZoomOut className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ZoomIn className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Maximize className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold">About this template</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {selectedTemplate?.description} By default, this abandoned checkout automation will only send to customers subscribed to marketing.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Created by</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-4 w-4 bg-green-500 rounded-sm flex items-center justify-center text-white text-[8px] font-bold">S</div>
                                        <span className="font-medium text-foreground">dIGO</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold">Required apps</h4>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                                            <Mail className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">dIGO Messaging</p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <span>4.7</span>
                                                <span className="text-yellow-500">★</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                        <Download className="mr-2 h-3 w-3" />
                                        Install
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t bg-muted/10">
                        <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
