import { getInventoryStats } from '@/actions/vendor-products';
import { InventoryClient } from './inventory-client';

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
    const stats = await getInventoryStats();

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Product Inventory</h3>
                            <p className="dashboard-card-description">
                                Manage your product listings, track stock, and monitor performance
                            </p>
                        </div>
                    </div>

                    <InventoryClient initialStats={stats} />
                </div>
            </div>
        </div>
    );
}
