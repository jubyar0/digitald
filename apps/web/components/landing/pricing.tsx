"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
    {
        name: "Free Forever",
        price: "$0",
        description: "Perfect for getting started",
        features: [
            "Unlimited products",
            "Basic analytics",
            "Standard support",
            "1 staff account",
            "Basic themes",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Professional",
        price: "$29",
        period: "/month",
        description: "For growing businesses",
        features: [
            "Everything in Free",
            "Advanced analytics",
            "Priority support",
            "5 staff accounts",
            "Custom domain",
            "Advanced themes",
            "API access",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large scale operations",
        features: [
            "Everything in Pro",
            "Unlimited staff",
            "Dedicated support",
            "Custom integrations",
            "SLA guarantee",
            "White-label solution",
        ],
        cta: "Contact Sales",
        popular: false,
    },
]

export default function PricingSection() {
    return (
        <section id="pricing" className="relative py-24 md:py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

            <div className="container relative mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        Pricing
                    </span>
                    <h2 className="mt-6 font-display text-3xl font-bold md:text-5xl">
                        <span className="text-foreground">Complete Packages</span>
                        <br />
                        <span className="text-gradient">For Every Merchant</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Choose the plan that best fits your business needs. All plans include
                        our core features.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "relative rounded-2xl border p-8 transition-all duration-300",
                                plan.popular
                                    ? "border-primary/50 bg-gradient-to-b from-primary/10 to-card/50 shadow-lg shadow-primary/20"
                                    : "border-border/50 bg-card/50 hover:border-primary/30"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-medium text-primary-foreground">
                                        <Sparkles className="h-3 w-3" />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center">
                                <h3 className="font-display text-xl font-semibold text-foreground">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                                <div className="mt-6">
                                    <span className="font-display text-4xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={cn(
                                    "mt-8 w-full",
                                    plan.popular
                                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                )}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
