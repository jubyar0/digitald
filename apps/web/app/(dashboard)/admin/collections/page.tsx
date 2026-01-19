import { Suspense } from 'react'
import { CollectionsManager } from './collections-manager'
import { Skeleton } from '@/components/dashboard/ui/skeleton'

export const metadata = {
    title: 'Collections Management | Admin',
    description: 'Manage product collections',
}

export default function CollectionsPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Collections</h3>
                            <p className="dashboard-card-description">
                                Manage product collections (Textures, Models, HDRIs, etc.)
                            </p>
                        </div>
                    </div>

                    {/* Collections Manager */}
                    <Suspense fallback={<CollectionsLoadingSkeleton />}>
                        <CollectionsManager />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

function CollectionsLoadingSkeleton() {
    return (
        <div className="dashboard-card p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    )
}
