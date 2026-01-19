/**
 * Custom hook for scroll-based animations
 * Detects element visibility and triggers animations
 */

import { useInView } from "framer-motion";
import { useRef, RefObject } from "react";

interface UseScrollAnimationsOptions {
    /**
     * Only trigger the animation once
     * @default true
     */
    once?: boolean;

    /**
     * Margin around the viewport to trigger animation earlier/later
     * @default "-100px"
     */
    margin?: string;

    /**
     * Amount of the element that needs to be visible (0-1)
     * @default undefined (any amount triggers)
     */
    amount?: number | "some" | "all";
}

/**
 * Hook to detect when an element enters the viewport
 * Returns a ref to attach to the element and a boolean indicating visibility
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, isInView } = useScrollAnimations();
 *   
 *   return (
 *     <motion.div
 *       ref={ref}
 *       initial={{ opacity: 0, y: 50 }}
 *       animate={isInView ? { opacity: 1, y: 0 } : {}}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useScrollAnimations(
    options: UseScrollAnimationsOptions = {}
): {
    ref: RefObject<HTMLDivElement>;
    isInView: boolean;
} {
    const {
        once = true,
        margin = "-100px",
        amount,
    } = options;

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once,
        margin: margin as any,
        amount,
    });

    return { ref, isInView };
}

/**
 * Hook for staggered children animations
 * Use this on the container element
 * 
 * @example
 * ```tsx
 * function StaggeredList() {
 *   const { ref, isInView } = useStaggerAnimation();
 *   
 *   return (
 *     <motion.div
 *       ref={ref}
 *       variants={staggerContainer}
 *       initial="initial"
 *       animate={isInView ? "animate" : "initial"}
 *     >
 *       {items.map((item, i) => (
 *         <motion.div key={i} variants={fadeInUp}>
 *           {item}
 *         </motion.div>
 *       ))}
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useStaggerAnimation(
    options: UseScrollAnimationsOptions = {}
): {
    ref: RefObject<HTMLDivElement>;
    isInView: boolean;
} {
    return useScrollAnimations({
        once: true,
        margin: "-50px" as any,
        ...options,
    });
}

/**
 * Hook for scroll progress (0-1)
 * Useful for progress bars or parallax effects
 * 
 * @example
 * ```tsx
 * function ScrollProgress() {
 *   const { ref, scrollProgress } = useScrollProgress();
 *   
 *   return (
 *     <div ref={ref}>
 *       <motion.div
 *         style={{
 *           scaleX: scrollProgress,
 *           transformOrigin: "left"
 *         }}
 *         className="h-1 bg-indigo-500"
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollProgress(): {
    ref: RefObject<HTMLDivElement>;
    scrollProgress: number;
} {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    return {
        ref,
        scrollProgress: scrollYProgress.get(),
    };
}

/**
 * Hook to check if user prefers reduced motion
 * Use this to disable/simplify animations for accessibility
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const shouldReduceMotion = useReducedMotion();
 *   
 *   return (
 *     <motion.div
 *       animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export { useReducedMotion } from "framer-motion";

// Import useScroll for scroll progress
import { useScroll } from "framer-motion";
