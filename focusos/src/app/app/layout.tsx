"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import {
  NotificationPanel,
  type Notification,
} from "@/components/layout/notification-panel";
import { useGamificationStore } from "@/stores/gamification-store";
import { formatXP, getLevelTier } from "@/lib/utils";

// ── XP Float Overlay ──────────────────────────────────────────

function XPOverlay() {
  const { pendingXPAnimations } = useGamificationStore();

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none flex flex-col-reverse gap-2">
      <AnimatePresence>
        {pendingXPAnimations.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 backdrop-blur-md shadow-lg"
          >
            <span className="text-sm">⚡</span>
            <span className="text-sm font-bold text-violet-300">
              +{formatXP(anim.amount)} XP
            </span>
            {anim.source && (
              <span className="text-[10px] text-violet-400/70 capitalize">
                {anim.source.replace(/_/g, " ")}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Level Up Modal ─────────────────────────────────────────────

function LevelUpModal() {
  const { pendingLevelUp, clearLevelUp } = useGamificationStore();

  if (!pendingLevelUp) return null;
  const tier = getLevelTier(pendingLevelUp.newLevel);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={clearLevelUp}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-violet-950 to-[#13131F] border border-violet-500/30 shadow-2xl text-center max-w-sm mx-4"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-violet-500/5 blur-xl" />

          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl"
          >
            {tier.emoji}
          </motion.div>

          <div>
            <p className="text-xs uppercase tracking-widest text-violet-400 font-medium mb-1">
              Level Up!
            </p>
            <h2 className="text-3xl font-black text-text-primary">
              Level {pendingLevelUp.newLevel}
            </h2>
            <p className="text-sm text-violet-300 mt-1 font-medium">
              {tier.name}
            </p>
          </div>

          <p className="text-sm text-text-muted">
            You&apos;ve reached a new level of mastery. Keep pushing.
          </p>

          <button
            onClick={clearLevelUp}
            className="mt-2 px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── App Shell Layout ───────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "welcome",
      type: "system",
      title: "Welcome to FocusOS",
      body: "Your AI-powered productivity OS is ready. Start your first focus session to earn XP!",
      icon: "⚡",
      timestamp: new Date(),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global keyboard shortcut: Cmd/Ctrl+K
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCommandPaletteOpen((open) => !open);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-[#080810]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          onCommandPalette={() => setCommandPaletteOpen(true)}
          onNotifications={() => setNotificationPanelOpen(true)}
          notificationCount={unreadCount}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Notification panel */}
      <NotificationPanel
        open={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onDismiss={handleDismiss}
      />

      {/* XP floating animations */}
      <XPOverlay />

      {/* Level up modal */}
      <LevelUpModal />
    </div>
  );
}
