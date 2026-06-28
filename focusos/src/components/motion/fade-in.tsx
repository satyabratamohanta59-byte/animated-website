"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUpVariants, fadeInVariants } from "@/lib/animation/variants";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  direction?: "up" | "down" | "none";
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.4,
  className,
  ...props
}: FadeInProps) {
  const variants =
    direction === "none" ? fadeInVariants : fadeInUpVariants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: variants.initial,
        animate: {
          ...((variants.animate as Record<string, unknown>)),
          transition: {
            duration,
            delay,
            ease: [0.19, 1, 0.22, 1],
          },
        },
        exit: variants.exit,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
