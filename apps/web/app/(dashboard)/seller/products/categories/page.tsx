import { CategoriesTable } from './categories-table';

export default function CategoriesPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Product Categories</h3>
                            <p className="dashboard-card-description">
                                Organize your products into categories
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="dashboard-card p-6">
                        <CategoriesTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
