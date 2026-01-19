"use client"

import { motion } from "framer-motion"
import { ArrowRight, Store, Package, Rocket, TrendingUp } from "lucide-react"

const steps = [
    {
        icon: Store,
        title: "Create Your Store",
        description: "Sign up and set up your store in minutes with our intuitive onboarding.",
        step: "01",
    },
    {
        icon: Package,
        title: "Add Your Products",
        description: "Upload products, set prices, and organize your inventory easily.",
        step: "02",
    },
    {
        icon: Rocket,
        title: "Launch & Sell",
        description: "Go live and start accepting orders from customers worldwide.",
        step: "03",
    },
    {
        icon: TrendingUp,
        title: "Grow & Scale",
        description: "Use analytics and tools to expand your business and increase sales.",
        step: "04",
    },
]

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
                        Sell your work in seconds
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Turn your passion into income. It&apos;s never been easier to start your own digital store.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-12 left-[60%] hidden h-[2px] w-[80%] bg-gray-100 lg:block" />
                            )}

                            <div className="relative rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1">
                                {/* Step number */}
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-900 shadow-sm z-10">
                                    {step.step}
                                </span>

                                {/* Icon */}
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors">
                                    <step.icon className="h-8 w-8 text-orange-600" />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
