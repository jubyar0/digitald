import {
    Download,
    FileCheck,
    Scale,
    Layers,
    RefreshCw,
    Users,
    Shield,
} from "lucide-react"

const features = [
    {
        title: "Instant Downloads",
        description:
            "Get immediate access to your purchased assets. Download and start using them right away in your projects.",
        icon: Download,
    },
    {
        title: "Commercial License",
        description:
            "All products include commercial license. Use them in client projects, apps, and websites without extra fees.",
        icon: Scale,
    },
    {
        title: "Premium Quality",
        description:
            "Every product is reviewed for quality. High-resolution files, clean code, and professional designs.",
        icon: FileCheck,
    },
    {
        title: "Multi-Format Files",
        description:
            "Assets available in multiple formats - Figma, PSD, AI, SVG, PNG, and more for maximum compatibility.",
        icon: Layers,
    },
    {
        title: "Regular Updates",
        description:
            "New products added weekly. Stay ahead with the latest design trends and fresh creative assets.",
        icon: RefreshCw,
    },
    {
        title: "Creator Community",
        description:
            "Join thousands of designers and developers. Share, learn, and get inspired by creative professionals.",
        icon: Users,
    },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const Icon = feature.icon

    return (
        <div className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-4 group-hover:bg-orange-100 transition-colors">
                <Icon className="w-6 h-6 text-orange-600" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
            </p>
        </div>
    )
}

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-gray-900 mb-4">
                        Everything you need to create
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        High-quality digital products with flexible licensing, instant downloads,
                        and dedicated support.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center bg-gray-50 rounded-2xl p-10 md:p-16 border border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Shield className="w-6 h-6 text-gray-900" />
                        <span className="text-gray-900 font-bold">Secure & Trusted Marketplace</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">
                        Ready to start your next project?
                    </h3>
                    <p className="text-gray-600 max-w-xl mx-auto mb-8">
                        Join over 100,000 designers and developers who trust our marketplace.
                    </p>
                    <a href="/products" className="inline-flex h-12 items-center justify-center rounded-full bg-orange-600 px-8 text-base font-medium text-white shadow hover:bg-orange-700 transition-colors">
                        Browse Products
                    </a>
                </div>
            </div>
        </section>
    )
}
