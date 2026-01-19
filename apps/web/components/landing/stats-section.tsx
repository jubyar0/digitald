import { Star, Users, ShoppingBag, Award, CheckCircle } from "lucide-react"

// Stats data
const stats = [
    { label: "Digital Products", value: "50K+", icon: ShoppingBag },
    { label: "Active Creators", value: "5,000+", icon: Users },
    { label: "Happy Customers", value: "100K+", icon: Star },
    { label: "5-Star Reviews", value: "25K+", icon: Award },
]

// Customer reviews
const reviews = [
    {
        name: "Jessica M.",
        role: "UI Designer",
        content: "The quality of assets here is incredible. Saved me countless hours on my projects.",
        rating: 5,
    },
    {
        name: "David K.",
        role: "Developer",
        content: "Best marketplace for digital products. Commercial license included is a huge plus!",
        rating: 5,
    },
    {
        name: "Emma S.",
        role: "Creative Director",
        content: "My go-to place for premium templates and UI kits. Highly recommended!",
        rating: 5,
    },
]

// Featured creator avatars
const featuredCreators = [
    { name: "Sarah Design", products: 45 },
    { name: "Alex Studio", products: 32 },
    { name: "Mike Arts", products: 28 },
    { name: "Luna Craft", products: 56 },
    { name: "Design Pro", products: 41 },
]

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
    const Icon = stat.icon
    return (
        <div className="text-center p-6 border-r last:border-r-0 border-gray-100">
            <div className="inline-flex items-center justify-center w- mb-2">
                <Icon className="w-8 h-8 text-gray-900" />
            </div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
        </div>
    )
}

function ReviewCard({ review, index }: { review: typeof reviews[0]; index: number }) {
    return (
        <div className="bg-[#fdfbf6] rounded-xl p-8 hover:shadow-sm transition-shadow">
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
            </div>

            {/* Quote */}
            <p className="text-gray-900 text-lg font-serif mb-6 leading-relaxed">&quot;{review.content}&quot;</p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-sm text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.role}</div>
                </div>
            </div>
        </div>
    )
}

export default function TrustSignalsSection() {
    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                {/* Stats Grid - Cleaner layout */}
                <div className="max-w-4xl mx-auto mb-20 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="p-6 text-center">
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif text-gray-900 mb-4">
                            Loved by creators worldwide
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <ReviewCard key={index} review={review} index={index} />
                        ))}
                    </div>
                </div>

                {/* Featured Creators / Community */}
                <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Join our growing community</h3>
                    <div className="flex justify-center items-center mb-6">
                        <div className="flex -space-x-3">
                            {featuredCreators.map((creator, index) => (
                                <div
                                    key={creator.name}
                                    className="relative"
                                    title={creator.name}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold border-4 border-white">
                                        {creator.name.charAt(0)}
                                    </div>
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-medium border-4 border-white ml-1">
                                +5k
                            </div>
                        </div>
                    </div>
                    <div>
                        <a href="/sell" className="inline-flex h-10 items-center justify-center rounded-full bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                            Start Selling Today
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
