import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>
            {/* Stats cards skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            {/* Charts skeleton */}
            <div className="grid gap-4 lg:grid-cols-2">
                <Skeleton className="h-[350px] rounded-xl" />
                <Skeleton className="h-[350px] rounded-xl" />
            </div>
        </div>
    )
}
