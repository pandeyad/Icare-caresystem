import type { Variants, Transition } from "framer-motion"

// Standard transition matching design tokens
export const standardTransition: Transition = {
  duration: 0.2,
  ease: [0.2, 0.8, 0.2, 1], // matches --ease-standard
}

export const emphasizedTransition: Transition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1], // matches --ease-emphasized
}

// Page transition
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

// Fade in from below (for sections/cards)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

// Fade in (no movement)
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

// Scale in (for badges, popovers)
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
}

// Stagger children container
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
}

// Stagger children item
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
}

// Slide in from right (for panels, sidebars)
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
}

// Modal variants
export const modalScrimVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalCardVariants: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.98 },
}

// Toast variants
export const toastVariants: Variants = {
  initial: { opacity: 0, y: -8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 80, scale: 0.96 },
}

// Card hover effect
export const cardHover = {
  rest: { scale: 1, boxShadow: "var(--shadow-sm)" },
  hover: { scale: 1.01, boxShadow: "var(--shadow-md)" },
}

// Stat card entrance for a row of stat cards
export const statCardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

export const statContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}
