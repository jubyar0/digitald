"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, Loader2, X } from "lucide-react"
import Link from "next/link"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface InstallModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
    app: {
        name: string
        icon: string | null
        developerName?: string | null
        permissions?: Array<{
            permission: string
            description: string | null
        }>
    } | null
}

export function InstallModal({ isOpen, onClose, onConfirm, app }: InstallModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [personalDataOpen, setPersonalDataOpen] = useState(false)
    const [storeDataOpen, setStoreDataOpen] = useState(false)

    if (!app) return null

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await onConfirm()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
            <DialogContent className="sm:max-w-[420px] p-0 gap-0 [&>button]:hidden">
                {/* Header */}
                <DialogHeader className="px-6 pt-5 pb-4 flex flex-row items-center justify-between border-b">
                    <DialogTitle className="text-base font-semibold">Install app</DialogTitle>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-full p-1 hover:bg-muted transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </DialogHeader>

                <div className="px-6 py-5 space-y-5">
                    {/* App Info */}
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg border bg-white flex items-center justify-center shrink-0">
                            {app.icon ? (
                                <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain" />
                            ) : (
                                <span className="text-lg font-bold text-primary">{app.name.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{app.name}</p>
                            <p className="text-xs text-muted-foreground">{app.developerName || 'dIGO Platform'}</p>
                        </div>
                    </div>

                    {/* Access Section */}
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">This app needs access to:</p>

                        {/* View personal data */}
                        <Collapsible open={personalDataOpen} onOpenChange={setPersonalDataOpen}>
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                <div className="text-left">
                                    <p className="text-sm font-medium">View personal data</p>
                                    <p className="text-xs text-muted-foreground">Customers, store owner</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${personalDataOpen ? 'rotate-180' : ''}`} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 py-2 text-xs text-muted-foreground border-x border-b rounded-b-lg -mt-1">
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>Name and email address</li>
                                    <li>Phone number</li>
                                    <li>Physical address</li>
                                </ul>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* View store data */}
                        <Collapsible open={storeDataOpen} onOpenChange={setStoreDataOpen}>
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                <div className="text-left">
                                    <p className="text-sm font-medium">View store data</p>
                                    <p className="text-xs text-muted-foreground">Customers, orders</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${storeDataOpen ? 'rotate-180' : ''}`} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 py-2 text-xs text-muted-foreground border-x border-b rounded-b-lg -mt-1">
                                <ul className="space-y-1 list-disc list-inside">
                                    <li>Order history and details</li>
                                    <li>Customer information</li>
                                    <li>Product data</li>
                                </ul>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Privacy policy link */}
                    <p className="text-xs text-muted-foreground">
                        Why does {app.name} need data access? Check their{' '}
                        <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex items-center justify-end gap-2 border-t bg-muted/30">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-black hover:bg-gray-800 text-white text-sm"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Install
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
