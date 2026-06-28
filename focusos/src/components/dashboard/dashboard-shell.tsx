"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGamificationStore } from "@/stores/gamification-store";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animation/variants";
import { formatDuration, formatXP } from "@/lib/utils";
import { GreetingHeader } from "./greeting-header";
import { StatCard } from "./stat-card";
import { XPLevelCard } from "./xp-level-card";
import { StreakCard } from "./streak-card";
import { QuickStartCard } from "./quick-start-card";
import { ActivityHeatmap } from "./activity-heatmap";
import { DailyQuestsPanel } from "./daily-quests-panel";
import { RecentSessionsPanel } from "./recent-sessions-panel";
import { AIInsightCard } from "./ai-insight-card";
import type { DashboardData } from "@/lib/dashboard";

interface DashboardShellProps {
  data: DashboardData;
}

export function DashboardShell({ data }: DashboardShellProps) {
  const { setXPData, setStreak } = useGamificationStore();

  // Sync server-fetched XP data into the Zustand store
  useEffect(() => {
    setXPData({
      totalXP:          data.xp.totalXP,
      currentLevel:     data.xp.currentLevel,
      xpInCurrentLevel: data.xp.xpInCurrentLevel,
      xpToNextLevel:    data.xp.xpToNextLevel,
    });
    setStreak(data.streak.currentStreak, data.streak.longestStreak);
  }, [data.xp, data.streak, setXPData, setStreak]);

  const totalFocusMinutes = data.heatmap.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="min-h-full p-6 flex flex-col gap-6">

      {/* ── Greeting ────────────────────────────────────── */}
      <GreetingHeader
        displayName={data.user.displayName}
        avatarUrl={data.user.avatarUrl}
        today={data.today}
      />

      {/* ── Stats Row ───────────────────────────────────── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <StatCard
          label="Today's XP"
          value={`+${formatXP(data.today.xpEarned)}`}
          subValue={data.today.xpEarned === 0 ? "Let's go!" : "earned today"}
          icon="⚡"
          accent="violet"
          delay={0.05}
        />
        <StatCard
          label="Focus Time"
          value={data.today.focusMinutes >= 60
            ? `${Math.floor(data.today.focusMinutes / 60)}h ${data.today.focusMinutes % 60}m`
            : `${data.today.focusMinutes}m`
          }
          subValue={data.today.sessionsCount > 0
            ? `${data.today.sessionsCount} session${data.today.sessionsCount > 1 ? "s" : ""}`
            : "No sessions yet"
          }
          icon="⏱"
          accent="cyan"
          delay={0.1}
        />
        <StatCard
          label="Goals Done"
          value={String(data.today.goalsCompleted)}
          subValue={data.today.goalsCompleted === 0 ? "Set some goals!" : "completed today"}
          icon="🎯"
          accent="emerald"
          delay={0.15}
        />
        <StatCard
          label="Current Streak"
          value={`${data.streak.currentStreak}`}
          subValue={data.streak.currentStreak === 1
            ? "1 day — keep it up!"
            : data.streak.currentStreak > 0
            ? `${data.streak.currentStreak} days strong 🔥`
            : "Start today!"
          }
          icon={data.streak.currentStreak > 0 ? "🔥" : "💤"}
          accent="orange"
          delay={0.2}
        />
      </motion.div>

      {/* ── Main Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Left column: XP + Heatmap */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* XP + Quick Start row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <XPLevelCard xp={data.xp} />
            </div>
            <div className="md:col-span-3">
              <QuickStartCard />
            </div>
          </div>

          {/* Activity Heatmap */}
          <ActivityHeatmap
            data={data.heatmap}
            totalFocusMinutes={totalFocusMinutes}
          />
        </div>

        {/* Right column: Streak + Quests + AI Insight */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <StreakCard streak={data.streak} />
          <DailyQuestsPanel quests={data.quests} />
          <AIInsightCard insight={data.insight} />
        </div>
      </div>

      {/* ── Recent Sessions (full width) ────────────────── */}
      <RecentSessionsPanel sessions={data.sessions} />
    </div>
  );
}
