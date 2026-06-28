"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
  glowColor?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 6,
  color = "#7C3AED",
  trackColor = "rgba(255,255,255,0.06)",
  className,
  children,
  animate: shouldAnimate = true,
  glowColor,
}: ProgressRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = useMotionValue(0);
  const springProgress = useSpring(progressValue, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    if (shouldAnimate) {
      animate(progressValue, progress, {
        duration: 1.2,
        ease: [0.19, 1, 0.22, 1],
      });
    } else {
      progressValue.set(progress);
    }
  }, [progress, progressValue, shouldAnimate]);

  const strokeDashoffset = useMotionValue(circumference);

  useEffect(() => {
    const unsubscribe = springProgress.on("change", (v) => {
      const offset = circumference - (v / 100) * circumference;
      strokeDashoffset.set(offset);
    });
    return unsubscribe;
  }, [springProgress, circumference, strokeDashoffset]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Filter for glow */}
        {glowColor && (
          <defs>
            <filter id={`glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          filter={glowColor ? `url(#glow-${size})` : undefined}
        />
      </svg>

      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
