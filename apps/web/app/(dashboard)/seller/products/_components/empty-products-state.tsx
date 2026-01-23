'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import Link from 'next/link';

interface EmptyProductsStateProps {
    type: 'draft' | 'archived' | 'active' | 'all' | 'pending';
}

export function EmptyProductsState({ type }: EmptyProductsStateProps) {
    const config = {
        draft: {
            icon: Search,
            title: 'No draft products',
            description: 'Set products as draft if they still need work.',
            actionLabel: 'Add draft product',
            actionHref: '/seller/products/add?status=draft',
        },
        archived: {
            icon: Search,
            title: 'No archived products',
            description: 'Archive products you no longer sell without deleting information.',
            actionLabel: null,
            actionHref: null,
        },
        active: {
            icon: Search,
            title: 'No active products',
            description: 'Publish your products to make them visible to customers.',
            actionLabel: 'Add product',
            actionHref: '/seller/products/add',
        },
        pending: {
            icon: Search,
            title: 'No pending products',
            description: 'Products waiting for approval will appear here.',
            actionLabel: null,
            actionHref: null,
        },
        all: {
            icon: Search,
            title: 'No products yet',
            description: 'Add products to your store to start selling.',
            actionLabel: 'Add product',
            actionHref: '/seller/products/add',
        },
    };

    const { icon: Icon, title, description, actionLabel, actionHref } = config[type];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg border">
            <div className="w-32 h-32 mb-4">
                <img
                    src="/media/illustrations/21.svg"
                    alt={title}
                    className="w-full h-full object-contain dark:opacity-80"
                />
            </div>
            <h3 className="text-base font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button variant="default" size="sm">
                        {actionLabel}
                    </Button>
                </Link>
            )}
            <a
                href="#"
                className="text-sm text-primary hover:underline mt-4"
            >
                Learn more about products
            </a>
        </div>
    );
}
