"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
// import { Card3DEffect } from "@/components/aceternity/card-3d-effect"; // Missing file
// import { CardSpotlight } from "@/components/aceternity/card-spotlight"; // Missing file
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    variant?: "glass" | "gradient"; // Removed "3d" and "spotlight" variants
    gradient?: string;
}

export function AnimatedCard({
    children,
    className,
    containerClassName,
    variant = "glass",
    gradient = "from-indigo-500 to-purple-500",
}: AnimatedCardProps) {
    // 3D Card - Disabled due to missing component
    // if (variant === "3d") {
    //     return (
    //         <Card3DEffect containerClassName={containerClassName}>
    //             <motion.div
    //                 className={cn("glass rounded-2xl p-6", className)}
    //                 whileHover={{ y: -5 }}
    //                 transition={{ duration: 0.2 }}
    //             >
    //                 {children}
    //             </motion.div>
    //         </Card3DEffect>
    //     );
    // }

    // Spotlight Card - Disabled due to missing component
    // if (variant === "spotlight") {
    //     return (
    //         <CardSpotlight className={containerClassName}>
    //             <div className={cn("glass rounded-2xl p-6", className)}>
    //                 {children}
    //             </div>
    //         </CardSpotlight>
    //     );
    // }

    // Gradient Card
    if (variant === "gradient") {
        return (
            <motion.div
                className={cn(
                    "relative rounded-2xl p-6 group overflow-hidden",
                    containerClassName
                )}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                {/* Glass Overlay */}
                <div className="absolute inset-0 glass" />

                {/* Content */}
                <div className={cn("relative z-10", className)}>
                    {children}
                </div>

                {/* Glow Effect */}
                <motion.div
                    className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    style={{ zIndex: -1 }}
                />
            </motion.div>
        );
    }

    // Default Glass Card
    return (
        <motion.div
            className={cn("glass rounded-2xl p-6 hover:glass-strong", containerClassName)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <div className={className}>
                {children}
            </div>
        </motion.div>
    );
}
