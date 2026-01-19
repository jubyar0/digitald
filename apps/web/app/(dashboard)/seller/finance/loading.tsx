import { Skeleton } from "@/components/ui/skeleton"

export default function FinanceLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header skeleton */}
            <Skeleton className="h-8 w-40" />
            {/* Balance cards skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
            {/* Chart skeleton */}
            <Skeleton className="h-[300px] rounded-xl" />
            {/* Table skeleton */}
            <Skeleton className="h-[200px] rounded-xl" />
        </div>
    )
}
