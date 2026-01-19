import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trash2, Copy } from "lucide-react"
import Link from "next/link"

export default function SecurityPage() {
    return (
        <div className="p-6 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <Users className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Security</h1>
            </div>

            <div className="space-y-6">
                {/* User activity logs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold">User activity logs</CardTitle>
                            <CardDescription>Monitor and review user activities</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                    </CardHeader>
                </Card>

                {/* Collaborators */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Collaborators</CardTitle>
                        <CardDescription>
                            Give designers, developers, and marketers access to this store. Collaborators don't count toward your staff limit. Learn more about <Link href="#" className="text-blue-600 hover:underline">collaborators</Link>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
                            <span className="font-medium text-sm">My Store</span>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-mono">
                                    <Copy className="h-3 w-3 text-muted-foreground" />
                                    0157
                                </div>
                                <Button variant="outline" size="sm">Generate new code</Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Share this code to allow someone to send you a collaborator request for this store. You'll still need to review and approve this request from <Link href="/seller/settings/users" className="text-blue-600 hover:underline">Users</Link>.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
