import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Palette, Bot, Globe, Shield, Mail, Clock,
    Settings as SettingsIcon, ChevronRight
} from 'lucide-react'

const settingsSections = [
    {
        title: 'Livechat Appearance',
        description: 'Customize widget colors, position, and messages',
        icon: Palette,
        href: '/admin/support/settings/appearance',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
    {
        title: 'AI & Smart Features',
        description: 'Configure AI chatbot, translation, and TTS',
        icon: Bot,
        href: '/admin/support/settings/ai',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        title: 'Social Integrations',
        description: 'Connect WhatsApp, Instagram, and other channels',
        icon: Globe,
        href: '/admin/support/settings/integrations',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        title: 'Security Controls',
        description: 'Country restrictions, DoS protection, domains',
        icon: Shield,
        href: '/admin/support/settings/security',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
    },
    {
        title: 'SMTP Settings',
        description: 'Configure email sending settings',
        icon: Mail,
        href: '/admin/settings/email',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        title: 'Operating Hours',
        description: 'Set when live chat is available',
        icon: Clock,
        href: '/admin/support/settings/appearance',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
    },
]

export default function SupportSettingsPage() {
    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <SettingsIcon className="h-6 w-6 text-gray-500" />
                    Support Settings
                </h1>
                <p className="text-muted-foreground">
                    Configure your support system preferences
                </p>
            </div>

            {/* Settings Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {settingsSections.map((section) => (
                    <Link key={section.href} href={section.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg ${section.bg}`}>
                                        <section.icon className={`h-5 w-5 ${section.color}`} />
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-base mb-1">{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
