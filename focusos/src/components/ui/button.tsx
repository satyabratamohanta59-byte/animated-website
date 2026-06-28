"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "font-semibold rounded-lg",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none overflow-hidden",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-violet-500 text-white",
          "shadow-[0_0_20px_rgba(124,58,237,0.35)]",
          "hover:bg-violet-400 hover:shadow-[0_0_28px_rgba(124,58,237,0.5)]",
          "active:bg-violet-600",
          "border border-violet-400/30",
        ],
        secondary: [
          "bg-[#1A1A2E] text-text-primary",
          "border border-white/10",
          "hover:border-violet-500/40 hover:bg-[#22223A]",
          "active:bg-[#1A1A2E]",
        ],
        ghost: [
          "bg-transparent text-text-secondary",
          "hover:text-text-primary hover:bg-white/5",
          "active:bg-white/8",
        ],
        danger: [
          "bg-rose-500/15 text-rose-400",
          "border border-rose-500/30",
          "hover:bg-rose-500/25 hover:border-rose-400/50",
        ],
        success: [
          "bg-emerald-500/15 text-emerald-400",
          "border border-emerald-500/30",
          "hover:bg-emerald-500/25",
        ],
        xp: [
          "bg-amber-400/15 text-amber-400",
          "border border-amber-400/30",
          "hover:bg-amber-400/25 hover:shadow-[0_0_16px_rgba(251,191,36,0.3)]",
          "font-mono",
        ],
        outline: [
          "bg-transparent text-text-primary",
          "border border-white/10",
          "hover:border-white/20 hover:bg-white/5",
        ],
        glass: [
          "glass text-text-primary",
          "hover:bg-white/10",
        ],
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-md",
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-13 px-8 text-base",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0 rounded-md",
        "icon-lg": "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

// ─── Motion Button (with hover physics) ─────────────────

interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        whileHover={disabled || loading ? {} : { scale: 1.03, y: -1 }}
        whileTap={disabled || loading ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        {...(props as object)}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";

export { buttonVariants };
