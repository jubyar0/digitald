import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const dynamic = 'force-dynamic'

export default function NotificationsPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Notification Settings</h3>
                            <p className="dashboard-card-description">Manage your notification preferences</p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                                </div>
                                <Switch id="emailNotifications" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                                </div>
                                <Switch id="orderNotifications" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="productNotifications">Product Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Updates about your products</p>
                                </div>
                                <Switch id="productNotifications" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="marketingNotifications">Marketing Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Promotional emails and updates</p>
                                </div>
                                <Switch id="marketingNotifications" />
                            </div>

                            <div className="flex gap-2">
                                <Button>Save Changes</Button>
                                <Button variant="outline">Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
