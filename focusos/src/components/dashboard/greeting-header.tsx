"use client";

import { motion } from "framer-motion";
import { fadeInUpVariants } from "@/lib/animation/variants";
import { formatXP } from "@/lib/utils";
import type { DashboardToday } from "@/lib/dashboard";

interface GreetingHeaderProps {
  displayName: string;
  avatarUrl: string | null;
  today: DashboardToday;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5)  return "Burning midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Working late";
}

function getMotivation(todayMinutes: number): string {
  if (todayMinutes === 0) return "Let's make today count. Start a focus session.";
  if (todayMinutes < 30)  return "You've started! Keep the momentum going.";
  if (todayMinutes < 60)  return "Solid progress — you're building a habit.";
  if (todayMinutes < 120) return "Great focus today. You're in flow state territory.";
  if (todayMinutes < 180) return "Outstanding session! You're crushing it.";
  return "Elite-level focus. You're in the top 1% today.";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatToday(): string {
  const d = new Date();
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function GreetingHeader({ displayName, today }: GreetingHeaderProps) {
  const firstName = displayName.split(" ")[0] || displayName;

  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
    >
      <div>
        <p className="text-xs text-text-muted uppercase tracking-widest font-medium mb-1">
          {formatToday()}
        </p>
        <h1 className="text-2xl font-black text-text-primary tracking-tight">
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {firstName}
          </span>
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {getMotivation(today.focusMinutes)}
        </p>
      </div>

      {/* Today's mini summary */}
      {today.xpEarned > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <span className="text-sm">⚡</span>
            <span className="text-xs font-semibold text-violet-300">
              +{formatXP(today.xpEarned)} XP today
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
