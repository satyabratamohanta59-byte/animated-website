"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import {
  staggerContainerVariants,
  staggerItemVariants,
  staggerFastItemVariants,
} from "@/lib/animation/variants";
import { cn } from "@/lib/utils";

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  speed?: "fast" | "normal";
}

export function StaggerGroup({
  children,
  className,
  delay = 0,
  staggerDelay,
  speed = "normal",
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay ?? (speed === "fast" ? 0.04 : 0.07),
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  className?: string;
  speed?: "fast" | "normal";
}

export function StaggerItem({ children, className, speed = "normal", ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={speed === "fast" ? staggerFastItemVariants : staggerItemVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
