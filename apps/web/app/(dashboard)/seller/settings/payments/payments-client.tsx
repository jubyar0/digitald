'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    CreditCard,
    Wallet,
    Building2,
    ExternalLink,
    Settings,
    PlusCircle,
    Shield,
    Clock,
    DollarSign,
    Zap,
    Bitcoin,
    Banknote,
    AlertCircle,
    Info,
    Calendar,
    TrendingUp,
    CheckCircle2,
    ShoppingBag,
    ArrowRight,
    Trash2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Payment Provider Icons (SVG Components)
const VisaIcon = () => (
    <svg viewBox="0 0 48 32" className="h-6 w-auto">
        <rect fill="#1A1F71" width="48" height="32" rx="4" />
        <path fill="#fff" d="M19.5 21.5h-3l1.9-11.5h3l-1.9 11.5zm8.3-11.2c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.7 3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.2 0 5.3-1.5 5.3-3.8 0-1.3-.8-2.2-2.6-3-.1-.1-1.1-.5-1.1-.5-.4-.2-.5-.4-.5-.6 0-.5.5-.8 1.5-.8.9 0 1.5.2 2 .4l.2.1.5-2.5zm8.2-.3h-2.3c-.7 0-1.2.2-1.5.9l-4.3 10h3l.6-1.6h3.7l.3 1.6h2.7l-2.2-10.9zm-3.3 7.1l1.5-4 .9 4h-2.4zm-17.7-7.1l-3 7.8-.3-1.6c-.5-1.7-2.1-3.5-4-4.4l2.6 9.7h3l4.7-11.5h-3z" />
    </svg>
)

const MastercardIcon = () => (
    <svg viewBox="0 0 48 32" className="h-6 w-auto">
        <rect fill="#000" width="48" height="32" rx="4" />
        <circle fill="#EB001B" cx="18" cy="16" r="8" />
        <circle fill="#F79E1B" cx="30" cy="16" r="8" />
        <path fill="#FF5F00" d="M24 10c2.2 1.8 3.6 4.5 3.6 7.5s-1.4 5.7-3.6 7.5c-2.2-1.8-3.6-4.5-3.6-7.5s1.4-5.7 3.6-7.5z" />
    </svg>
)

const AmexIcon = () => (
    <svg viewBox="0 0 48 32" className="h-6 w-auto">
        <rect fill="#006FCF" width="48" height="32" rx="4" />
        <text x="24" y="18" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">AMEX</text>
    </svg>
)

const DiscoverIcon = () => (
    <svg viewBox="0 0 48 32" className="h-6 w-auto">
        <rect fill="#FF6000" width="48" height="32" rx="4" />
        <text x="24" y="18" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">DISCOVER</text>
    </svg>
)

// Installed Payment App Interface
interface InstalledPaymentApp {
    id: string
    appId: string
    name: string
    icon: React.ReactNode
    category: 'cards' | 'wallet' | 'crypto' | 'bnpl' | 'local'
    isConnected: boolean
    fees: string
    accountInfo?: string
}

interface PaymentSettings {
    captureMethod: 'auto' | 'fulfill' | 'manual'
    payoutSchedule: 'daily' | 'weekly' | 'monthly'
    payoutDay: number
    minPayoutAmount: number
    giftCardExpiration: 'never' | 'custom'
    giftCardExpirationDays?: number
}

interface PaymentsClientProps {
    installedApps?: InstalledPaymentApp[]
    balance?: {
        available: number
        pending: number
        currency: string
    }
}

export function PaymentsClient({ installedApps = [], balance }: PaymentsClientProps) {
    const [settings, setSettings] = useState<PaymentSettings>({
        captureMethod: 'auto',
        payoutSchedule: 'weekly',
        payoutDay: 1,
        minPayoutAmount: 50,
        giftCardExpiration: 'never',
        giftCardExpirationDays: 365,
    })

    const [selectedApp, setSelectedApp] = useState<InstalledPaymentApp | null>(null)
    const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false)

    // Mock installed payment apps - in real implementation, these come from the database
    const [paymentApps, setPaymentApps] = useState<InstalledPaymentApp[]>([
        {
            id: 'inst_1',
            appId: 'digo_payments',
            name: 'dIGO Payments',
            icon: <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
            </div>,
            category: 'cards',
            isConnected: true,
            fees: '2.9% + $0.30',
            accountInfo: 'Connected via Stripe'
        },
    ])

    const [manualMethods, setManualMethods] = useState([
        { id: 'cod', name: 'Cash on Delivery', isActive: false },
        { id: 'bank_transfer', name: 'Bank Transfer', isActive: false },
        { id: 'money_order', name: 'Money Order', isActive: false },
    ])

    const getNextPayoutDate = () => {
        const now = new Date()
        const next = new Date()

        if (settings.payoutSchedule === 'daily') {
            next.setDate(next.getDate() + 1)
        } else if (settings.payoutSchedule === 'weekly') {
            next.setDate(next.getDate() + (7 - now.getDay() + settings.payoutDay) % 7 || 7)
        } else {
            next.setMonth(next.getMonth() + 1)
            next.setDate(settings.payoutDay)
        }

        return next.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        })
    }

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'cards': return 'Card Payments'
            case 'wallet': return 'Digital Wallet'
            case 'crypto': return 'Cryptocurrency'
            case 'bnpl': return 'Buy Now, Pay Later'
            case 'local': return 'Local Payment'
            default: return 'Payment'
        }
    }

    const connectedAppsCount = paymentApps.filter(app => app.isConnected).length

    return (
        <div className="p-6 max-w-5xl space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold">Payments</h1>
                        <p className="text-sm text-muted-foreground">
                            {connectedAppsCount} payment {connectedAppsCount === 1 ? 'app' : 'apps'} connected
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/seller/settings/payout-methods">
                            <Building2 className="h-4 w-4 mr-2" />
                            Payout Methods
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Balance Overview */}
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                            <p className="text-3xl font-bold">${balance?.available?.toFixed(2) || '0.00'}</p>
                            <p className="text-xs text-muted-foreground mt-1">Ready for payout</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Pending Balance</p>
                            <p className="text-3xl font-bold text-muted-foreground">${balance?.pending?.toFixed(2) || '0.00'}</p>
                            <p className="text-xs text-muted-foreground mt-1">Processing orders</p>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button className="gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Request Payout
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Installed Payment Apps */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Payment Apps
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Payment methods installed from the App Store
                            </CardDescription>
                        </div>
                        <Button asChild className="gap-2">
                            <Link href="/seller/app-store?category=payments">
                                <ShoppingBag className="h-4 w-4" />
                                Browse Payment Apps
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {paymentApps.length > 0 ? (
                        <>
                            {paymentApps.map((app) => (
                                <div
                                    key={app.id}
                                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${app.isConnected ? 'bg-green-500/5 border-green-500/20' : 'hover:bg-muted/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {app.icon}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{app.name}</h4>
                                                <Badge variant="secondary" className="text-xs">
                                                    {getCategoryLabel(app.category)}
                                                </Badge>
                                                {app.isConnected && (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 text-xs">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Connected
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {app.accountInfo || 'Not connected'}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Fees: {app.fees}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Configure
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Add More Apps CTA */}
                            <Link
                                href="/seller/app-store?category=payments"
                                className="flex items-center justify-center gap-2 p-4 border border-dashed rounded-lg text-muted-foreground hover:text-foreground hover:border-solid hover:bg-muted/50 transition-all"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span>Add more payment apps from the App Store</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed">
                            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No payment apps installed</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Install payment apps from the App Store to accept payments from your customers through various methods.
                            </p>
                            <Button asChild>
                                <Link href="/seller/app-store?category=payments">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Browse Payment Apps
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payout Schedule */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Payout Schedule
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Configure how often you receive payouts from your sales
                            </CardDescription>
                        </div>
                        <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Edit Schedule</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Payout Schedule</DialogTitle>
                                    <DialogDescription>
                                        Choose how often you want to receive payouts
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-3">
                                        <Label>Payout Frequency</Label>
                                        <Select
                                            value={settings.payoutSchedule}
                                            onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                                                setSettings(prev => ({ ...prev, payoutSchedule: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {settings.payoutSchedule === 'weekly' && (
                                        <div className="space-y-3">
                                            <Label>Day of Week</Label>
                                            <Select
                                                value={settings.payoutDay.toString()}
                                                onValueChange={(value) =>
                                                    setSettings(prev => ({ ...prev, payoutDay: parseInt(value) }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Monday</SelectItem>
                                                    <SelectItem value="2">Tuesday</SelectItem>
                                                    <SelectItem value="3">Wednesday</SelectItem>
                                                    <SelectItem value="4">Thursday</SelectItem>
                                                    <SelectItem value="5">Friday</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    {settings.payoutSchedule === 'monthly' && (
                                        <div className="space-y-3">
                                            <Label>Day of Month</Label>
                                            <Select
                                                value={settings.payoutDay.toString()}
                                                onValueChange={(value) =>
                                                    setSettings(prev => ({ ...prev, payoutDay: parseInt(value) }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[1, 5, 10, 15, 20, 25, 28].map(day => (
                                                        <SelectItem key={day} value={day.toString()}>
                                                            {day === 1 ? '1st' : day === 2 ? '2nd' : day === 3 ? '3rd' : `${day}th`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <Label>Minimum Payout Amount</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                className="pl-7"
                                                value={settings.minPayoutAmount}
                                                onChange={(e) =>
                                                    setSettings(prev => ({
                                                        ...prev,
                                                        minPayoutAmount: parseFloat(e.target.value) || 0
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => {
                                        setIsPayoutDialogOpen(false)
                                        toast.success('Payout schedule updated')
                                    }}>
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">Frequency</p>
                            <p className="text-lg font-semibold capitalize">{settings.payoutSchedule}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">Next Payout</p>
                            <p className="text-lg font-semibold">{getNextPayoutDate()}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">Minimum Amount</p>
                            <p className="text-lg font-semibold">${settings.minPayoutAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Capture Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Payment Capture Method
                    </CardTitle>
                    <CardDescription>
                        Payments are authorized when an order is placed. Select when to capture funds.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={settings.captureMethod}
                        onValueChange={(value: 'auto' | 'fulfill' | 'manual') =>
                            setSettings(prev => ({ ...prev, captureMethod: value }))
                        }
                    >
                        <div className="flex items-start space-x-3 space-y-0 mb-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="auto" id="auto" className="mt-1" />
                            <div className="grid gap-1.5">
                                <Label htmlFor="auto" className="font-medium cursor-pointer">
                                    Automatically at checkout
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Capture payment immediately when the customer places an order
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 space-y-0 mb-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="fulfill" id="fulfill" className="mt-1" />
                            <div className="grid gap-1.5">
                                <Label htmlFor="fulfill" className="font-medium cursor-pointer">
                                    When the order is fulfilled
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Authorize at checkout and capture when you ship or deliver products
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 space-y-0 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="manual" id="manual" className="mt-1" />
                            <div className="grid gap-1.5">
                                <Label htmlFor="manual" className="font-medium cursor-pointer">
                                    Manually
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Authorize at checkout and capture manually from the order page
                                </p>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Manual Payment Methods */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Manual Payment Methods
                    </CardTitle>
                    <CardDescription>
                        Accept payments made outside your online store. Orders must be manually approved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {manualMethods.map((method) => (
                        <div
                            key={method.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                                    {method.id === 'cod' && <DollarSign className="h-5 w-5 text-muted-foreground" />}
                                    {method.id === 'bank_transfer' && <Building2 className="h-5 w-5 text-muted-foreground" />}
                                    {method.id === 'money_order' && <Banknote className="h-5 w-5 text-muted-foreground" />}
                                </div>
                                <span className="font-medium">{method.name}</span>
                            </div>
                            <Switch
                                checked={method.isActive}
                                onCheckedChange={() => {
                                    setManualMethods(prev => prev.map(m =>
                                        m.id === method.id ? { ...m, isActive: !m.isActive } : m
                                    ))
                                    toast.success(method.isActive ? `${method.name} disabled` : `${method.name} enabled`)
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 h-12 border-dashed text-muted-foreground hover:text-foreground"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add custom payment method
                    </Button>
                </CardContent>
            </Card>

            {/* Gift Card Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Gift Card Expiration</CardTitle>
                    <CardDescription>
                        Configure if and when gift cards expire
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={settings.giftCardExpiration}
                        onValueChange={(value: 'never' | 'custom') =>
                            setSettings(prev => ({ ...prev, giftCardExpiration: value }))
                        }
                    >
                        <div className="flex items-center space-x-2 mb-3">
                            <RadioGroupItem value="never" id="never" />
                            <Label htmlFor="never" className="cursor-pointer">Gift cards never expire</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="expire" />
                            <Label htmlFor="expire" className="cursor-pointer">Gift cards expire after</Label>
                            {settings.giftCardExpiration === 'custom' && (
                                <div className="flex items-center gap-2 ml-2">
                                    <Input
                                        type="number"
                                        className="w-20"
                                        value={settings.giftCardExpirationDays}
                                        onChange={(e) =>
                                            setSettings(prev => ({
                                                ...prev,
                                                giftCardExpirationDays: parseInt(e.target.value) || 365
                                            }))
                                        }
                                    />
                                    <span className="text-sm text-muted-foreground">days</span>
                                </div>
                            )}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-4">
                <Link
                    href="https://help.digo.com/payments"
                    className="text-sm text-muted-foreground hover:underline inline-flex items-center gap-1"
                    target="_blank"
                >
                    Learn more about payments
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>

            {/* App Configuration Sheet */}
            {selectedApp && (
                <Sheet open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <div className="flex items-center gap-3">
                                {selectedApp.icon}
                                <div>
                                    <SheetTitle>{selectedApp.name}</SheetTitle>
                                    <SheetDescription>
                                        Configure your payment app
                                    </SheetDescription>
                                </div>
                            </div>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            <div className="space-y-3">
                                <Label>Connection Status</Label>
                                <div className="flex items-center gap-2">
                                    {selectedApp.isConnected ? (
                                        <>
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Connected
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {selectedApp.accountInfo}
                                            </span>
                                        </>
                                    ) : (
                                        <Badge variant="outline" className="text-orange-600">
                                            Not Connected
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <Label>Transaction Fees</Label>
                                <p className="text-2xl font-semibold">{selectedApp.fees}</p>
                                <p className="text-sm text-muted-foreground">
                                    Per successful transaction (set by platform)
                                </p>
                            </div>
                            <Separator />

                            {/* Connection Settings based on category */}
                            {selectedApp.category === 'crypto' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Bitcoin className="h-4 w-4 text-orange-500" />
                                        <Label>Your Wallet Addresses</Label>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Bitcoin (BTC)</Label>
                                            <Input placeholder="bc1q... or 1A1zP1..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Ethereum (ETH)</Label>
                                            <Input placeholder="0x..." />
                                        </div>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                            <AlertCircle className="h-3 w-3 inline mr-1" />
                                            Double-check your wallet addresses.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedApp.category === 'wallet' && (
                                <div className="space-y-4">
                                    <Label>Account Email</Label>
                                    <Input type="email" placeholder="your-email@example.com" />
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                        <p className="text-xs text-blue-700 dark:text-blue-400">
                                            <Info className="h-3 w-3 inline mr-1" />
                                            Make sure your account can receive business payments.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedApp.category === 'cards' && (
                                <div className="space-y-4">
                                    <Label>Connect Your Account</Label>
                                    <Button variant="outline" className="w-full gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        Connect with Stripe
                                    </Button>
                                    <div className="flex gap-2 flex-wrap">
                                        <VisaIcon />
                                        <MastercardIcon />
                                        <AmexIcon />
                                        <DiscoverIcon />
                                    </div>
                                </div>
                            )}

                            <Separator />
                            <div className="flex gap-2">
                                <Button className="flex-1" onClick={() => {
                                    toast.success(`${selectedApp.name} settings saved`)
                                    setSelectedApp(null)
                                }}>
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                        setSelectedApp(null)
                                        toast.success(`${selectedApp.name} will be removed`)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    )
}
