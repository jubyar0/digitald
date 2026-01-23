"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Plus, X, Star } from "lucide-react"
import Link from "next/link"


export function CustomersEmptyState() {
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [isAppsOpen, setIsAppsOpen] = useState(false)

    return (
        <div className="flex h-full flex-1 flex-col container mx-auto p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
                <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg border bg-card p-12 text-center shadow-sm">
                    <div className="mb-6 flex h-40 w-40 items-center justify-center">
                        <img
                            src="/media/illustrations/18.svg"
                            alt="No customers"
                            className="h-32 w-32 object-contain dark:opacity-80"
                        />
                    </div>

                    <h2 className="text-lg font-semibold">Everything customers-related in one place</h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">
                        Manage customer details, see customer order history, and group customers into segments.
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Button asChild>
                            <Link href="/seller/customers/new">Add customer</Link>
                        </Button>
                        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Import customers</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Import customers by CSV</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                        <Button variant="outline" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add file
                                        </Button>
                                    </div>
                                    <div>
                                        <Button variant="link" className="h-auto p-0 text-blue-600" asChild>
                                            <a href="#">Download a sample CSV</a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                                    <Button disabled>Import customers</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-6 rounded-lg border bg-card p-6 shadow-sm">
                <img
                    src="/media/illustrations/28.svg"
                    alt="Get customers with apps"
                    className="h-24 w-24 object-contain dark:opacity-80 flex-shrink-0"
                />
                <div className="flex-1">
                    <h3 className="font-semibold">Get customers with apps</h3>
                    <p className="text-sm text-muted-foreground">Grow your customer list by adding a lead capture form to your store and marketing.</p>
                </div>
                <div>
                    <Dialog open={isAppsOpen} onOpenChange={setIsAppsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">See app recommendations</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                            <div className="flex h-[600px]">
                                {/* Sidebar */}
                                <div className="w-1/3 border-r bg-muted/10 p-4">
                                    <h4 className="mb-4 font-semibold text-sm">Pop-up apps</h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Grow your customer list by adding a lead capture form to your store and marketing.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 rounded-md bg-background p-2 border shadow-sm">
                                            <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center text-purple-600 font-bold">SF</div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="truncate text-sm font-medium">Shopify Forms</div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Star className="h-3 w-3 fill-current" /> 4.3
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-7 text-xs">Install</Button>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50">
                                            <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600 font-bold">SI</div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="truncate text-sm font-medium">Shopify Inbox</div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Star className="h-3 w-3 fill-current" /> 4.7
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-7 text-xs">Install</Button>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                                            Discover more in the Shopify App Store
                                        </Button>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="font-semibold">More apps to help build your customer base</h4>
                                        <Button variant="ghost" size="icon" onClick={() => setIsAppsOpen(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { name: "Omnisend Email Marketing & SMS", rating: "4.8", icon: "O", color: "bg-emerald-100 text-emerald-600" },
                                            { name: "SendWill Popup Email Marketing", rating: "5.0", icon: "S", color: "bg-blue-100 text-blue-600" },
                                            { name: "Pop Convert - Pop Ups, Banners", rating: "4.9", icon: "P", color: "bg-indigo-100 text-indigo-600" },
                                            { name: "Seguno Email Marketing", rating: "4.8", icon: "S", color: "bg-orange-100 text-orange-600" },
                                            { name: "Attentive: Email & SMS Marketing", rating: "4.9", icon: "A", color: "bg-yellow-100 text-yellow-600" },
                                            { name: "RevenueHunt: Recommender Quiz", rating: "4.9", icon: "R", color: "bg-cyan-100 text-cyan-600" },
                                        ].map((app, i) => (
                                            <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0">
                                                <div className={`h-10 w-10 rounded-lg ${app.color} flex items-center justify-center font-bold`}>
                                                    {app.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{app.name}</div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="h-3 w-3 fill-current" /> {app.rating} • Built for Shopify
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Download className="h-3 w-3" />
                                                    Install
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
