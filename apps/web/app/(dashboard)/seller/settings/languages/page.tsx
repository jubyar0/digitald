import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Languages as LanguagesIcon, Plus, Globe, MoreHorizontal, Download, Star } from "lucide-react"
import Link from "next/link"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const dynamic = 'force-dynamic'

export default function LanguagesPage() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <LanguagesIcon className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Languages</h1>
            </div>

            {/* Hero Card */}
            <Card className="bg-muted/30 border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="bg-background p-4 rounded-full shadow-sm mb-2">
                        <LanguagesIcon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div className="space-y-2 max-w-lg">
                        <h2 className="text-lg font-semibold">Speak your customers' language</h2>
                        <p className="text-muted-foreground text-sm">
                            Adding translations to your store improves cross-border conversion by an average of 13%. It's free and takes minutes.
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mt-4 bg-zinc-900 text-white hover:bg-zinc-800">
                                Add a language
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add language</DialogTitle>
                            </DialogHeader>

                            <div className="py-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Language</label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select.." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="it">Italian</SelectItem>
                                            <SelectItem value="pt">Portuguese</SelectItem>
                                            <SelectItem value="ar">Arabic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        This app will be installed so you can translate and customize your content for different markets:
                                    </p>
                                </div>

                                <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/10">
                                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <LanguagesIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-sm">dIGO Translate & Adapt</h4>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <span>4.6</span>
                                                <Star className="h-3 w-3 fill-current text-muted-foreground ml-0.5" />
                                                <span className="ml-1">(1252) • Free</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>Next</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Languages List */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Languages</h3>
                <div className="bg-background border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-xs font-medium text-muted-foreground">
                        <div className="col-span-6">Language</div>
                        <div className="col-span-3">Status</div>
                        <div className="col-span-3">Domains</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">
                        <div className="col-span-6">
                            <div className="font-medium">English</div>
                            <div className="text-sm text-muted-foreground">Default</div>
                        </div>
                        <div className="col-span-3">
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700 border-none font-normal">
                                Published
                            </Badge>
                        </div>
                        <div className="col-span-3 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">1 domain</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Recommendation */}
            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <LanguagesIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium">dIGO Translate & Adapt</h4>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span>4.0</span>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-0.5" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Translate your store and cater to global audiences</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-background">
                    <Download className="h-4 w-4" />
                    Install
                </Button>
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-4">
                <span>Learn more about</span>
                <Link href="#" className="text-blue-600 hover:underline">languages</Link>
                <span>. To change your account language,</span>
                <Link href="#" className="text-blue-600 hover:underline">manage account</Link>
                <span>.</span>
            </div>
        </div>
    )
}
