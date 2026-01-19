"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ChevronRight, Plus, Sparkles } from "lucide-react"
import { useState } from "react"
import { PolicyEditor } from "@/components/seller/policy-editor"
import { generatePolicyTemplate, updateSellerPolicy } from "@/actions/seller-policies"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Policy {
    id: string
    title: string
    type: 'refundPolicy' | 'privacyPolicy' | 'termsOfService' | 'shippingPolicy' | 'contactInformation'
    content: string
}

interface PoliciesClientProps {
    initialPolicies: {
        refundPolicy: string
        privacyPolicy: string
        termsOfService: string
        shippingPolicy: string
        contactInformation: string
    }
}

export function PoliciesClient({ initialPolicies }: PoliciesClientProps) {
    const router = useRouter()
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
    const [isGeneratingAll, setIsGeneratingAll] = useState(false)

    const policies: Policy[] = [
        { id: "refund", title: "Refund policy", type: "refundPolicy", content: initialPolicies.refundPolicy },
        { id: "privacy", title: "Privacy policy", type: "privacyPolicy", content: initialPolicies.privacyPolicy },
        { id: "terms", title: "Terms of service", type: "termsOfService", content: initialPolicies.termsOfService },
        { id: "shipping", title: "Shipping policy", type: "shippingPolicy", content: initialPolicies.shippingPolicy },
        { id: "contact", title: "Contact information", type: "contactInformation", content: initialPolicies.contactInformation },
    ]

    const handlePolicyClick = (policy: Policy) => {
        setSelectedPolicy(policy)
    }

    const handleSave = () => {
        router.refresh()
        setSelectedPolicy(null)
    }

    const handleGenerateAll = async () => {
        setIsGeneratingAll(true)
        try {
            const policyTypes: Array<'refundPolicy' | 'privacyPolicy' | 'termsOfService' | 'shippingPolicy' | 'contactInformation'> = [
                'refundPolicy',
                'privacyPolicy',
                'termsOfService',
                'shippingPolicy',
                'contactInformation'
            ]

            for (const policyType of policyTypes) {
                const template = await generatePolicyTemplate(policyType)
                await updateSellerPolicy(policyType, template)
            }

            toast.success('All policy templates generated successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to generate policy templates')
        } finally {
            setIsGeneratingAll(false)
        }
    }

    return (
        <>
            <div className="space-y-6">
                {/* Store Policies */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Store policies</CardTitle>
                        <CardDescription>Define your store's legal policies. These will be shown to customers during checkout.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg divide-y">
                            {policies.map((policy) => (
                                <div
                                    key={policy.id}
                                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                                    onClick={() => handlePolicyClick(policy)}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <span className="font-medium">{policy.title}</span>
                                            {policy.content && (
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                    {policy.content.substring(0, 60)}...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!policy.content && (
                                            <span className="text-sm text-muted-foreground">Not created</span>
                                        )}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Generate Policies */}
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Generate policies</p>
                                <p className="text-sm text-muted-foreground">
                                    Use our templates to quickly create standard policies for your store
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={handleGenerateAll}
                                disabled={isGeneratingAll}
                            >
                                {isGeneratingAll ? (
                                    <>
                                        <Sparkles className="h-4 w-4 animate-pulse" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Generate All
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Policy Editor Dialog */}
            {selectedPolicy && (
                <PolicyEditor
                    open={!!selectedPolicy}
                    onOpenChange={(open) => !open && setSelectedPolicy(null)}
                    policyType={selectedPolicy.type}
                    policyTitle={selectedPolicy.title}
                    initialContent={selectedPolicy.content}
                    onSave={handleSave}
                />
            )}
        </>
    )
}
