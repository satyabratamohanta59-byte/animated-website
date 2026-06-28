"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DashboardInsight } from "@/lib/dashboard";

interface AIInsightCardProps {
  insight: DashboardInsight | null;
}

const INSIGHT_CONFIG: Record<string, { icon: string; gradient: string; accent: string }> = {
  performance: {
    icon: "📊",
    gradient: "from-violet-950/60 to-[#13131F]",
    accent: "border-violet-500/20",
  },
  motivation: {
    icon: "🔥",
    gradient: "from-orange-950/50 to-[#13131F]",
    accent: "border-orange-500/20",
  },
  suggestion: {
    icon: "💡",
    gradient: "from-amber-950/40 to-[#13131F]",
    accent: "border-amber-500/20",
  },
  warning: {
    icon: "⚠️",
    gradient: "from-rose-950/40 to-[#13131F]",
    accent: "border-rose-500/20",
  },
  achievement: {
    icon: "🏆",
    gradient: "from-amber-950/50 to-[#13131F]",
    accent: "border-amber-400/25",
  },
};

const DEFAULT_INSIGHT = {
  title: "Your AI Oracle is ready",
  content:
    "Complete a few focus sessions and I'll start analyzing your productivity patterns to give you personalized insights.",
  type: "suggestion",
};

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const router = useRouter();
  const data = insight ?? DEFAULT_INSIGHT;
  const config = INSIGHT_CONFIG[data.type] ?? INSIGHT_CONFIG.suggestion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className={cn(
        "relative flex flex-col gap-4 p-5 rounded-2xl overflow-hidden",
        `bg-gradient-to-br ${config.gradient}`,
        `border ${config.accent}`
      )}
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
        <svg viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="48" fill="currentColor" className="text-violet-400" />
        </svg>
      </div>

      {/* AI badge */}
      <div className="relative flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm">
          🤖
        </div>
        <span className="text-[10px] uppercase tracking-widest font-medium text-violet-400">
          AI Oracle
        </span>
        {insight && !insight.isRead && (
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 ml-auto" />
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <span className="text-xl flex-shrink-0">{config.icon}</span>
          <h4 className="text-sm font-bold text-text-primary leading-tight">
            {data.title}
          </h4>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          {data.content}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/app/coach")}
        className="relative text-[11px] font-semibold text-violet-300 hover:text-violet-200 transition-colors flex items-center gap-1 self-start"
      >
        {insight ? "View full insight" : "Talk to AI Oracle"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </motion.div>
  );
}
