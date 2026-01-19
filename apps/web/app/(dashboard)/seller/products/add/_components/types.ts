'use client';

import { LucideIcon, Store, CreditCard } from 'lucide-react';

// ============================================================================
// Form Props
// ============================================================================

export interface ShopifyProductFormProps {
    onSuccess: () => void;
    onCancel?: () => void;
    initialData?: any;
    isEditMode?: boolean;
    vendors?: any[];
    categories?: any[];
    aiEnabled?: boolean;
}

// ============================================================================
// Core Product Types
// ============================================================================

export interface ImageFile {
    id: string;
    url: string;
    file?: File;
    isMain?: boolean;
}

export interface Category {
    id: string;
    name: string;
}

export interface Vendor {
    id: string;
    name: string;
}

export interface ProductOption {
    id: string;
    name: string;
    values: string[];
}

export interface ProductVariant {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    sku?: string;
    barcode?: string;
    quantity: number;
    image?: string;
    options: Record<string, string>;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    compareAtPrice: number;
    costPerItem: number;
    categoryId: string;
    status: string;
    type: string;
    vendor: string;
    collections: string;
    tags: string;
    sku: string;
    barcode: string;
    trackQuantity: boolean;
    quantity: number;
    sellOverstock: boolean;
    isPhysical: boolean;
    weight: number;
    weightUnit: string;
    countryOfOrigin: string;
    hsCode: string;
    hasVariants: boolean;
    fileUrl: string;
    chargeTax: boolean;
    continueSellingOutOfStock?: boolean;
    requiresShipping?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    urlHandle?: string;
}

// ============================================================================
// Publishing Types
// ============================================================================

export interface SalesChannel {
    id: string;
    name: string;
    type?: 'web' | 'pos' | 'social' | 'marketplace';
    icon?: LucideIcon;
    isActive: boolean;
}

export interface UnitPriceData {
    totalAmount: number;
    totalUnit: string;
    baseMeasure: number;
    baseUnit: string;
}

export interface Collection {
    id: string;
    name: string;
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_FORM_DATA: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    costPerItem: 0,
    categoryId: '',
    status: 'ACTIVE',
    type: '',
    vendor: '',
    collections: '',
    tags: '',
    sku: '',
    barcode: '',
    trackQuantity: true,
    quantity: 0,
    sellOverstock: false,
    isPhysical: true,
    weight: 0,
    weightUnit: 'kg',
    countryOfOrigin: '',
    hsCode: '',
    hasVariants: false,
    fileUrl: '',
    chargeTax: true
};

export const DEFAULT_SALES_CHANNELS: SalesChannel[] = [
    { id: 'online-store', name: 'Online Store', icon: Store, type: 'web', isActive: true },
    { id: 'pos', name: 'Point of Sale', icon: CreditCard, type: 'pos', isActive: true }
];

export const DEFAULT_UNIT_PRICE_DATA: UnitPriceData = {
    totalAmount: 0,
    totalUnit: 'g',
    baseMeasure: 1,
    baseUnit: 'kg'
};

export const DEFAULT_COLLECTIONS: Collection[] = [
    { id: 'homepage', name: "Page d'accueil" },
    { id: 'featured', name: 'Featured' },
    { id: 'new-arrivals', name: 'New Arrivals' },
    { id: 'sale', name: 'Sale' }
];

export const DEFAULT_TAGS = [
    'TUX', 'Black', 'Mob', 'Navy', 'Ball Gown', 'Nike', 'FBS-C004', 'Male', 'Prom', 'A-Line'
];
