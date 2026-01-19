"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { MovingBorder } from "@/components/ui/moving-border";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "glass" | "gradient" | "outline";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: ReactNode;
    className?: string;
}

export function PremiumButton({
    variant = "primary",
    size = "md",
    loading = false,
    children,
    className,
    disabled,
    onClick,
    type = "button",
}: PremiumButtonProps) {
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-8 py-4 text-base",
        lg: "px-10 py-5 text-lg",
    };

    const baseClasses = cn(
        "font-semibold rounded-lg transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "relative overflow-hidden group",
        sizeClasses[size],
        className
    );

    const buttonContent = (
        <>
            {loading && (
                <Loader2 className="w-5 h-5 animate-spin mr-2 inline-block" />
            )}
            {children}
        </>
    );

    // Primary Button with Moving Border
    if (variant === "primary") {
        return (
            <MovingBorder duration={2000}>
                <motion.button
                    className={cn(baseClasses, "bg-white text-black")}
                    whileHover={{ scale: disabled ? 1 : 1.05 }}
                    whileTap={{ scale: disabled ? 1 : 0.98 }}
                    disabled={disabled || loading}
                    onClick={onClick as any}
                    type={type}
                >
                    {buttonContent}
                </motion.button>
            </MovingBorder>
        );
    }

    // Glass Button
    if (variant === "glass") {
        return (
            <motion.button
                className={cn(
                    baseClasses,
                    "glass text-white hover:glass-strong backdrop-blur-xl"
                )}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                disabled={disabled || loading}
                onClick={onClick as any}
                type={type}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">{buttonContent}</span>
            </motion.button>
        );
    }

    // Gradient Button
    if (variant === "gradient") {
        return (
            <motion.button
                className={cn(
                    baseClasses,
                    "bg-gradient-primary text-white shadow-lg hover:shadow-2xl"
                )}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                disabled={disabled || loading}
                onClick={onClick as any}
                type={type}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
                <span className="relative z-10">{buttonContent}</span>
            </motion.button>
        );
    }

    // Outline Button
    return (
        <motion.button
            className={cn(
                baseClasses,
                "border-2 border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5"
            )}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            disabled={disabled || loading}
            onClick={onClick as any}
            type={type}
        >
            {buttonContent}
        </motion.button>
    );
}
