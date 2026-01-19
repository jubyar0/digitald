'use client'

import {
    Shirt,
    Sparkles,
    Laptop,
    Car,
    GraduationCap,
    TrophyIcon,
    Heart,
    Activity,
    Home,
    Wrench,
    Zap,
    Coffee,
    Church,
    Package,
    LucideIcon
} from 'lucide-react'

export interface CategoryIcon {
    name: string
    icon: LucideIcon
    label: string
}

export const CATEGORY_ICONS: CategoryIcon[] = [
    { name: 'shirt', icon: Shirt, label: 'Women Clothing & Fashion' },
    { name: 'sparkles', icon: Sparkles, label: 'Men Clothing & Fashion' },
    { name: 'laptop', icon: Laptop, label: 'Computers & Accessories' },
    { name: 'car', icon: Car, label: 'Automotive & Motorcycle' },
    { name: 'graduation-cap', icon: GraduationCap, label: 'MBA & Toy' },
    { name: 'trophy', icon: TrophyIcon, label: 'Sports & Outdoor' },
    { name: 'heart', icon: Heart, label: 'Youths & Jewelry' },
    { name: 'activity', icon: Activity, label: 'Beauty, Health & Hair' },
    { name: 'home', icon: Home, label: 'Home Improvement & Tools' },
    { name: 'wrench', icon: Wrench, label: 'Home Improvement & Tools' },
    { name: 'zap', icon: Zap, label: 'Power Equipment & Tools' },
    { name: 'coffee', icon: Coffee, label: 'Tea' },
    { name: 'church', icon: Church, label: 'Wedding & Events' },
    { name: 'package', icon: Package, label: 'Other' }
]

export function getCategoryIcon(iconName: string | null | undefined): LucideIcon {
    if (!iconName) return Package
    const icon = CATEGORY_ICONS.find(i => i.name === iconName)
    return icon?.icon || Package
}
