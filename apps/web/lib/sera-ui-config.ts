/**
 * Sera UI Configuration
 * Animation and motion settings for Sera UI components
 */

// Default animation variants
export const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export const slideInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export const scaleOnHoverVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    }
};

export const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

// Default transition settings
export const defaultTransition = {
    duration: 0.3,
    ease: "easeInOut"
};

export const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};

// Animation presets
export const animationPresets = {
    fadeIn: fadeInVariants,
    slideIn: slideInVariants,
    scaleOnHover: scaleOnHoverVariants,
    stagger: staggerContainerVariants
};
