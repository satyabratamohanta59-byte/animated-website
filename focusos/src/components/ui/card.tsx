"use client";

import { forwardRef, useRef, type MouseEvent } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  ["rounded-xl border transition-all duration-200"],
  {
    variants: {
      variant: {
        default: [
          "bg-[#13131F] border-white/8",
          "shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
        ],
        elevated: [
          "bg-[#1A1A2E] border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
          "inset-glow-top",
        ],
        glass: [
          "glass",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        ],
        glow: [
          "bg-[#13131F] border-violet-500/35",
          "shadow-[0_0_24px_rgba(124,58,237,0.12),0_4px_16px_rgba(0,0,0,0.4)]",
          "inset-glow-brand",
        ],
        mission: [
          "border-violet-500/30",
          "shadow-[0_0_32px_rgba(124,58,237,0.15)]",
          "bg-gradient-to-br from-violet-950/60 via-[#13131F] to-[#13131F]",
          "inset-glow-brand",
        ],
        outline: [
          "bg-transparent border-white/10",
          "hover:border-white/18",
        ],
        flat: [
          "bg-[#0D0D18] border-white/6",
        ],
      },
      hover: {
        none: "",
        lift: [
          "hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
          "cursor-pointer",
        ],
        glow: [
          "hover:border-violet-500/40 hover:shadow-[0_0_32px_rgba(124,58,237,0.18)]",
          "cursor-pointer",
        ],
        scale: [
          "hover:scale-[1.01] cursor-pointer",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  spotlightEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, hover, spotlightEffect = false, children, ...props },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const spotRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (!spotlightEffect || !cardRef.current || !spotRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(124,58,237,0.08), transparent 80%)`;
    };

    return (
      <div
        ref={(el) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={cn(cardVariants({ variant, hover }), "relative overflow-hidden", className)}
        onMouseMove={spotlightEffect ? handleMouseMove : undefined}
        {...props}
      >
        {spotlightEffect && (
          <div
            ref={spotRef}
            className="pointer-events-none absolute inset-0 transition-[background] duration-75"
          />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// ─── Card Sections ───────────────────────────────────────

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-semibold text-text-primary leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-text-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ─── Motion Card ─────────────────────────────────────────

interface MotionCardProps
  extends Omit<HTMLMotionProps<"div">, "ref">,
    VariantProps<typeof cardVariants> {}

export function MotionCard({
  className,
  variant,
  hover,
  children,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      className={cn(cardVariants({ variant, hover }), "relative overflow-hidden", className)}
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.99 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
