"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { updateSellerPolicy, generatePolicyTemplate } from "@/actions/seller-policies"

interface PolicyEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    policyType: 'refundPolicy' | 'privacyPolicy' | 'termsOfService' | 'shippingPolicy' | 'contactInformation'
    policyTitle: string
    initialContent: string
    onSave?: () => void
}

export function PolicyEditor({
    open,
    onOpenChange,
    policyType,
    policyTitle,
    initialContent,
    onSave
}: PolicyEditorProps) {
    const [content, setContent] = useState(initialContent)
    const [isSaving, setIsSaving] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    // Update content when initialContent changes
    useEffect(() => {
        setContent(initialContent)
    }, [initialContent])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await updateSellerPolicy(policyType, content)
            if (result.success) {
                toast.success('Policy updated successfully')
                onSave?.()
                onOpenChange(false)
            } else {
                toast.error(result.error || 'Failed to update policy')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setIsSaving(false)
        }
    }

    const handleGenerateTemplate = async () => {
        setIsGenerating(true)
        try {
            const template = await generatePolicyTemplate(policyType)
            setContent(template)
            toast.success('Template generated successfully')
        } catch (error) {
            toast.error('Failed to generate template')
        } finally {
            setIsGenerating(false)
        }
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    const charCount = content.length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{policyTitle}</DialogTitle>
                    <DialogDescription>
                        Create or edit your {policyTitle.toLowerCase()}. This will be shown to customers during checkout.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="policy-content">Policy Content</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateTemplate}
                                disabled={isGenerating}
                                className="gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Generate Template
                                    </>
                                )}
                            </Button>
                        </div>
                        <Textarea
                            id="policy-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Enter your ${policyTitle.toLowerCase()} here...`}
                            className="min-h-[400px] font-mono text-sm"
                        />
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{wordCount} words</span>
                            <span>•</span>
                            <span>{charCount} characters</span>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-muted/30 p-4">
                        <h4 className="text-sm font-medium mb-2">Tip</h4>
                        <p className="text-sm text-muted-foreground">
                            You can use markdown formatting in your policy content. The template generator provides a good starting point that you can customize for your store.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Policy'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
