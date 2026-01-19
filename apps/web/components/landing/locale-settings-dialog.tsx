"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LocaleSettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LocaleSettingsDialog({ open, onOpenChange }: LocaleSettingsDialogProps) {
    const [region, setRegion] = useState("United States")
    const [language, setLanguage] = useState("English (US)")
    const [currency, setCurrency] = useState("$ (USD)")

    const handleSave = () => {
        // TODO: Save settings to localStorage or backend
        console.log("Saving settings:", { region, language, currency })
        onOpenChange(false)
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 gap-0">
                <DialogHeader className="px-8 pt-8 pb-6">
                    <DialogTitle className="text-3xl font-normal">
                        Update your settings
                    </DialogTitle>
                </DialogHeader>

                <div className="px-8 pb-8 space-y-6">
                    <p className="text-base text-muted-foreground">
                        Set where you live, what language you speak, and the currency you use.{" "}
                        <a href="#" className="text-foreground font-medium hover:underline">
                            Learn more.
                        </a>
                    </p>

                    {/* Region */}
                    <div className="space-y-2">
                        <label htmlFor="region" className="text-sm font-semibold block">
                            Region
                        </label>
                        <div className="relative">
                            <select
                                id="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full h-12 px-4 pr-10 rounded-lg border border-input bg-background text-base appearance-none cursor-pointer hover:border-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-colors"
                            >
                                <option value="United States">United States</option>
                                <option value="France">France</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Germany">Germany</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Japan">Japan</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <label htmlFor="language" className="text-sm font-semibold block">
                            Language
                        </label>
                        <div className="relative">
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full h-12 px-4 pr-10 rounded-lg border border-input bg-background text-base appearance-none cursor-pointer hover:border-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-colors"
                            >
                                <option value="English (US)">English (US)</option>
                                <option value="English (UK)">English (UK)</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Arabic">العربية</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <label htmlFor="currency" className="text-sm font-semibold block">
                            Currency
                        </label>
                        <div className="relative">
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full h-12 px-4 pr-10 rounded-lg border border-input bg-background text-base appearance-none cursor-pointer hover:border-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-colors"
                            >
                                <option value="$ (USD)">$ (USD)</option>
                                <option value="€ (EUR)">€ Euro (EUR)</option>
                                <option value="£ (GBP)">£ (GBP)</option>
                                <option value="¥ (JPY)">¥ (JPY)</option>
                                <option value="C$ (CAD)">C$ (CAD)</option>
                                <option value="A$ (AUD)">A$ (AUD)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="h-12 px-8 rounded-full text-base font-medium hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="h-12 px-8 rounded-full text-base font-medium bg-foreground text-background hover:bg-foreground/90"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
