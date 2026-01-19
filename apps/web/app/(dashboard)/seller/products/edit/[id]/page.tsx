'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProductFormContent } from '@/components/product-form-content';
import { getMyProduct } from '@/actions/vendor-products';
import { toast } from 'sonner';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const foundProduct = await getMyProduct(productId);

                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    toast.error('Product not found');
                    router.push('/seller/products');
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Failed to load product');
                router.push('/seller/products');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, router]);

    const handleSuccess = () => {
        toast.success('Product updated successfully!');
        router.push('/seller/products');
    };

    const handleCancel = () => {
        router.push('/seller/products');
    };

    if (loading) {
        return (
            <div className="flex flex-1 flex-col container mx-auto">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-8 dashboard-padding">
                        <div className="dashboard-card p-6">
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Edit Product</h3>
                            <p className="dashboard-card-description">
                                Update your product information
                            </p>
                        </div>
                    </div>

                    {/* Product Form */}
                    <div className="dashboard-card p-6">
                        <ProductFormContent
                            initialData={product}
                            isEditMode={true}
                            onSuccess={handleSuccess}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
