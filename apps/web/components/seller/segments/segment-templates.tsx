"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SegmentTemplatesProps {
    onSelectTemplate: (query: string) => void
}

const templates = [
    {
        title: "New Customers",
        description: "Customers who joined in the last 30 days.",
        query: "WHERE created_at > NOW() - INTERVAL '30 days'",
    },
    {
        title: "High Value Customers",
        description: "Customers who have spent more than $500.",
        query: "WHERE total_spent > 500",
    },
    {
        title: "Returning Customers",
        description: "Customers with more than 1 order.",
        query: "WHERE orders_count > 1",
    },
    {
        title: "Inactive Customers",
        description: "Customers who haven't ordered in 90 days.",
        query: "WHERE last_order_date < NOW() - INTERVAL '90 days'",
    },
    {
        title: "Email Subscribers",
        description: "Customers who opted in to marketing.",
        query: "WHERE accepts_marketing = true",
    },
]

export function SegmentTemplates({ onSelectTemplate }: SegmentTemplatesProps) {
    return (
        <Card className="h-full border-l rounded-none border-y-0 border-r-0 shadow-none">
            <CardHeader>
                <CardTitle className="text-lg">Templates</CardTitle>
                <CardDescription>Start with a pre-built segment.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="flex flex-col gap-2 p-4 pt-0">
                        {templates.map((template, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-auto flex-col items-start justify-start p-4 text-left whitespace-normal"
                                onClick={() => onSelectTemplate(template.query)}
                            >
                                <span className="font-semibold">{template.title}</span>
                                <span className="text-xs text-muted-foreground mt-1">
                                    {template.description}
                                </span>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
