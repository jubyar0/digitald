import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ChevronRight, Plus } from "lucide-react"
import { getSellerPolicies, generatePolicyTemplate } from "@/actions/seller-policies"
import { PoliciesClient } from "./policies-client"

export default async function PoliciesPage() {
    const policiesData = await getSellerPolicies()
    const policies = policiesData.data || {
        refundPolicy: '',
        privacyPolicy: '',
        termsOfService: '',
        shippingPolicy: '',
        contactInformation: ''
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Policies</h1>
            </div>

            <PoliciesClient initialPolicies={policies} />
        </div>
    )
}
