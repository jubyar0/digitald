import { DigitalProductsTable } from './digital-products-table';

export default function DigitalProductsPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Digital Products</h3>
                            <p className="dashboard-card-description">
                                Manage your digital product catalog
                            </p>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="dashboard-card p-6">
                        <DigitalProductsTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
