"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { getLevelTier, formatXP } from "@/lib/utils";
import { ProgressRing } from "@/components/motion/progress-ring";
import { cn } from "@/lib/utils";
import { sidebarVariants } from "@/lib/animation/variants";

const NAV_ICONS: Record<string, React.ReactNode> = {
  "⚡": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  "⏱": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  "📓": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  "🎯": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  "📊": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  "🏆": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h1.5M17 4h3a2 2 0 0 1 2 2v3c0 1.1-.9 2-2 2h-1.5"/><rect x="7" y="2" width="10" height="11" rx="2"/>
    </svg>
  ),
  "🤖": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const {
    totalXP,
    currentLevel,
    xpInCurrentLevel,
    xpToNextLevel,
    progressPercent,
    currentStreak,
  } = useGamificationStore();

  const tier = getLevelTier(currentLevel);

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={sidebarCollapsed ? "collapsed" : "expanded"}
      initial={false}
      className={cn(
        "relative flex flex-col h-full",
        "bg-[#0D0D18] border-r border-white/6",
        "overflow-hidden z-10"
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/6">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-sm font-bold shadow-[0_0_16px_rgba(124,58,237,0.5)]">
            ⚡
          </div>
        </div>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.05 } }}
              exit={{ opacity: 0, x: -8 }}
              className="flex-1 min-w-0"
            >
              <div className="font-bold text-sm text-text-primary tracking-tight">FocusOS</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">OS v1.0</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/8 transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {sidebarCollapsed ? (
              <path d="M9 18l6-6-6-6"/>
            ) : (
              <path d="M15 18l-6-6 6-6"/>
            )}
          </svg>
        </button>
      </div>

      {/* ── User XP Card ── */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-3"
          >
            <div className="rounded-xl bg-gradient-to-br from-violet-950/60 to-[#13131F] border border-violet-500/20 p-3">
              <div className="flex items-center gap-3">
                <ProgressRing
                  progress={progressPercent}
                  size={40}
                  strokeWidth={3}
                  color="#7C3AED"
                  trackColor="rgba(124,58,237,0.15)"
                  animate
                >
                  <span className="text-[10px] font-bold text-violet-300">
                    {currentLevel}
                  </span>
                </ProgressRing>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">
                      {tier.emoji} {tier.name}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      Lv {currentLevel}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted font-mono mt-0.5">
                    {formatXP(xpInCurrentLevel)} / {formatXP(xpToNextLevel)} XP
                  </div>
                  {/* Mini XP bar */}
                  <div className="mt-1.5 h-1 rounded-full bg-white/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    />
                  </div>
                </div>
              </div>

              {/* Streak */}
              {currentStreak > 0 && (
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/6">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs text-orange-400 font-semibold">
                    {currentStreak} day streak
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed: mini user avatar */}
      {sidebarCollapsed && (
        <div className="flex justify-center mt-3">
          <ProgressRing
            progress={progressPercent}
            size={36}
            strokeWidth={2.5}
            color="#7C3AED"
            trackColor="rgba(124,58,237,0.15)"
          >
            <span className="text-[9px] font-bold text-violet-300">{currentLevel}</span>
          </ProgressRing>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 hide-scrollbar">
        {!sidebarCollapsed && (
          <p className="px-2 mb-2 text-[10px] uppercase tracking-wider text-text-muted font-medium">
            Navigation
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {APP_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/app/dashboard"
                ? pathname === "/app/dashboard"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-2.5 py-2",
                      "transition-colors duration-150 group",
                      "cursor-pointer select-none",
                      isActive
                        ? "bg-violet-500/12 text-violet-300 border border-violet-500/25"
                        : "text-text-muted hover:text-text-secondary hover:bg-white/5 border border-transparent"
                    )}
                    whileHover={{ x: isActive ? 0 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-violet-500"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}

                    {/* Icon */}
                    <span className={cn(
                      "flex-shrink-0 w-4 h-4",
                      isActive ? "text-violet-400" : "text-text-muted group-hover:text-text-secondary",
                      sidebarCollapsed && "mx-auto"
                    )}>
                      {NAV_ICONS[item.icon] ?? item.icon}
                    </span>

                    {/* Label */}
                    <AnimatePresence mode="wait">
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.05 } }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium flex-1 truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer ── */}
      <div className="px-2 pb-3 border-t border-white/6 pt-2">
        <Link href="/app/settings">
          <div className={cn(
            "flex items-center gap-3 rounded-lg px-2.5 py-2",
            "text-text-muted hover:text-text-secondary hover:bg-white/5",
            "transition-colors duration-150 cursor-pointer",
            sidebarCollapsed && "justify-center"
          )}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            {!sidebarCollapsed && (
              <span className="text-xs">Settings</span>
            )}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
