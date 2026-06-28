"use client";

import { useRef, useState, type MouseEvent } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  strength = 0.4,
  radius = 120,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useSpring(0, { stiffness: 200, damping: 15, mass: 0.5 });
  const y = useSpring(0, { stiffness: 200, damping: 15, mass: 0.5 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX ** 2 + distY ** 2);

    if (dist < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={disabled ? {} : { scale: 0.96 }}
      className={cn("relative inline-flex cursor-pointer select-none", className)}
    >
      {children}
      {/* Spotlight effect on hover */}
      {isHovered && !disabled && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
}
