"use client";

import { useState } from "react";
import { Settings2, Mail, LayoutTemplate } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function AutomationsPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-2xl font-bold tracking-tight">Automations</h2>
                </div>
                <Link href="/seller/marketing/automations/templates">
                    <Button size="sm" className="bg-black text-white hover:bg-black/90">
                        View templates
                    </Button>
                </Link>
            </div>

            {/* Hero Section */}
            <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                    <div className="max-w-md space-y-4">
                        <h3 className="text-xl font-semibold">Automate multi-channel customer journeys</h3>
                        <p className="text-sm text-muted-foreground">
                            Marketing automations are set up once and run for as long as you want.
                        </p>
                        <Link href="/seller/marketing/automations/templates">
                            <Button size="sm" className="bg-black text-white hover:bg-black/90">
                                View templates
                            </Button>
                        </Link>
                    </div>


                </CardContent>
                <div className="p-4 text-center border-t">
                    <p className="text-xs text-muted-foreground">
                        Turn visitors into subscribers
                        <br />
                        <span className="opacity-70">From opt-in forms to automated welcome emails and marketing campaigns, set your business growth in motion.</span> <a href="#" className="underline text-blue-600">View case study</a>
                    </p>
                </div>
            </Card>

            {/* Tasks Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30"></div>
                    <span className="text-sm font-medium text-muted-foreground">0 of 5 tasks complete</span>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-1">Start with these essential templates</h3>
                    <p className="text-xs text-muted-foreground mb-4">Automate customer communications to increase engagement, sales, and return on your marketing spend.</p>
                </div>

                <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                    <AccordionItem value="item-1" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0"></div>
                                <span className="text-sm font-medium">Recover abandoned checkout</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 pb-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        An automated email is already created for you. Take a moment to review the email and make any additional adjustments to the design, messaging, or recipient list.
                                    </p>
                                    <Button size="sm" className="bg-black text-white hover:bg-black/90">
                                        Review email
                                    </Button>
                                </div>
                                <div className="w-full md:w-64 bg-muted/20 rounded-lg border p-4 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <Mail className="h-8 w-8 mx-auto text-muted-foreground" />
                                        <div className="h-2 w-20 bg-muted-foreground/20 rounded mx-auto"></div>
                                        <div className="h-2 w-16 bg-muted-foreground/20 rounded mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {[
                        "Recover abandoned cart",
                        "Convert abandoned product browse",
                        "Welcome new subscribers with a discount email",
                        "Thank customers after they purchase"
                    ].map((task, i) => (
                        <AccordionItem key={i} value={`item-${i + 2}`} className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0"></div>
                                    <span className="text-sm font-medium">{task}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-8 pb-4">
                                <p className="text-sm text-muted-foreground">
                                    Template content would go here.
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="text-center text-xs text-muted-foreground mt-8">
                Learn more about <a href="#" className="underline text-blue-600">automations</a>
            </div>
        </div>
    );
}
