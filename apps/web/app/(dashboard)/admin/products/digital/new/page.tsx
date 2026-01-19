import DigitalProductForm from '@/components/admin/digital-product-form'
import { getAllCategories, getProducts } from '@/actions/admin'

export default async function NewDigitalProductPage() {
    const [categories, productsData] = await Promise.all([
        getAllCategories(),
        getProducts(1, 100, '', '', '')
    ])

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <DigitalProductForm
                        initialCategories={categories || []}
                        initialProducts={productsData?.data || []}
                    />
                </div>
            </div>
        </div>
    )
}
