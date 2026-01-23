import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header skeleton */}
                    <div className="dashboard-card p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>

                    {/* Table skeleton */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Table header */}
                                <div className="flex gap-4 border-b pb-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24 ml-auto" />
                                </div>
                                {/* Table rows */}
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-center py-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-24 ml-auto" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
