import { motion, AnimatePresence } from 'framer-motion';
import { zeroG, viewportOnce } from '../utils/motionConfig';

// Page wrapper with enter/exit transitions
export const ZeroGPage = ({ children, className = '' }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);

// Stagger container for lists
export const ZeroGStagger = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={zeroG.staggerContainer}
        initial="initial"
        animate="animate"
    >
        {children}
    </motion.div>
);

// Stagger item
export const ZeroGItem = ({ children, className = '' }) => (
    <motion.div className={className} variants={zeroG.staggerItem}>
        {children}
    </motion.div>
);

// Float up on scroll into view
export const ZeroGFloat = ({ children, className = '', delay = 0 }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay
        }}
    >
        {children}
    </motion.div>
);

// Magnetic card with hover lift
export const ZeroGCard = ({ children, className = '', onClick }) => (
    <motion.div
        className={className}
        onClick={onClick}
        whileHover={{
            y: -8,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        whileTap={{ scale: 0.98 }}
    >
        {children}
    </motion.div>
);

// Magnetic button with levitation
export const ZeroGButton = ({ children, className = '', onClick, ...props }) => (
    <motion.button
        className={className}
        onClick={onClick}
        whileHover={{
            y: -3,
            transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
        whileTap={{ y: 0, scale: 0.97 }}
        {...props}
    >
        {children}
    </motion.button>
);

// Weightless loading spinner
export const ZeroGLoader = () => (
    <div className="zero-g-loader">
        <motion.div
            className="loader-ring"
            animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
            }}
            transition={{
                rotate: { duration: 1.5, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            }}
        />
    </div>
);

export { AnimatePresence };
