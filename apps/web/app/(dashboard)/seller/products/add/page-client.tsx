'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import { ShopifyProductForm } from './_components/shopify-product-form';
import { toast } from 'sonner';

interface AddProductClientProps {
    vendors: any[];
    categories: any[];
    aiEnabled: boolean;
}

export function AddProductClient({ vendors, categories, aiEnabled }: AddProductClientProps) {
    const router = useRouter();

    const handleSuccess = () => {
        // toast.success('Product created successfully'); // Handled in component
        router.push('/seller/products');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="flex flex-1 flex-col container mx-auto max-w-5xl py-8">
            <ShopifyProductForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                vendors={vendors}
                categories={categories}
                aiEnabled={aiEnabled}
            />
        </div>
    );
}
