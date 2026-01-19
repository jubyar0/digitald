'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getThemeSettings } from '@/actions/admin'

// Branding types
interface BrandingSettings {
    siteName: string
    siteTagline: string
    siteDescription: string
    copyrightText: string
    logoUrl: string
    faviconUrl: string
    logoLightUrl: string
    logoDarkUrl: string
    logoWidth: string
    logoHeight: string
    // SEO
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    ogImage: string
    // Social Links
    facebookUrl: string
    twitterUrl: string
    instagramUrl: string
    linkedinUrl: string
    youtubeUrl: string
    githubUrl: string
    // Contact
    contactEmail: string
    supportEmail: string
    contactPhone: string
    contactAddress: string
    // Footer
    footerText: string
    showSocialLinks: boolean
    showContactInfo: boolean
}

interface BrandingContextType {
    branding: BrandingSettings
    isLoading: boolean
}

const defaultBranding: BrandingSettings = {
    siteName: 'Digital Marketplace',
    siteTagline: '',
    siteDescription: '',
    copyrightText: '© 2024 Digital Marketplace. All rights reserved.',
    logoUrl: '',
    faviconUrl: '',
    logoLightUrl: '',
    logoDarkUrl: '',
    logoWidth: '150px',
    logoHeight: '40px',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    githubUrl: '',
    contactEmail: '',
    supportEmail: '',
    contactPhone: '',
    contactAddress: '',
    footerText: '',
    showSocialLinks: true,
    showContactInfo: true,
}

const BrandingContext = createContext<BrandingContextType>({
    branding: defaultBranding,
    isLoading: true,
})

export const useBranding = () => useContext(BrandingContext)

// Helper function to convert hex color to HSL values for CSS variables
function hexToHSL(hex: string): string {
    // Validate hex format
    if (!hex || !hex.match(/^#?[0-9A-Fa-f]{6}$/)) {
        return ''
    }

    // Remove # if present
    hex = hex.replace(/^#/, '')

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6
                break
            case g:
                h = ((b - r) / d + 2) / 6
                break
            case b:
                h = ((r - g) / d + 4) / 6
                break
        }
    }

    // Return HSL values without hsl() wrapper (for CSS variable format)
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const [branding, setBranding] = useState<BrandingSettings>(defaultBranding)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setMounted(true)

        const applyThemeSettings = async () => {
            try {
                const result = await getThemeSettings()
                const theme = result.data

                if (!theme) {
                    setIsLoading(false)
                    return
                }

                const root = document.documentElement

                // Apply Typography Settings
                if (theme.fontFamily) {
                    root.style.setProperty('--font-sans', theme.fontFamily)
                    root.style.fontFamily = theme.fontFamily + ', system-ui, sans-serif'
                }
                if (theme.fontSize) {
                    root.style.fontSize = theme.fontSize
                }

                // Apply Layout Settings
                if (theme.borderRadius) {
                    root.style.setProperty('--radius', theme.borderRadius)
                }
                if (theme.sidebarWidth) {
                    root.style.setProperty('--sidebar-default-width', theme.sidebarWidth)
                }
                if (theme.headerHeight) {
                    root.style.setProperty('--header-height', theme.headerHeight)
                }

                // Apply Light Mode Colors
                if (theme.primaryColor) {
                    const hsl = hexToHSL(theme.primaryColor)
                    if (hsl) root.style.setProperty('--primary', hsl)
                }
                if (theme.secondaryColor) {
                    const hsl = hexToHSL(theme.secondaryColor)
                    if (hsl) root.style.setProperty('--secondary', hsl)
                }
                if (theme.accentColor) {
                    const hsl = hexToHSL(theme.accentColor)
                    if (hsl) root.style.setProperty('--accent', hsl)
                }
                if (theme.backgroundColor) {
                    const hsl = hexToHSL(theme.backgroundColor)
                    if (hsl) root.style.setProperty('--background', hsl)
                }
                if (theme.foregroundColor) {
                    const hsl = hexToHSL(theme.foregroundColor)
                    if (hsl) root.style.setProperty('--foreground', hsl)
                }
                if (theme.cardColor) {
                    const hsl = hexToHSL(theme.cardColor)
                    if (hsl) root.style.setProperty('--card', hsl)
                }
                if (theme.borderColor) {
                    const hsl = hexToHSL(theme.borderColor)
                    if (hsl) root.style.setProperty('--border', hsl)
                }
                if (theme.inputColor) {
                    const hsl = hexToHSL(theme.inputColor)
                    if (hsl) root.style.setProperty('--input', hsl)
                }
                if (theme.mutedColor) {
                    const hsl = hexToHSL(theme.mutedColor)
                    if (hsl) root.style.setProperty('--muted', hsl)
                }
                if (theme.destructiveColor) {
                    const hsl = hexToHSL(theme.destructiveColor)
                    if (hsl) root.style.setProperty('--destructive', hsl)
                }

                // Store dark mode colors for .dark class
                const darkStyles = document.createElement('style')
                darkStyles.id = 'dynamic-theme-dark'

                // Remove existing dark theme style if present
                const existing = document.getElementById('dynamic-theme-dark')
                if (existing) existing.remove()

                let darkCss = '.dark {'
                if (theme.darkPrimaryColor) {
                    const hsl = hexToHSL(theme.darkPrimaryColor)
                    if (hsl) darkCss += `--primary: ${hsl};`
                }
                if (theme.darkSecondaryColor) {
                    const hsl = hexToHSL(theme.darkSecondaryColor)
                    if (hsl) darkCss += `--secondary: ${hsl};`
                }
                if (theme.darkAccentColor) {
                    const hsl = hexToHSL(theme.darkAccentColor)
                    if (hsl) darkCss += `--accent: ${hsl};`
                }
                if (theme.darkBackgroundColor) {
                    const hsl = hexToHSL(theme.darkBackgroundColor)
                    if (hsl) darkCss += `--background: ${hsl};`
                }
                if (theme.darkForegroundColor) {
                    const hsl = hexToHSL(theme.darkForegroundColor)
                    if (hsl) darkCss += `--foreground: ${hsl};`
                }
                if (theme.darkCardColor) {
                    const hsl = hexToHSL(theme.darkCardColor)
                    if (hsl) darkCss += `--card: ${hsl};`
                }
                if (theme.darkBorderColor) {
                    const hsl = hexToHSL(theme.darkBorderColor)
                    if (hsl) darkCss += `--border: ${hsl};`
                }
                if (theme.darkInputColor) {
                    const hsl = hexToHSL(theme.darkInputColor)
                    if (hsl) darkCss += `--input: ${hsl};`
                }
                if (theme.darkMutedColor) {
                    const hsl = hexToHSL(theme.darkMutedColor)
                    if (hsl) darkCss += `--muted: ${hsl};`
                }
                if (theme.darkDestructiveColor) {
                    const hsl = hexToHSL(theme.darkDestructiveColor)
                    if (hsl) darkCss += `--destructive: ${hsl};`
                }
                darkCss += '}'

                darkStyles.textContent = darkCss
                document.head.appendChild(darkStyles)

                // Set branding data for context
                setBranding({
                    siteName: theme.siteName || defaultBranding.siteName,
                    siteTagline: theme.siteTagline || '',
                    siteDescription: theme.siteDescription || '',
                    copyrightText: theme.copyrightText || defaultBranding.copyrightText,
                    logoUrl: theme.logoUrl || '',
                    faviconUrl: theme.faviconUrl || '',
                    logoLightUrl: theme.logoLightUrl || '',
                    logoDarkUrl: theme.logoDarkUrl || '',
                    logoWidth: theme.logoWidth || defaultBranding.logoWidth,
                    logoHeight: theme.logoHeight || defaultBranding.logoHeight,
                    metaTitle: theme.metaTitle || '',
                    metaDescription: theme.metaDescription || '',
                    metaKeywords: theme.metaKeywords || '',
                    ogImage: theme.ogImage || '',
                    facebookUrl: theme.facebookUrl || '',
                    twitterUrl: theme.twitterUrl || '',
                    instagramUrl: theme.instagramUrl || '',
                    linkedinUrl: theme.linkedinUrl || '',
                    youtubeUrl: theme.youtubeUrl || '',
                    githubUrl: theme.githubUrl || '',
                    contactEmail: theme.contactEmail || '',
                    supportEmail: theme.supportEmail || '',
                    contactPhone: theme.contactPhone || '',
                    contactAddress: theme.contactAddress || '',
                    footerText: theme.footerText || '',
                    showSocialLinks: theme.showSocialLinks ?? true,
                    showContactInfo: theme.showContactInfo ?? true,
                })

                // Update document title if site name is set
                if (theme.siteName) {
                    document.title = theme.siteName
                }

                // Update favicon if set
                if (theme.faviconUrl) {
                    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
                    if (!favicon) {
                        favicon = document.createElement('link')
                        favicon.rel = 'icon'
                        document.head.appendChild(favicon)
                    }
                    favicon.href = theme.faviconUrl
                }

                setIsLoading(false)

            } catch (error) {
                console.error('Error applying theme settings:', error)
                setIsLoading(false)
            }
        }

        applyThemeSettings()
    }, [])

    // Prevent flash of unstyled content
    if (!mounted) {
        return <>{children}</>
    }

    return (
        <BrandingContext.Provider value={{ branding, isLoading }}>
            {children}
        </BrandingContext.Provider>
    )
}
