/**
 * Centralized Animation Configuration
 * Reusable Framer Motion variants, easing functions, and animation constants
 */

import { Variants } from "framer-motion";

// ========================================
// EASING FUNCTIONS
// ========================================

export const easings = {
    // Smooth, natural motion (recommended for most animations)
    easeOutExpo: [0.19, 1, 0.22, 1] as const,

    // Quick start, smooth end
    easeOutCubic: [0.33, 1, 0.68, 1] as const,

    // Elastic bounce effect
    easeOutBack: [0.34, 1.56, 0.64, 1] as const,

    // Smooth in and out
    easeInOutCubic: [0.65, 0, 0.35, 1] as const,

    // Accelerating motion
    easeInQuad: [0.55, 0.085, 0.68, 0.53] as const,
} as const;

// ========================================
// ANIMATION DURATIONS
// ========================================

export const durations = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.6,
    slower: 0.8,
} as const;

// ========================================
// FADE ANIMATIONS
// ========================================

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

export const fadeInLeft: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const fadeInRight: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

// ========================================
// SCALE ANIMATIONS
// ========================================

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

export const scaleInBounce: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 15,
        }
    },
    exit: { opacity: 0, scale: 0.8 },
};

export const scalePopIn: Variants = {
    initial: { scale: 0 },
    animate: {
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
        }
    },
    exit: { scale: 0 },
};

// ========================================
// STAGGER CONTAINER
// ========================================

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerContainerFast: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0,
        },
    },
};

export const staggerContainerSlow: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

// ========================================
// CARD ANIMATIONS
// ========================================

export const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -8,
        transition: {
            duration: 0.3,
            ease: easings.easeOutCubic,
        }
    },
    tap: { scale: 0.98 },
};

export const card3DHover = {
    rest: {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
    },
    hover: (custom: { x: number; y: number }) => ({
        rotateX: custom.y * -0.5,
        rotateY: custom.x * 0.5,
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: easings.easeOutCubic,
        }
    }),
};

// ========================================
// BUTTON ANIMATIONS
// ========================================

export const buttonHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: easings.easeOutCubic,
        }
    },
    tap: { scale: 0.95 },
};

export const buttonMagnetic = {
    rest: { x: 0, y: 0 },
    hover: (custom: { x: number; y: number }) => ({
        x: custom.x * 0.3,
        y: custom.y * 0.3,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 15,
        }
    }),
};

// ========================================
// TEXT ANIMATIONS
// ========================================

export const textReveal: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easings.easeOutExpo,
        }
    },
};

export const letterReveal: Variants = {
    initial: {
        opacity: 0,
        y: 50,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
};

// ========================================
// NAVIGATION ANIMATIONS
// ========================================

export const navbarSlideDown: Variants = {
    initial: { y: -100, opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: easings.easeOutCubic,
        }
    },
    exit: { y: -100, opacity: 0 },
};

export const mobileMenuSlideIn: Variants = {
    initial: { x: "100%" },
    animate: {
        x: 0,
        transition: {
            duration: 0.3,
            ease: easings.easeOutCubic,
        }
    },
    exit: {
        x: "100%",
        transition: {
            duration: 0.3,
            ease: easings.easeInOutCubic,
        }
    },
};

export const dropdownFadeIn: Variants = {
    initial: {
        opacity: 0,
        y: -10,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: easings.easeOutCubic,
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.15,
        }
    },
};

// ========================================
// MODAL/DIALOG ANIMATIONS
// ========================================

export const modalBackdrop: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const modalContent: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: easings.easeOutCubic,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: {
            duration: 0.2,
        }
    },
};

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

export const scrollReveal: Variants = {
    initial: {
        opacity: 0,
        y: 50,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easings.easeOutExpo,
        }
    },
};

export const scrollRevealScale: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: easings.easeOutExpo,
        }
    },
};

// ========================================
// FLOATING ANIMATION
// ========================================

export const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
    }
};

export const floatingAnimationSlow = {
    y: [0, -15, 0],
    transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
    }
};

// ========================================
// PULSE/GLOW ANIMATION
// ========================================

export const pulseGlow = {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
    }
};

// ========================================
// PAGE TRANSITION
// ========================================

export const pageTransition: Variants = {
    initial: {
        opacity: 0,
        x: -20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: easings.easeOutCubic,
        }
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.3,
        }
    },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create a stagger delay for child elements
 * @param index - Index of the child element
 * @param baseDelay - Base delay before stagger starts
 * @param staggerDelay - Delay between each child
 */
export const getStaggerDelay = (
    index: number,
    baseDelay: number = 0,
    staggerDelay: number = 0.1
): number => {
    return baseDelay + (index * staggerDelay);
};

/**
 * Create a custom transition with easing
 */
export const createTransition = (
    duration: number = durations.normal,
    easing: readonly number[] = easings.easeOutCubic,
    delay: number = 0
) => ({
    duration,
    ease: easing,
    delay,
});
