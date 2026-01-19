"use client"

import Link from "next/link"
import { useState } from "react"
import {
    Twitter,
    Linkedin,
    Github,
    Instagram,
    Youtube,
    Facebook,
    ArrowRight,
    Globe,
    Check
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { Spotlight } from "@/components/ui/spotlight-new"
import { useBranding } from "@/providers/dynamic-theme-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function FooterSection() {
    const currentYear = new Date().getFullYear()
    const { branding } = useBranding()
    const [selectedRegion, setSelectedRegion] = useState("United States")
    const [selectedLanguage, setSelectedLanguage] = useState("English (US)")
    const [selectedCurrency, setSelectedCurrency] = useState("$ (USD)")
    const [isOpen, setIsOpen] = useState(false)

    // Build social links dynamically from branding settings
    const socialLinks = [
        branding.twitterUrl && { icon: Twitter, href: branding.twitterUrl, label: "Twitter" },
        branding.githubUrl && { icon: Github, href: branding.githubUrl, label: "GitHub" },
        branding.linkedinUrl && { icon: Linkedin, href: branding.linkedinUrl, label: "LinkedIn" },
        branding.instagramUrl && { icon: Instagram, href: branding.instagramUrl, label: "Instagram" },
        branding.youtubeUrl && { icon: Youtube, href: branding.youtubeUrl, label: "YouTube" },
        branding.facebookUrl && { icon: Facebook, href: branding.facebookUrl, label: "Facebook" },
    ].filter(Boolean) as { icon: any; href: string; label: string }[]

    const regions = [
        { name: "United States", code: "US" },
        { name: "United Kingdom", code: "GB" },
        { name: "Canada", code: "CA" },
        { name: "Australia", code: "AU" },
        { name: "Germany", code: "DE" },
        { name: "France", code: "FR" },
        { name: "Spain", code: "ES" },
        { name: "Italy", code: "IT" },
        { name: "Japan", code: "JP" },
    ]

    const languages = [
        { name: "English (US)", code: "en-US" },
        { name: "English (UK)", code: "en-GB" },
        { name: "Español", code: "es" },
        { name: "Français", code: "fr" },
        { name: "Deutsch", code: "de" },
        { name: "Italiano", code: "it" },
        { name: "日本語", code: "ja" },
    ]

    const currencies = [
        { name: "$ (USD)", code: "USD" },
        { name: "£ (GBP)", code: "GBP" },
        { name: "€ (EUR)", code: "EUR" },
        { name: "C$ (CAD)", code: "CAD" },
        { name: "A$ (AUD)", code: "AUD" },
        { name: "¥ (JPY)", code: "JPY" },
    ]


    return (
        <footer className="bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden border-t border-neutral-800">
            <Spotlight />

            {/* Main Footer Links */}
            <div className="bg-neutral-900/50 text-white py-16 relative z-10">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-left max-w-7xl mx-auto">
                    <div>
                        <h4 className="font-bold mb-4 text-white">Shop</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="/products?category=gift-cards" className="hover:underline hover:text-white">Gift cards</Link></li>
                            <li><Link href="/sitemap" className="hover:underline hover:text-white">Sitemap</Link></li>
                            <li><Link href="/blog" className="hover:underline hover:text-white">Etsy blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Sell</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="/sell" className="hover:underline hover:text-white">Sell on Etsy</Link></li>
                            <li><Link href="/teams" className="hover:underline hover:text-white">Teams</Link></li>
                            <li><Link href="/forums" className="hover:underline hover:text-white">Forums</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">About</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="/about" className="hover:underline hover:text-white">Etsy, Inc.</Link></li>
                            <li><Link href="/policies" className="hover:underline hover:text-white">Policies</Link></li>
                            <li><Link href="/investors" className="hover:underline hover:text-white">Investors</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Help</h4>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="/help" className="hover:underline hover:text-white">Help Center</Link></li>
                            <li><Link href="/trust" className="hover:underline hover:text-white">Trust and safety</Link></li>
                            <li><Link href="/privacy" className="hover:underline hover:text-white">Privacy settings</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-neutral-950 border-t border-neutral-800 py-6 text-white relative z-10">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <RainbowButton variant="outline" className="rounded-full flex items-center gap-2 px-4 py-2 cursor-pointer">
                                <Globe className="w-4 h-4" />
                                {selectedRegion} | {selectedLanguage} | {selectedCurrency}
                            </RainbowButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl bg-neutral-900 border-neutral-700 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-white">Update your preferences</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                {/* Region Selection */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3 text-lg">Region</h4>
                                    <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                                        {regions.map((region) => (
                                            <button
                                                key={region.code}
                                                onClick={() => setSelectedRegion(region.name)}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${selectedRegion === region.name
                                                    ? "bg-white text-black font-medium"
                                                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                                    }`}
                                            >
                                                {region.name}
                                                {selectedRegion === region.name && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language Selection */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3 text-lg">Language</h4>
                                    <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                onClick={() => setSelectedLanguage(language.name)}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${selectedLanguage === language.name
                                                    ? "bg-white text-black font-medium"
                                                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                                    }`}
                                            >
                                                {language.name}
                                                {selectedLanguage === language.name && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Currency Selection */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3 text-lg">Currency</h4>
                                    <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
                                        {currencies.map((currency) => (
                                            <button
                                                key={currency.code}
                                                onClick={() => setSelectedCurrency(currency.name)}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${selectedCurrency === currency.name
                                                    ? "bg-white text-black font-medium"
                                                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                                    }`}
                                            >
                                                {currency.name}
                                                {selectedCurrency === currency.name && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Update Button */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2.5 border border-neutral-700 rounded-full text-white hover:bg-neutral-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 transition-colors rounded-full font-medium"
                                >
                                    Update Preferences
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <div className="text-sm text-neutral-500 flex flex-wrap justify-center gap-4">
                        <span>{branding.copyrightText || `© ${currentYear} ${branding.siteName}`}</span>
                        <Link href="/terms" className="hover:underline hover:text-white">Terms of Use</Link>
                        <Link href="/privacy" className="hover:underline hover:text-white">Privacy</Link>
                        <Link href="/cookies" className="hover:underline hover:text-white">Interest-based ads</Link>
                    </div>
                    <div className="flex gap-4">
                        {socialLinks.map((social) => {
                            const Icon = social.icon
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-500 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </footer>
    )
}
