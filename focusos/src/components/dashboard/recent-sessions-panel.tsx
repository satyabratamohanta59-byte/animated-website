"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatDuration } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animation/variants";
import { formatFocusScore, getFocusScoreColor, type DashboardSession } from "@/lib/dashboard";

interface RecentSessionsPanelProps {
  sessions: DashboardSession[];
}

const STATUS_CONFIG = {
  completed: { label: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  abandoned: { label: "Abandoned", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  active:    { label: "Active",    color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  paused:    { label: "Paused",    color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
} as const;

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60)   return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days === 1)     return "yesterday";
  return `${days}d ago`;
}

function SessionRow({ session, index }: { session: DashboardSession; index: number }) {
  const statusKey = session.status as keyof typeof STATUS_CONFIG;
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.completed;
  const scoreColor = getFocusScoreColor(session.focusScore);
  const actualMins = session.actualMins ?? session.plannedMins;
  const completion = Math.round((actualMins / session.plannedMins) * 100);

  return (
    <motion.div
      variants={staggerItemVariants}
      className="flex items-center gap-4 py-3 border-b border-white/4 last:border-0 group"
    >
      {/* Session icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm">
        ⏱
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-text-primary truncate">
            {session.goalTitle ?? "Focus Session"}
          </p>
          <span className={cn(
            "flex-shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-full border",
            status.color
          )}>
            {status.label}
          </span>
        </div>
        <p className="text-[10px] text-text-muted mt-0.5">
          {formatDuration(actualMins)} · {timeAgo(session.createdAt)}
        </p>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 flex items-center gap-4">
        {/* Completion */}
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-text-secondary">{completion}%</p>
          <p className="text-[9px] text-text-muted">done</p>
        </div>

        {/* Focus score */}
        <div className="text-right">
          <p className={cn("text-xs font-semibold", scoreColor)}>
            {formatFocusScore(session.focusScore)}
          </p>
          <p className="text-[9px] text-text-muted">score</p>
        </div>
      </div>
    </motion.div>
  );
}

export function RecentSessionsPanel({ sessions }: RecentSessionsPanelProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-4 p-5 rounded-2xl bg-[#13131F] border border-white/6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium mb-0.5">
            Recent Sessions
          </p>
          <h3 className="text-sm font-bold text-text-primary">
            Focus History
          </h3>
        </div>
        <button
          onClick={() => router.push("/app/analytics")}
          className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          View all
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Sessions */}
      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-3xl">
            ⏱
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">No sessions yet</p>
            <p className="text-[11px] text-text-muted mt-1">
              Start your first focus session to see your history here.
            </p>
          </div>
          <button
            onClick={() => router.push("/app/focus")}
            className="px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/25 text-xs font-semibold text-violet-300 hover:bg-violet-500/25 transition-colors"
          >
            Start Focus Session
          </button>
        </div>
      ) : (
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {sessions.map((session, i) => (
            <SessionRow key={session.id} session={session} index={i} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
