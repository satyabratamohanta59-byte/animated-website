import { getHeatmapIntensity, getXPProgress } from "@/lib/utils";

// ─── Dashboard Data Types ─────────────────────────────────

export interface DashboardXP {
  totalXP: number;
  currentLevel: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  lifetimeXP: number;
}

export interface DashboardStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  freezeCount: number;
}

export interface DashboardToday {
  xpEarned: number;
  focusMinutes: number;
  sessionsCount: number;
  goalsCompleted: number;
}

export interface HeatmapEntry {
  date: string;
  minutes: number;
  xpEarned: number;
  sessionsCount: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface DashboardSession {
  id: string;
  createdAt: string;
  plannedMins: number;
  actualMins: number | null;
  focusScore: number | null;
  status: string;
  goalTitle: string | null;
}

export interface DashboardQuest {
  id: string;
  title: string;
  description: string;
  questType: string;
  xpReward: number;
  progress: number;
  targetValue: number;
  isCompleted: boolean;
}

export interface DashboardInsight {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
}

export interface DashboardData {
  user: {
    displayName: string;
    avatarUrl: string | null;
    username: string;
  };
  xp: DashboardXP;
  streak: DashboardStreak;
  today: DashboardToday;
  heatmap: HeatmapEntry[];
  sessions: DashboardSession[];
  quests: DashboardQuest[];
  insight: DashboardInsight | null;
}

// ─── Default / Empty State Data ──────────────────────────

export function getDefaultDashboardData(user: {
  displayName: string;
  avatarUrl: string | null;
  username: string;
}): DashboardData {
  return {
    user,
    xp: {
      totalXP: 0,
      currentLevel: 1,
      xpInCurrentLevel: 0,
      xpToNextLevel: 1000,
      progressPercent: 0,
      lifetimeXP: 0,
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      freezeCount: 0,
    },
    today: {
      xpEarned: 0,
      focusMinutes: 0,
      sessionsCount: 0,
      goalsCompleted: 0,
    },
    heatmap: generateEmptyHeatmap(),
    sessions: [],
    quests: generateDefaultQuests(),
    insight: null,
  };
}

// ─── Data Normalizers ────────────────────────────────────

export function normalizeXP(raw: Record<string, unknown>): DashboardXP {
  const totalXP = Number(raw.total_xp ?? 0);
  const progress = getXPProgress(totalXP);
  return {
    totalXP,
    currentLevel: progress.level,
    xpInCurrentLevel: progress.xpInLevel,
    xpToNextLevel: progress.xpToNextLevel,
    progressPercent: progress.progressPercent,
    lifetimeXP: Number(raw.lifetime_xp ?? totalXP),
  };
}

export function normalizeHeatmap(
  raw: Array<Record<string, unknown>>
): HeatmapEntry[] {
  const dataMap = new Map(
    raw.map((d) => [
      String(d.date),
      {
        minutes: Number(d.minutes ?? 0),
        xpEarned: Number(d.xp_earned ?? 0),
        sessionsCount: Number(d.sessions_count ?? 0),
      },
    ])
  );

  const today = new Date();
  const result: HeatmapEntry[] = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const entry = dataMap.get(dateStr) ?? {
      minutes: 0,
      xpEarned: 0,
      sessionsCount: 0,
    };
    result.push({
      date: dateStr,
      ...entry,
      intensity: getHeatmapIntensity(entry.minutes),
    });
  }

  return result;
}

function generateEmptyHeatmap(): HeatmapEntry[] {
  const today = new Date();
  return Array.from({ length: 365 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (364 - i));
    return {
      date: d.toISOString().split("T")[0],
      minutes: 0,
      xpEarned: 0,
      sessionsCount: 0,
      intensity: 0 as const,
    };
  });
}

function generateDefaultQuests(): DashboardQuest[] {
  return [
    {
      id: "default-1",
      title: "Complete a focus session",
      description: "Start your first Pomodoro or Deep Work session",
      questType: "focus_session",
      xpReward: 100,
      progress: 0,
      targetValue: 1,
      isCompleted: false,
    },
    {
      id: "default-2",
      title: "Create your first note",
      description: "Add a note to your Knowledge Vault",
      questType: "note_created",
      xpReward: 50,
      progress: 0,
      targetValue: 1,
      isCompleted: false,
    },
    {
      id: "default-3",
      title: "Set a goal",
      description: "Add a quest to your board",
      questType: "goal_created",
      xpReward: 75,
      progress: 0,
      targetValue: 1,
      isCompleted: false,
    },
  ];
}

// ─── Quest Icons ─────────────────────────────────────────

export const QUEST_ICONS: Record<string, string> = {
  focus_session:    "⏱",
  note_created:     "📓",
  goal_created:     "🎯",
  goal_completed:   "✅",
  streak_maintained:"🔥",
  xp_earned:        "⚡",
  flashcard_review: "🃏",
  perfect_day:      "⭐",
};

export function getQuestIcon(questType: string): string {
  return QUEST_ICONS[questType] ?? "✨";
}

// ─── Focus Score Formatter ────────────────────────────────

export function formatFocusScore(score: number | null): string {
  if (score === null) return "—";
  return `${score.toFixed(1)}/10`;
}

export function getFocusScoreColor(score: number | null): string {
  if (!score) return "text-text-muted";
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-rose-400";
}
