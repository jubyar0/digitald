import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getFeaturedCategories } from "@/actions/public-categories"

// Category icons and colors mapping
const categoryStyles: Record<string, { icon: string; gradient: string }> = {
    "UI Kits": { icon: "🎨", gradient: "from-purple-500 to-pink-500" },
    "Templates": { icon: "📄", gradient: "from-blue-500 to-cyan-500" },
    "Icons": { icon: "✨", gradient: "from-yellow-500 to-orange-500" },
    "Fonts": { icon: "🔤", gradient: "from-green-500 to-teal-500" },
    "3D Assets": { icon: "📦", gradient: "from-indigo-500 to-purple-500" },
    "Graphics": { icon: "🖼️", gradient: "from-rose-500 to-pink-500" },
    "Textures": { icon: "🎭", gradient: "from-amber-500 to-orange-500" },
    "Photos": { icon: "📷", gradient: "from-sky-500 to-blue-500" },
    "Illustrations": { icon: "🎨", gradient: "from-fuchsia-500 to-purple-500" },
    "Mockups": { icon: "📱", gradient: "from-emerald-500 to-teal-500" },
    "default": { icon: "📁", gradient: "from-gray-500 to-slate-500" }
}

interface Category {
    id: string
    name: string
    slug: string
    description?: string | null
    _count?: {
        products: number
    }
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
    const style = categoryStyles[category.name] || categoryStyles["default"]
    const productCount = category._count?.products || 0

    return (
        <Link href={`/products?category=${category.slug}`} className="group block">
            <div
                className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}`} />

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${style.gradient} mb-4`}>
                    <span className="text-2xl">{style.icon}</span>
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {category.name}
                </h3>

                {/* Product Count */}
                <p className="text-sm text-gray-500 mt-1">
                    {productCount} {productCount === 1 ? "product" : "products"}
                </p>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-purple-600" />
                </div>
            </div>
        </Link>
    )
}

export default async function CategoriesSection() {
    const categories = await getFeaturedCategories(8)

    if (!categories || categories.length === 0) {
        return null
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
                        Browse by Category
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
                        Find What You Need
                    </h2>
                    <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                        Explore our curated collection of premium digital products organized by category
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category: Category, index: number) => (
                        <CategoryCard key={category.id} category={category} index={index} />
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-10 text-center">
                    <Link
                        href="/categories"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                        View All Categories
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
