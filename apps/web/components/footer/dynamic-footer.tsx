import NextImage from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Phone, MapPin } from 'lucide-react'

interface DynamicFooterProps {
    settings?: any;
}

export function DynamicFooter({ settings }: DynamicFooterProps) {
    if (!settings) {
        return null
    }

    const currentYear = new Date().getFullYear()
    const siteName = settings.siteName || 'Digital Marketplace'
    const copyrightText = settings.copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`

    const socialLinks = [
        { url: settings.facebookUrl, icon: Facebook, label: 'Facebook' },
        { url: settings.twitterUrl, icon: Twitter, label: 'Twitter' },
        { url: settings.instagramUrl, icon: Instagram, label: 'Instagram' },
        { url: settings.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
        { url: settings.youtubeUrl, icon: Youtube, label: 'YouTube' },
        { url: settings.githubUrl, icon: Github, label: 'GitHub' },
    ].filter(link => link.url)

    const contactInfo = [
        { value: settings.contactEmail, icon: Mail, label: 'Email' },
        { value: settings.contactPhone, icon: Phone, label: 'Phone' },
        { value: settings.contactAddress, icon: MapPin, label: 'Address' },
    ].filter(info => info.value)

    return (
        <footer className="bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        {settings.logoUrl && (
                            <NextImage
                                src={settings.logoUrl}
                                alt={siteName}
                                width={parseInt(settings.logoWidth) || 150}
                                height={parseInt(settings.logoHeight) || 40}
                                style={{
                                    width: settings.logoWidth || '150px',
                                    height: settings.logoHeight || '40px',
                                }}
                                className="object-contain"
                                unoptimized
                                priority
                            />
                        )}
                        {!settings.logoUrl && (
                            <h3 className="text-lg font-semibold">{siteName}</h3>
                        )}
                        {settings.siteTagline && (
                            <p className="text-sm text-muted-foreground">{settings.siteTagline}</p>
                        )}
                        {settings.siteDescription && (
                            <p className="text-sm text-muted-foreground">{settings.siteDescription}</p>
                        )}
                    </div>

                    {/* Contact Information */}
                    {settings.showContactInfo && contactInfo.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Contact Us</h4>
                            <div className="space-y-3">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{info.value}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Social Links */}
                    {settings.showSocialLinks && socialLinks.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Follow Us</h4>
                            <div className="flex gap-3">
                                {socialLinks.map((link, index) => {
                                    const Icon = link.icon
                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-accent transition-colors"
                                            aria-label={link.label}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                            {copyrightText}
                        </p>
                        {settings.footerText && (
                            <p className="text-sm text-muted-foreground text-center md:text-right">
                                {settings.footerText}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}
