"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { formatXP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { APP_NAV_ITEMS } from "@/lib/constants";

function getPageMeta(pathname: string): { title: string; icon: string } {
  const item = APP_NAV_ITEMS.find((n) =>
    pathname === "/app/dashboard"
      ? n.href === "/app/dashboard"
      : pathname.startsWith(n.href)
  );
  if (item) return { title: item.label, icon: item.icon };
  if (pathname.startsWith("/app/settings")) return { title: "Settings", icon: "⚙️" };
  return { title: "FocusOS", icon: "⚡" };
}

interface TopbarProps {
  onCommandPalette: () => void;
  onNotifications: () => void;
  notificationCount?: number;
}

export function Topbar({
  onCommandPalette,
  onNotifications,
  notificationCount = 0,
}: TopbarProps) {
  const pathname = usePathname();
  const { totalXP, currentLevel } = useGamificationStore();
  const { soundEnabled, toggleSound } = useUIStore();
  const { title, icon } = getPageMeta(pathname);

  return (
    <header className="flex items-center h-14 px-4 border-b border-white/6 bg-[#0D0D18]/80 backdrop-blur-xl flex-shrink-0 gap-4">
      {/* Page title */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-base">{icon}</span>
        <h1 className="text-sm font-semibold text-text-primary truncate">
          {title}
        </h1>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* XP display */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/8 border border-violet-500/20">
          <span className="text-[10px] font-mono text-violet-400 font-bold">
            Lv {currentLevel}
          </span>
          <div className="w-px h-3 bg-violet-500/30" />
          <span className="text-[10px] font-mono text-violet-300">
            {formatXP(totalXP)} XP
          </span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            soundEnabled
              ? "text-text-secondary hover:text-text-primary hover:bg-white/5"
              : "text-text-muted hover:text-text-secondary hover:bg-white/5"
          )}
          aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          )}
        </button>

        {/* Command palette trigger */}
        <button
          onClick={onCommandPalette}
          className="hidden md:flex items-center gap-2 h-8 px-2.5 rounded-lg bg-white/5 border border-white/8 text-text-muted hover:text-text-secondary hover:bg-white/8 transition-colors text-xs"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Search</span>
          <kbd className="ml-1 text-[9px] font-mono bg-white/8 border border-white/10 px-1 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Search icon (mobile) */}
        <button
          onClick={onCommandPalette}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-white/5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Notifications */}
        <button
          onClick={onNotifications}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </motion.span>
          )}
        </button>

        {/* Clerk user button */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
              userButtonTrigger: "rounded-lg focus:shadow-none focus:outline-none ring-1 ring-white/10 hover:ring-violet-500/40 transition-all",
            },
          }}
        />
      </div>
    </header>
  );
}
