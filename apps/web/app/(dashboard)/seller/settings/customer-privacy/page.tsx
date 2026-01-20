import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, ChevronRight, Cookie, Eye } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function CustomerPrivacyPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Shield className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Customer privacy</h1>
            </div>

            <div className="space-y-6">
                {/* Cookie Consent */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Cookie consent banner</CardTitle>
                        <CardDescription>Show a banner to inform customers about cookies</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Cookie className="h-5 w-5 text-muted-foreground" />
                                <span>Show cookie consent banner</span>
                            </div>
                            <Switch id="cookieBanner" />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Collection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data collection</CardTitle>
                        <CardDescription>Manage what data you collect from customers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-muted-foreground" />
                                <span>Customer data request settings</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Policy */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Privacy compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Ensure your store complies with privacy regulations like GDPR and CCPA. Review and update your privacy policy to reflect your data practices.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
