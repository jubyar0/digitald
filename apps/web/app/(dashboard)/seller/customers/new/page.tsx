"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Search, X, Pencil } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function NewCustomerPage() {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)

    // State for tags
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller/customers">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold">New customer</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" disabled>Discard</Button>
                    <Button disabled>Save</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Customer Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Customer overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English [Default]</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="ar">Arabic</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">This customer will receive notifications in this language.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <div className="flex gap-2">
                                    <div className="w-[100px]">
                                        <Select defaultValue="dz">
                                            <SelectTrigger>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🇩🇿</span>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dz">🇩🇿 +213</SelectItem>
                                                <SelectItem value="us">🇺🇸 +1</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Input id="phone" className="flex-1" />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="marketing_email" />
                                    <Label htmlFor="marketing_email" className="font-normal">Customer agreed to receive marketing emails.</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="marketing_sms" />
                                    <Label htmlFor="marketing_sms" className="font-normal">Customer agreed to receive SMS marketing text messages.</Label>
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs text-muted-foreground">
                                    You should ask your customers for permission before you subscribe them to your marketing emails or SMS.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Default Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Default address</CardTitle>
                            <p className="text-sm text-muted-foreground">The primary address of this customer</p>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-auto py-3">
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Add address</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Add default address</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Country/region</Label>
                                            <Select defaultValue="dz">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dz">Algeria</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>First name</Label>
                                                <Input />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Last name</Label>
                                                <Input />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company</Label>
                                            <Input />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Address</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input className="pl-9" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Apartment, suite, etc</Label>
                                            <Input />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Postal code</Label>
                                                <Input />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>City</Label>
                                                <Input />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <div className="flex gap-2">
                                                <div className="w-[80px]">
                                                    <Select defaultValue="dz">
                                                        <SelectTrigger>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">🇩🇿</span>
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dz">🇩🇿</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input className="flex-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddressModalOpen(false)}>Cancel</Button>
                                        <Button>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Tax Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tax details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tax settings</Label>
                                <Select defaultValue="collect">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="collect">Collect tax</SelectItem>
                                        <SelectItem value="collect_unless">Collect tax unless exemptions apply</SelectItem>
                                        <SelectItem value="dont_collect">Don't collect tax</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="flex flex-col gap-6">

                    {/* Notes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">Notes</CardTitle>
                            <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add note</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Textarea placeholder="Add a note..." className="min-h-[100px]" />
                                        <div className="text-right text-xs text-muted-foreground mt-1">0/5000</div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
                                        <Button>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Notes are private and won't be shared with the customer.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">Tags</CardTitle>
                            <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add tags</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search to find or create tags"
                                                    className="pl-9"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault()
                                                            handleAddTag()
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <Button variant="outline" onClick={handleAddTag}>Add</Button>
                                        </div>

                                        {tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag, i) => (
                                                    <div key={i} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                                                        {tag}
                                                        <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))}>
                                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-sm text-muted-foreground">
                                                No tags yet
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsTagModalOpen(false)}>Cancel</Button>
                                        <Button>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Input placeholder="" readOnly />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
