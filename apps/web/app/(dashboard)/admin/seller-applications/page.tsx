import { Suspense } from 'react'
import { getVendorApplications } from '@/actions/admin-vendor-applications'
import ApplicationsList from './_components/applications-list'
import ApplicationsFilters from './_components/applications-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
    title: 'Seller Applications | Admin',
    description: 'Manage seller applications',
}

interface PageProps {
    searchParams: {
        status?: string
        personaStatus?: string
        search?: string
        page?: string
        sortBy?: string
        sortOrder?: string
    }
}

async function ApplicationsData({ searchParams }: PageProps) {
    const page = parseInt(searchParams.page || '1')
    const status = searchParams.status?.split(',') as any

    const result = await getVendorApplications(
        {
            status,
            personaStatus: searchParams.personaStatus as any,
            searchQuery: searchParams.search,
        },
        {
            page,
            limit: 20,
            sortBy: (searchParams.sortBy as any) || 'createdAt',
            sortOrder: (searchParams.sortOrder as any) || 'desc',
        }
    )

    if (!result.success) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">{result.error}</p>
            </div>
        )
    }

    return (
        <ApplicationsList
            applications={result.data!.applications.map(app => ({
                ...app,
                submittedAt: app.submittedAt || undefined
            }))}
            pagination={result.data!.pagination}
        />
    )
}

export default function SellerApplicationsPage({ searchParams }: PageProps) {
    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Seller Applications</h1>
                        <p className="text-muted-foreground mt-1">
                            Review and manage vendor applications
                        </p>
                    </div>
                </div>

                <ApplicationsFilters />

                <Suspense
                    fallback={
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full" />
                                ))}
                            </CardContent>
                        </Card>
                    }
                >
                    <ApplicationsData searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    )
}
