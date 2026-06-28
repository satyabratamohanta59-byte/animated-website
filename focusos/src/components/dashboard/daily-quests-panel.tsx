"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animation/variants";
import { getQuestIcon, type DashboardQuest } from "@/lib/dashboard";

interface DailyQuestsPanelProps {
  quests: DashboardQuest[];
}

function QuestItem({ quest, index }: { quest: DashboardQuest; index: number }) {
  const progressPercent = quest.targetValue > 0
    ? Math.min((quest.progress / quest.targetValue) * 100, 100)
    : quest.isCompleted ? 100 : 0;

  const icon = getQuestIcon(quest.questType);

  return (
    <motion.div
      variants={staggerItemVariants}
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl border transition-colors",
        quest.isCompleted
          ? "bg-emerald-500/5 border-emerald-500/15 opacity-70"
          : "bg-white/3 border-white/6 hover:bg-white/5"
      )}
    >
      {/* Icon + completion status */}
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg border",
        quest.isCompleted
          ? "bg-emerald-500/15 border-emerald-500/25"
          : "bg-white/5 border-white/8"
      )}>
        {quest.isCompleted ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            ✅
          </motion.span>
        ) : icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-xs font-semibold leading-tight",
            quest.isCompleted ? "text-emerald-400 line-through opacity-60" : "text-text-primary"
          )}>
            {quest.title}
          </p>
          <span className="flex-shrink-0 text-[10px] font-mono text-violet-400 font-semibold">
            +{quest.xpReward} XP
          </span>
        </div>

        {quest.description && (
          <p className="text-[10px] text-text-muted mt-0.5 truncate">
            {quest.description}
          </p>
        )}

        {/* Progress bar */}
        {quest.targetValue > 1 && !quest.isCompleted && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-muted">
                {quest.progress}/{quest.targetValue}
              </span>
              <span className="text-[10px] text-text-muted">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.19, 1, 0.22, 1] }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function DailyQuestsPanel({ quests }: DailyQuestsPanelProps) {
  const router = useRouter();
  const completedCount = quests.filter((q) => q.isCompleted).length;
  const totalXP = quests.reduce((sum, q) => sum + (q.isCompleted ? q.xpReward : 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-4 p-5 rounded-2xl bg-[#13131F] border border-white/6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium mb-0.5">
            Daily Quests
          </p>
          <h3 className="text-sm font-bold text-text-primary">
            {completedCount}/{quests.length} complete
          </h3>
        </div>
        {totalXP > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <span className="text-xs">⚡</span>
            <span className="text-[10px] font-mono font-bold text-violet-300">+{totalXP} XP</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {quests.length > 0 && (
        <div className="h-1 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / quests.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          />
        </div>
      )}

      {/* Quest list */}
      {quests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
          <span className="text-3xl">🎯</span>
          <p className="text-sm text-text-muted">No quests today yet</p>
          <p className="text-[11px] text-text-muted/60">
            Complete actions to unlock daily quests
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          <AnimatePresence>
            {quests.map((quest, i) => (
              <QuestItem key={quest.id} quest={quest} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* View all */}
      <button
        onClick={() => router.push("/app/goals")}
        className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors text-center pt-1"
      >
        View Quest Board →
      </button>
    </motion.div>
  );
}
