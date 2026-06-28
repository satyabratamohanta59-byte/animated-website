import type { Variants, Transition } from "framer-motion";

// ─── Shared Transitions ──────────────────────────────────

export const transitions = {
  fast: { duration: 0.15, ease: [0.19, 1, 0.22, 1] } satisfies Transition,
  normal: { duration: 0.25, ease: [0.19, 1, 0.22, 1] } satisfies Transition,
  slow: { duration: 0.4, ease: [0.19, 1, 0.22, 1] } satisfies Transition,
  spring_snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } satisfies Transition,
  spring_fluid: { type: "spring", stiffness: 200, damping: 25, mass: 1.0 } satisfies Transition,
  spring_gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1.2 } satisfies Transition,
  spring_bouncy: { type: "spring", stiffness: 350, damping: 15, mass: 0.9 } satisfies Transition,
} as const;

// ─── Page Transitions ────────────────────────────────────

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.19, 1, 0.22, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: {
      duration: 0.2,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// ─── Fade In ─────────────────────────────────────────────

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Fade In Up ──────────────────────────────────────────

export const fadeInUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Fade In Down ────────────────────────────────────────

export const fadeInDownVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// ─── Slide In From Right ─────────────────────────────────

export const slideInRightVariants: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Slide In From Left ──────────────────────────────────

export const slideInLeftVariants: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Scale In ────────────────────────────────────────────

export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.9 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Modal ───────────────────────────────────────────────

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15, ease: [0.76, 0, 0.24, 1] },
  },
};

export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ─── Sheet / Drawer ──────────────────────────────────────

export const sheetRightVariants: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] },
  },
};

export const sheetBottomVariants: Variants = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    y: "100%",
    transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Stagger Container ───────────────────────────────────

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

export const staggerFastItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

// ─── Card Hover ──────────────────────────────────────────

export const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -3,
    scale: 1.01,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

// ─── Button ──────────────────────────────────────────────

export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
  tap: {
    scale: 0.96,
    transition: { duration: 0.08 },
  },
};

// ─── Achievement Unlock ──────────────────────────────────

export const achievementVariants: Variants = {
  initial: { opacity: 0, scale: 0.5, rotate: -10 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Number Ticker ───────────────────────────────────────

export const tickerVariants: Variants = {
  initial: { y: 16, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    y: -16,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
  },
};

// ─── Focus Ring ──────────────────────────────────────────

export const focusRingVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 0.6,
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
  },
  running: {
    scale: [1, 1.02, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  },
  break: {
    scale: [1, 1.05, 1],
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
  },
};

// ─── Sidebar ─────────────────────────────────────────────

export const sidebarVariants: Variants = {
  expanded: {
    width: 240,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  collapsed: {
    width: 64,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// ─── Spotlight / Glow (for hover) ────────────────────────

export const spotlightVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
