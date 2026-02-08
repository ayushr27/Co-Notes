// Zero-G Motion Presets for Framer Motion
// Anti-Gravity animation configurations

export const zeroG = {
    // Float up from below (default entrance)
    floatUp: {
        initial: { opacity: 0, y: 40, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
            mass: 0.8
        }
    },

    // Fade in with subtle scale
    materialize: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },

    // Stagger children container
    staggerContainer: {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    },

    // Stagger child item
    staggerItem: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    },

    // Magnetic hover effect
    magneticHover: {
        whileHover: {
            scale: 1.03,
            y: -4,
            transition: { type: 'spring', stiffness: 400, damping: 17 }
        },
        whileTap: { scale: 0.98 }
    },

    // Button levitation
    buttonLevitate: {
        whileHover: {
            y: -3,
            transition: { type: 'spring', stiffness: 400, damping: 20 }
        },
        whileTap: { y: 0, scale: 0.97 }
    },

    // Card float
    cardFloat: {
        whileHover: {
            y: -8,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300, damping: 20 }
        }
    },

    // Page transition
    pageTransition: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

// Viewport animation trigger options
export const viewportOnce = {
    once: true,
    margin: '-50px'
};

// Spring presets
export const springs = {
    gentle: { type: 'spring', stiffness: 100, damping: 15 },
    snappy: { type: 'spring', stiffness: 400, damping: 25 },
    bouncy: { type: 'spring', stiffness: 300, damping: 10 }
};
