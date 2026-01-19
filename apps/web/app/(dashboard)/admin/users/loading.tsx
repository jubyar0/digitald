import { Skeleton } from "@/components/ui/skeleton"

export default function UsersLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
            {/* Filters skeleton */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 flex-1 max-w-sm" />
            </div>
            {/* Table skeleton */}
            <div className="rounded-lg border">
                <div className="border-b p-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-0">
                        <div className="flex gap-4 items-center">
                            <Skeleton className="h-5 w-10" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
