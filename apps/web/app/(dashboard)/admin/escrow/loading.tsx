import { Skeleton } from "@/components/ui/skeleton"

export default function EscrowLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header skeleton */}
            <Skeleton className="h-8 w-40" />
            {/* Stats cards skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            {/* Table skeleton */}
            <Skeleton className="h-[400px] rounded-xl" />
        </div>
    )
}
