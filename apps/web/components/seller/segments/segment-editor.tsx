"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SegmentTemplates } from "./segment-templates"
import { createSegment, updateSegment, runSegmentQuery } from "@/app/actions/segments"
import { toast } from "sonner"
import { Play, Loader2, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormActionStore } from "@/stores/form-action-store"

interface SegmentEditorProps {
    initialData?: {
        id: string
        name: string
        query: string
        description?: string | null
    }
}

export function SegmentEditor({ initialData }: SegmentEditorProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isRunning, setIsRunning] = useTransition()

    const [name, setName] = useState(initialData?.name || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [query, setQuery] = useState(initialData?.query || "")
    const [queryResult, setQueryResult] = useState<{ count: number } | null>(null)

    const { showActions, hideActions, setIsDirty, setIsPending: setStoreIsPending } = useFormActionStore()

    const handleRunQuery = () => {
        startTransition(async () => {
            const result = await runSegmentQuery(query)
            if (result.success && result.count !== undefined) {
                setQueryResult({ count: result.count })
                toast.success(`Query executed successfully. Found ${result.count} customers.`)
            } else {
                toast.error(result.error || "Failed to run query")
            }
        })
    }

    const handleSave = useCallback(() => {
        if (!name) {
            toast.error("Please enter a segment name")
            return
        }
        if (!query) {
            toast.error("Please enter a query")
            return
        }

        startTransition(async () => {
            let result
            if (initialData?.id) {
                result = await updateSegment(initialData.id, { name, query, description })
            } else {
                result = await createSegment({ name, query, description })
            }

            if (result.success) {
                toast.success(initialData ? "Segment updated" : "Segment created")
                router.push("/seller/customers/segments")
            } else {
                toast.error(result.error || "Failed to save segment")
            }
        })
    }, [name, query, description, initialData, router])

    const handleDiscard = useCallback(() => {
        setName(initialData?.name || "")
        setDescription(initialData?.description || "")
        setQuery(initialData?.query || "")
        toast.info("Changes discarded")
    }, [initialData])

    // Sync pending state
    useEffect(() => {
        setStoreIsPending(isPending)
    }, [isPending, setStoreIsPending])

    // Register actions and track dirty state
    useEffect(() => {
        const isDirty =
            name !== (initialData?.name || "") ||
            description !== (initialData?.description || "") ||
            query !== (initialData?.query || "")

        setIsDirty(isDirty)

        showActions({
            onSave: handleSave,
            onDiscard: handleDiscard
        })

        return () => hideActions()
    }, [name, description, query, initialData, showActions, hideActions, setIsDirty, handleSave, handleDiscard])

    return (
        <div className="flex h-[calc(100vh-100px)] overflow-hidden border rounded-lg bg-background shadow-sm">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="grid gap-1.5 flex-1 max-w-md">
                            <Input
                                placeholder="Segment Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
                    <div className="grid gap-2">
                        <Label>Description (Optional)</Label>
                        <Input
                            placeholder="Describe this segment..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-2 min-h-[300px]">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                                <Code2 className="h-4 w-4" />
                                Query Editor
                            </Label>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleRunQuery}
                                disabled={isRunning || !query}
                            >
                                {isRunning ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Play className="mr-2 h-4 w-4" />
                                )}
                                Run Query
                            </Button>
                        </div>
                        <div className="relative flex-1 rounded-md border bg-muted/50 font-mono text-sm">
                            <Textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-4 focus-visible:ring-0 font-mono"
                                placeholder="SELECT * FROM customers WHERE..."
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {queryResult !== null && (
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                Query Results
                            </div>
                            <div className="text-2xl font-bold">
                                {queryResult.count} <span className="text-base font-normal text-muted-foreground">customers found</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l bg-muted/10">
                <SegmentTemplates onSelectTemplate={(q) => setQuery(q)} />
            </div>
        </div>
    )
}
