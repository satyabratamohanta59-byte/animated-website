"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { backdropVariants, modalVariants } from "@/lib/animation/variants";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: "navigation" | "action" | "recent";
}

const NAV_ICON_MAP: Record<string, React.ReactNode> = {
  "⚡": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  "⏱": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  "📓": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  "🎯": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  "📊": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  "🏆": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><rect x="7" y="2" width="10" height="11" rx="2"/></svg>,
  "🤖": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>,
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navItems: CommandItem[] = APP_NAV_ITEMS.map((item) => ({
    id: item.href,
    label: item.label,
    icon: NAV_ICON_MAP[item.icon] ?? <span>{item.icon}</span>,
    category: "navigation" as const,
    action: () => {
      router.push(item.href);
      onClose();
    },
  }));

  const actionItems: CommandItem[] = [
    {
      id: "new-note",
      label: "New Note",
      description: "Create a new knowledge vault entry",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
      shortcut: "⌘N",
      category: "action",
      action: () => { router.push("/app/notes?new=1"); onClose(); },
    },
    {
      id: "start-focus",
      label: "Start Focus Session",
      description: "Launch the Focus Engine timer",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      ),
      shortcut: "⌘F",
      category: "action",
      action: () => { router.push("/app/focus"); onClose(); },
    },
    {
      id: "new-goal",
      label: "New Goal",
      description: "Add a quest to your board",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      category: "action",
      action: () => { router.push("/app/goals?new=1"); onClose(); },
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      category: "action",
      action: () => { router.push("/app/settings"); onClose(); },
    },
  ];

  const allItems = [...navItems, ...actionItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const groupedItems = {
    navigation: filteredItems.filter((i) => i.category === "navigation"),
    action: filteredItems.filter((i) => i.category === "action"),
  };

  const flatFiltered = [
    ...groupedItems.navigation,
    ...groupedItems.action,
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flatFiltered[selectedIndex]) {
        flatFiltered[selectedIndex].action();
      }
    },
    [open, flatFiltered, selectedIndex, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  let itemIndex = 0;

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full max-w-lg bg-[#13131F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted flex-shrink-0">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, pages, actions..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                />
                <kbd className="text-[10px] font-mono text-text-muted bg-white/5 border border-white/8 px-1.5 py-0.5 rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {flatFiltered.length === 0 ? (
                  <div className="py-8 text-center text-text-muted text-sm">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <>
                    {groupedItems.navigation.length > 0 && (
                      <div className="mb-1">
                        {!query && (
                          <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-text-muted font-medium">
                            Navigation
                          </p>
                        )}
                        {groupedItems.navigation.map((item) => {
                          const idx = itemIndex++;
                          return (
                            <CommandItem
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === idx}
                              onSelect={() => { setSelectedIndex(idx); item.action(); }}
                            />
                          );
                        })}
                      </div>
                    )}
                    {groupedItems.action.length > 0 && (
                      <div>
                        {!query && (
                          <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-text-muted font-medium">
                            Actions
                          </p>
                        )}
                        {groupedItems.action.map((item) => {
                          const idx = itemIndex++;
                          return (
                            <CommandItem
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === idx}
                              onSelect={() => { setSelectedIndex(idx); item.action(); }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/6 text-[10px] text-text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-white/5 border border-white/8 px-1 rounded">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-white/5 border border-white/8 px-1 rounded">↵</kbd>
                    select
                  </span>
                </div>
                <span>FocusOS Command</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandItem({
  item,
  isSelected,
  onSelect,
}: {
  item: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
        isSelected
          ? "bg-violet-500/12 text-violet-300"
          : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
      )}
    >
      <span className={cn(
        "flex-shrink-0 w-5 h-5 flex items-center justify-center",
        isSelected ? "text-violet-400" : "text-text-muted"
      )}>
        {item.icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="text-sm font-medium block truncate">{item.label}</span>
        {item.description && (
          <span className="text-[11px] text-text-muted block truncate">{item.description}</span>
        )}
      </span>
      {item.shortcut && (
        <kbd className="flex-shrink-0 text-[9px] font-mono text-text-muted bg-white/5 border border-white/8 px-1.5 py-0.5 rounded">
          {item.shortcut}
        </kbd>
      )}
    </button>
  );
}
