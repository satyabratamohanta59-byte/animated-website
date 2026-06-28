"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DashboardStreak } from "@/lib/dashboard";

interface StreakCardProps {
  streak: DashboardStreak;
}

function getStreakColor(days: number): string {
  if (days >= 100) return "text-rose-400";
  if (days >= 30)  return "text-orange-400";
  if (days >= 7)   return "text-amber-400";
  if (days >= 3)   return "text-yellow-400";
  return "text-text-muted";
}

function getStreakLabel(days: number): string {
  if (days === 0)  return "Start your streak today!";
  if (days === 1)  return "Day 1 — you've begun.";
  if (days < 7)   return `${7 - days} days to Weekly Warrior`;
  if (days < 14)  return `${14 - days} days to Fortnight Force`;
  if (days < 30)  return `${30 - days} days to Month Master`;
  if (days < 100) return `${100 - days} days to Century Sage`;
  return "You're on fire. Legendary run.";
}

// Render the last 7 days as dots
function WeekDots({ lastActiveDate }: { lastActiveDate: string | null }) {
  const today = new Date();
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const isToday = i === 6;

    let active = false;
    if (lastActiveDate) {
      const last = new Date(lastActiveDate);
      const diff = Math.floor(
        (d.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
      );
      active = diff <= 0;
    }

    return { dateStr, isToday, active, day: ["S","M","T","W","T","F","S"][d.getDay()] };
  });

  return (
    <div className="flex items-end gap-1.5">
      {dots.map((dot, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.04 + 0.2, type: "spring", stiffness: 400, damping: 20 }}
            className={cn(
              "w-5 h-5 rounded-full",
              dot.active
                ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                : dot.isToday
                ? "bg-white/10 border-2 border-dashed border-orange-500/40"
                : "bg-white/5"
            )}
          />
          <span className="text-[9px] text-text-muted/60">{dot.day}</span>
        </div>
      ))}
    </div>
  );
}

export function StreakCard({ streak }: StreakCardProps) {
  const color = getStreakColor(streak.currentStreak);
  const hasStreak = streak.currentStreak > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-4 p-5 rounded-2xl bg-gradient-to-br from-orange-950/40 to-[#13131F] border border-orange-500/15 overflow-hidden"
    >
      {/* Streak count */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium mb-1">
            Daily Streak
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-4xl font-black", color)}>
              {streak.currentStreak}
            </span>
            <span className="text-sm text-text-muted">days</span>
          </div>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-3xl",
          hasStreak ? "bg-orange-500/15 border border-orange-500/25" : "bg-white/5 border border-white/8"
        )}>
          {hasStreak ? "🔥" : "💤"}
        </div>
      </div>

      {/* Progress hint */}
      <p className="text-[11px] text-text-muted leading-relaxed">
        {getStreakLabel(streak.currentStreak)}
      </p>

      {/* Week dots */}
      <WeekDots lastActiveDate={streak.lastActiveDate} />

      {/* Longest streak */}
      {streak.longestStreak > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-white/6">
          <span className="text-[10px] text-text-muted">Personal best</span>
          <span className="text-[10px] font-mono text-orange-400">
            🏆 {streak.longestStreak} days
          </span>
        </div>
      )}
    </motion.div>
  );
}
