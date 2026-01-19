import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const MovingBorder = ({
    children,
    duration = 2000,
    className,
    containerClassName,
    borderClassName,
    as: Component = "button",
    ...otherProps
}: {
    children: React.ReactNode;
    duration?: number;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
    as?: React.ElementType;
    [key: string]: unknown;
}) => {
    const Tag = Component as any;
    return (
        <Tag
            className={cn(
                "relative h-12 w-40 overflow-hidden rounded-lg p-[1px]",
                containerClassName
            )}
            {...(otherProps as any)}
        >
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-[conic-gradient(from_90deg_at_50%_50%,hsl(270_100%_65%)_0%,hsl(320_100%_55%)_50%,hsl(270_100%_65%)_100%)]",
                    borderClassName
                )}
                style={{
                    animation: `spin ${duration}ms linear infinite`,
                }}
            />
            <div
                className={cn(
                    "relative flex h-full w-full items-center justify-center rounded-[7px] bg-background text-sm font-medium",
                    className
                )}
            >
                {children}
            </div>
        </Tag>
    );
};

export const GlowingButton = ({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                className
            )}
            {...(props as any)}
        >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(270_100%_65%)_0%,hsl(320_100%_55%)_50%,hsl(270_100%_65%)_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[7px] bg-background px-6 py-2 text-sm font-medium text-foreground backdrop-blur-3xl transition-colors hover:bg-secondary">
                {children}
            </span>
        </motion.button>
    );
};
