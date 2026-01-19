import { Skeleton } from "@/components/ui/skeleton"

export default function SellerLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Skeleton className="h-[300px] xl:col-span-2 rounded-xl" />
                <Skeleton className="h-[300px] rounded-xl" />
            </div>
        </div>
    )
}
