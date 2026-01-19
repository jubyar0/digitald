import ProductForm from '@/components/admin/product-form'

export default function NewProductPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <ProductForm />
                </div>
            </div>
        </div>
    )
}
