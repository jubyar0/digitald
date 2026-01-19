import { Skeleton } from "@/components/ui/skeleton"

export default function VendorsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-28" />
            </div>
            {/* Stats skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>
            {/* Table skeleton */}
            <div className="rounded-lg border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-b p-4 last:border-0">
                        <div className="flex gap-4 items-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
