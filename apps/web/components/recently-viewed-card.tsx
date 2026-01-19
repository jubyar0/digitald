import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"

interface RecentlyViewedCardProps {
    id: string
    title: string
    type: "Texture" | "Model" | "HDRI"
    imageUrl: string
    date: string
    isFree?: boolean
    price?: number
}

export function RecentlyViewedCard({
    id,
    title,
    type,
    imageUrl,
    date,
    isFree,
    price,
}: RecentlyViewedCardProps) {
    return (
        <Link
            href={`/3dm/products/${id}`}
            className="group block"
        >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-3">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#09090b]/0 group-hover:bg-[#09090b]/20 transition-colors duration-300" />
            </div>
            <div className="space-y-1">
                <h3 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isFree ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                Free
                            </span>
                        ) : (
                            <span className="text-xs font-medium text-gray-400">
                                ${price?.toFixed(2)}
                            </span>
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {type}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
