export * from "./database";

// ─── Onboarding ─────────────────────────────────────────

export interface OnboardingAnswers {
  goal: "study" | "work" | "both" | "life";
  exam: string | null;
  academic_level:
    | "school"
    | "college"
    | "postgrad"
    | "professional"
    | "other";
  weak_subjects: string[];
  focus_duration: 15 | 30 | 50 | 90;
  peak_hours: "morning" | "afternoon" | "evening" | "night";
  motivation_type: "streaks" | "leaderboards" | "personal" | "rewards";
  daily_hours: 1 | 2 | 3 | 4 | 5 | 6;
  sleep_schedule: "early" | "normal" | "late" | "irregular";
  wellness_habits: Array<"workout" | "meditation" | "reading" | "none">;
}

export interface PersonalizationOutput {
  recommended_schedule: Array<{
    day: string;
    sessions: Array<{ subject: string; duration: number; time: string }>;
  }>;
  initial_goals: Array<{
    title: string;
    category: string;
    target_value: number;
    target_unit: string;
    xp_reward: number;
  }>;
  ai_study_plan: string;
  welcome_message: string;
  focus_session_minutes: number;
  break_minutes: number;
}

// ─── Navigation ─────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  isNew?: boolean;
}

// ─── Focus Session (Client State) ───────────────────────

export type TimerStatus = "idle" | "running" | "paused" | "break" | "completed";

export interface ActiveSession {
  id: string;
  status: TimerStatus;
  plannedMins: number;
  remainingSeconds: number;
  breakRemainingSeconds: number;
  breakMins: number;
  ambientSound: AmbientSound | null;
  goalId: string | null;
  startedAt: Date;
  sessionsCompleted: number;
}

export type AmbientSound =
  | "rain"
  | "forest"
  | "cafe"
  | "ocean"
  | "thunder"
  | "fireplace"
  | "lofi"
  | "white-noise"
  | "brown-noise"
  | "alpha-waves"
  | "beta-waves";

export interface AmbientSoundConfig {
  id: AmbientSound;
  label: string;
  emoji: string;
  category: "nature" | "environment" | "music" | "binaural";
}

// ─── Gamification (Client State) ────────────────────────

export interface XPAnimation {
  id: string;
  amount: number;
  source: string;
  triggeredAt: Date;
}

export interface LevelUpEvent {
  previousLevel: number;
  newLevel: number;
  tierName: string;
  unlockedFeatures: string[];
}

export interface LevelTier {
  name: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  emoji: string;
  xpRange: [number, number];
}

// ─── Analytics ──────────────────────────────────────────

export interface HeatmapDay {
  date: string;
  minutes: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface WeeklyStats {
  week: string;
  total_focus_minutes: number;
  sessions_count: number;
  goals_completed: number;
  xp_earned: number;
  avg_focus_score: number;
}

export interface ProductivityScore {
  score: number;
  breakdown: {
    focus: number;
    consistency: number;
    goals: number;
    growth: number;
  };
  trend: "up" | "down" | "stable";
  percentile: number;
}

// ─── AI Coach ───────────────────────────────────────────

export interface CoachInsight {
  id: string;
  type: import("./database").InsightType;
  title: string;
  content: string;
  confidence: number;
  action?: {
    label: string;
    href: string;
  };
  priority: "high" | "medium" | "low";
  is_read: boolean;
  created_at: string;
}

// ─── Notes Editor ───────────────────────────────────────

export interface NoteBlock {
  type: string;
  content?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export interface FlashcardPair {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

// ─── UI ─────────────────────────────────────────────────

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "xp" | "achievement";
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  component: string | null;
  props?: Record<string, unknown>;
}

// ─── API Responses ───────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface XPAwardResult {
  xp: number;
  new_total: number;
  new_level: number;
  leveled_up: boolean;
  achievements_unlocked: string[];
}
