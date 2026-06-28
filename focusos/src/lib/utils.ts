import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

// ─── Class Merging ───────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── XP & Level Calculations ────────────────────────────

export const LEVEL_BASE = 100;
export const LEVEL_EXPONENT = 1.5;

export function xpForLevel(level: number): number {
  return Math.round(LEVEL_BASE * Math.pow(level, LEVEL_EXPONENT) * 10);
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let cumulativeXP = 0;
  while (cumulativeXP + xpForLevel(level) <= totalXP) {
    cumulativeXP += xpForLevel(level);
    level++;
  }
  return level;
}

export function getXPProgress(totalXP: number): {
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
} {
  let level = 1;
  let cumulativeXP = 0;
  while (cumulativeXP + xpForLevel(level) <= totalXP) {
    cumulativeXP += xpForLevel(level);
    level++;
  }
  const xpInLevel = totalXP - cumulativeXP;
  const xpToNextLevel = xpForLevel(level);
  return {
    level,
    xpInLevel,
    xpToNextLevel,
    progressPercent: Math.round((xpInLevel / xpToNextLevel) * 100),
  };
}

export function getLevelTier(level: number): {
  name: string;
  color: string;
  emoji: string;
} {
  if (level <= 10) return { name: "Initiate", color: "#9CA3AF", emoji: "⚪" };
  if (level <= 25) return { name: "Scholar", color: "#34D399", emoji: "🟢" };
  if (level <= 50) return { name: "Seeker", color: "#22D3EE", emoji: "🔵" };
  if (level <= 75) return { name: "Adept", color: "#9F7AEA", emoji: "🟣" };
  if (level <= 100) return { name: "Master", color: "#FBBF24", emoji: "⭐" };
  return { name: "Legendary", color: "#F0F0FF", emoji: "✨" };
}

// ─── Date Utilities ──────────────────────────────────────

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Focus Score Calculation ─────────────────────────────

export function calculateFocusScore(
  plannedMins: number,
  actualMins: number,
  breaksTaken: number,
  expectedBreaks: number
): number {
  const completionRatio = Math.min(actualMins / plannedMins, 1);
  const breakPenalty =
    breaksTaken > expectedBreaks
      ? Math.max(0, 1 - (breaksTaken - expectedBreaks) * 0.1)
      : 1;
  const score = completionRatio * breakPenalty * 10;
  return Math.round(score * 10) / 10;
}

// ─── Heatmap Intensity ───────────────────────────────────

export function getHeatmapIntensity(
  minutes: number
): 0 | 1 | 2 | 3 | 4 {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 90) return 2;
  if (minutes < 180) return 3;
  return 4;
}

// ─── Number Formatting ───────────────────────────────────

export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`;
  return xp.toString();
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

// ─── Color Utilities ─────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  study: "#7C3AED",
  workout: "#34D399",
  reading: "#22D3EE",
  meditation: "#A78BFA",
  sleep: "#6366F1",
  nutrition: "#FBBF24",
  custom: "#9898B8",
};

export const CATEGORY_ICONS: Record<string, string> = {
  study: "📚",
  workout: "💪",
  reading: "📖",
  meditation: "🧘",
  sleep: "😴",
  nutrition: "🥗",
  custom: "⭐",
};

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Array Utilities ─────────────────────────────────────

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function groupBy<T>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = String(item[key]);
      return {
        ...groups,
        [group]: [...(groups[group] || []), item],
      };
    },
    {} as Record<string, T[]>
  );
}

// ─── String Utilities ────────────────────────────────────

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Debounce ────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// ─── Local Storage with type-safety ─────────────────────

export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked
  }
}
