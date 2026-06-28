"use client";

import { motion } from "framer-motion";
import { ProgressRing } from "@/components/motion/progress-ring";
import { CountUp } from "@/components/motion/count-up";
import { getLevelTier, formatXP } from "@/lib/utils";
import type { DashboardXP } from "@/lib/dashboard";

interface XPLevelCardProps {
  xp: DashboardXP;
}

const TIER_GRADIENT: Record<string, string> = {
  Initiate:   "from-gray-500/20 to-[#13131F]",
  Scholar:    "from-emerald-950/60 to-[#13131F]",
  Seeker:     "from-cyan-950/60 to-[#13131F]",
  Adept:      "from-violet-950/60 to-[#13131F]",
  Master:     "from-amber-950/60 to-[#13131F]",
  Legendary:  "from-white/5 to-[#13131F]",
};

const TIER_BORDER: Record<string, string> = {
  Initiate:  "border-gray-500/20",
  Scholar:   "border-emerald-500/20",
  Seeker:    "border-cyan-500/20",
  Adept:     "border-violet-500/25",
  Master:    "border-amber-500/25",
  Legendary: "border-white/20",
};

const TIER_RING_COLOR: Record<string, string> = {
  Initiate:  "#9CA3AF",
  Scholar:   "#34D399",
  Seeker:    "#22D3EE",
  Adept:     "#7C3AED",
  Master:    "#FBBF24",
  Legendary: "#F0F0FF",
};

export function XPLevelCard({ xp }: XPLevelCardProps) {
  const tier = getLevelTier(xp.currentLevel);
  const gradient = TIER_GRADIENT[tier.name] ?? TIER_GRADIENT.Adept;
  const border   = TIER_BORDER[tier.name]   ?? TIER_BORDER.Adept;
  const ringColor = TIER_RING_COLOR[tier.name] ?? "#7C3AED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
      className={`relative flex flex-col gap-4 p-5 rounded-2xl bg-gradient-to-br ${gradient} border ${border} overflow-hidden`}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30 blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${ringColor}22 0%, transparent 60%)`,
        }}
      />

      <div className="relative flex items-start gap-4">
        {/* Progress ring */}
        <ProgressRing
          progress={xp.progressPercent}
          size={72}
          strokeWidth={4}
          color={ringColor}
          trackColor={`${ringColor}20`}
          animate
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] text-text-muted font-medium">Lv</span>
            <span className="text-xl font-black text-text-primary" style={{ color: ringColor }}>
              {xp.currentLevel}
            </span>
          </div>
        </ProgressRing>

        {/* Tier + XP info */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{tier.emoji}</span>
            <span className="text-sm font-bold text-text-primary">{tier.name}</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-text-primary">
              <CountUp target={xp.totalXP} formatter={(v) => Math.round(v).toLocaleString()} />
            </span>
            <span className="text-xs text-text-muted font-mono">total XP</span>
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-text-muted font-mono">
            {formatXP(xp.xpInCurrentLevel)} / {formatXP(xp.xpToNextLevel)} XP
          </span>
          <span className="text-[11px] text-text-muted">
            to Level {xp.currentLevel + 1}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: ringColor }}
            initial={{ width: 0 }}
            animate={{ width: `${xp.progressPercent}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          />
        </div>
      </div>

      {/* Lifetime XP */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-white/6">
        <span className="text-[10px] text-text-muted">Lifetime:</span>
        <span className="text-[10px] font-mono text-text-secondary">
          {formatXP(xp.lifetimeXP)} XP
        </span>
      </div>
    </motion.div>
  );
}
