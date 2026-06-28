"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  accent: "violet" | "cyan" | "emerald" | "amber" | "orange";
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

const ACCENT_MAP = {
  violet: {
    icon:   "text-violet-400 bg-violet-500/12 border-violet-500/20",
    value:  "text-violet-300",
    glow:   "group-hover:shadow-[0_0_24px_rgba(124,58,237,0.15)]",
  },
  cyan: {
    icon:   "text-cyan-400 bg-cyan-500/12 border-cyan-500/20",
    value:  "text-cyan-300",
    glow:   "group-hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]",
  },
  emerald: {
    icon:   "text-emerald-400 bg-emerald-500/12 border-emerald-500/20",
    value:  "text-emerald-300",
    glow:   "group-hover:shadow-[0_0_24px_rgba(52,211,153,0.15)]",
  },
  amber: {
    icon:   "text-amber-400 bg-amber-500/12 border-amber-500/20",
    value:  "text-amber-300",
    glow:   "group-hover:shadow-[0_0_24px_rgba(251,191,36,0.15)]",
  },
  orange: {
    icon:   "text-orange-400 bg-orange-500/12 border-orange-500/20",
    value:  "text-orange-300",
    glow:   "group-hover:shadow-[0_0_24px_rgba(251,146,60,0.15)]",
  },
};

export function StatCard({
  label,
  value,
  subValue,
  icon,
  accent,
  delay = 0,
}: StatCardProps) {
  const colors = ACCENT_MAP[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.19, 1, 0.22, 1] }}
      className={cn(
        "group relative flex flex-col gap-3 p-4 rounded-2xl",
        "bg-[#13131F] border border-white/6",
        "transition-all duration-300",
        colors.glow
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center text-lg border flex-shrink-0",
        colors.icon
      )}>
        {icon}
      </div>

      {/* Value */}
      <div>
        <p className={cn("text-2xl font-black tracking-tight leading-none", colors.value)}>
          {value}
        </p>
        {subValue && (
          <p className="text-[11px] text-text-muted mt-0.5">{subValue}</p>
        )}
        <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium mt-2">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
