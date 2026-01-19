import { Settings2, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { getAutomations, toggleAutomation } from "@/actions/marketing";

export default async function AutomationsPage() {
    const automationsResult = await getAutomations();
    const automations = automationsResult.success && automationsResult.data ? automationsResult.data : [];

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
                    <span className="text-sm font-medium text-muted-foreground">
                        {automations.filter(a => a.status === 'ACTIVE').length} of {automations.length} tasks active
                    </span>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-1">Start with these essential templates</h3>
                    <p className="text-xs text-muted-foreground mb-4">Automate customer communications to increase engagement, sales, and return on your marketing spend.</p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-2">
                    {automations.map((automation) => (
                        <AccordionItem key={automation.id} value={automation.id} className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${automation.status === 'ACTIVE' ? 'bg-green-500 border-green-500' : 'border-muted-foreground/30'}`}></div>
                                        <span className="text-sm font-medium">{automation.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-xs text-muted-foreground">{automation.status}</span>
                                        <form action={async () => {
                                            "use server"
                                            await toggleAutomation(automation.id, automation.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
                                        }}>
                                            <Switch
                                                checked={automation.status === 'ACTIVE'}
                                                type="submit"
                                            />
                                        </form>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-8 pb-4">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            This automation is currently {automation.status.toLowerCase()}. Toggle the switch to enable or disable it.
                                        </p>
                                        <Button size="sm" className="bg-black text-white hover:bg-black/90">
                                            Edit automation
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
                    ))}
                </Accordion>
            </div>

            <div className="text-center text-xs text-muted-foreground mt-8">
                Learn more about <a href="#" className="underline text-blue-600">automations</a>
            </div>
        </div>
    );
}
