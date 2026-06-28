"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sheetRightVariants, backdropVariants } from "@/lib/animation/variants";

export interface Notification {
  id: string;
  type: "xp" | "achievement" | "streak" | "quest" | "system";
  title: string;
  body: string;
  icon: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const TYPE_COLORS: Record<Notification["type"], string> = {
  xp: "text-violet-400 bg-violet-500/12 border-violet-500/20",
  achievement: "text-amber-400 bg-amber-500/12 border-amber-500/20",
  streak: "text-orange-400 bg-orange-500/12 border-orange-500/20",
  quest: "text-cyan-400 bg-cyan-500/12 border-cyan-500/20",
  system: "text-text-secondary bg-white/5 border-white/10",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationPanel({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onDismiss,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30"
          />
          <motion.div
            variants={sheetRightVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed right-0 top-0 bottom-0 z-40 w-80 bg-[#0D0D18] border-l border-white/6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/6">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-[11px] text-text-muted">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl">
                    🔔
                  </div>
                  <p className="text-sm">All caught up!</p>
                  <p className="text-[11px] text-center px-8">
                    Achievements, XP gains, and quest updates will appear here.
                  </p>
                </div>
              ) : (
                <div className="p-3 flex flex-col gap-1.5">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        "relative flex gap-3 p-3 rounded-xl border transition-colors",
                        notif.read
                          ? "bg-white/2 border-white/5 opacity-60"
                          : "bg-white/4 border-white/8"
                      )}
                    >
                      {/* Unread dot */}
                      {!notif.read && (
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-violet-500" />
                      )}

                      {/* Icon */}
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm border",
                        TYPE_COLORS[notif.type]
                      )}>
                        {notif.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs font-semibold text-text-primary leading-tight">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                          {notif.body}
                        </p>
                        <p className="text-[10px] text-text-muted/60 mt-1">
                          {timeAgo(notif.timestamp)}
                        </p>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => onDismiss(notif.id)}
                        className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center text-text-muted/40 hover:text-text-muted hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
