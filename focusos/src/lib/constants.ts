import type { AmbientSoundConfig, LevelTier } from "@/types";

// ─── XP Values ───────────────────────────────────────────

export const XP_VALUES = {
  focus_session_complete: 150,
  focus_session_partial: 50,
  goal_complete_daily: 75,
  goal_streak_7: 200,
  goal_streak_30: 500,
  note_created: 20,
  flashcard_reviewed: 5,
  daily_quest_complete: 100,
  weekly_quest_complete: 300,
  achievement_unlocked: 0, // varies per achievement
  streak_maintained: 25,
  streak_milestone_7: 100,
  streak_milestone_30: 500,
  streak_milestone_100: 2000,
  perfect_day: 250,
  onboarding_complete: 500,
  first_session: 50,
} as const;

// ─── Level Tiers ─────────────────────────────────────────

export const LEVEL_TIERS: LevelTier[] = [
  {
    name: "Initiate",
    minLevel: 1,
    maxLevel: 10,
    color: "#9CA3AF",
    emoji: "⚪",
    xpRange: [0, 15000],
  },
  {
    name: "Scholar",
    minLevel: 11,
    maxLevel: 25,
    color: "#34D399",
    emoji: "🟢",
    xpRange: [15000, 50000],
  },
  {
    name: "Seeker",
    minLevel: 26,
    maxLevel: 50,
    color: "#22D3EE",
    emoji: "🔵",
    xpRange: [50000, 150000],
  },
  {
    name: "Adept",
    minLevel: 51,
    maxLevel: 75,
    color: "#9F7AEA",
    emoji: "🟣",
    xpRange: [150000, 400000],
  },
  {
    name: "Master",
    minLevel: 76,
    maxLevel: 100,
    color: "#FBBF24",
    emoji: "⭐",
    xpRange: [400000, 1000000],
  },
  {
    name: "Legendary",
    minLevel: 101,
    maxLevel: 999,
    color: "#F0F0FF",
    emoji: "✨",
    xpRange: [1000000, Infinity],
  },
];

// ─── Ambient Sounds ──────────────────────────────────────

export const AMBIENT_SOUNDS: AmbientSoundConfig[] = [
  { id: "rain", label: "Rain", emoji: "🌧️", category: "nature" },
  { id: "forest", label: "Forest", emoji: "🌲", category: "nature" },
  { id: "ocean", label: "Ocean Waves", emoji: "🌊", category: "nature" },
  { id: "thunder", label: "Thunderstorm", emoji: "⛈️", category: "nature" },
  { id: "fireplace", label: "Fireplace", emoji: "🔥", category: "nature" },
  { id: "cafe", label: "Coffee Shop", emoji: "☕", category: "environment" },
  { id: "lofi", label: "Lo-Fi Music", emoji: "🎵", category: "music" },
  { id: "white-noise", label: "White Noise", emoji: "🌀", category: "binaural" },
  { id: "brown-noise", label: "Brown Noise", emoji: "🟫", category: "binaural" },
  { id: "alpha-waves", label: "Alpha Waves (Learning)", emoji: "🧠", category: "binaural" },
  { id: "beta-waves", label: "Beta Waves (Focus)", emoji: "⚡", category: "binaural" },
];

// ─── Focus Session Presets ───────────────────────────────

export const SESSION_PRESETS = [
  { label: "Pomodoro", focusMins: 25, breakMins: 5, icon: "🍅" },
  { label: "Deep Work", focusMins: 50, breakMins: 10, icon: "⚡" },
  { label: "Flow State", focusMins: 90, breakMins: 20, icon: "🌊" },
  { label: "Quick Sprint", focusMins: 15, breakMins: 3, icon: "🏃" },
] as const;

// ─── Achievement Definitions ─────────────────────────────

export const ACHIEVEMENT_DEFINITIONS = [
  // Streak achievements
  { slug: "streak-3", title: "First Flame", description: "Maintain a 3-day streak", icon: "🔥", rarity: "common", xp_reward: 50, category: "streak", condition_type: "streak_count", condition_value: { count: 3 } },
  { slug: "streak-7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", rarity: "common", xp_reward: 100, category: "streak", condition_type: "streak_count", condition_value: { count: 7 } },
  { slug: "streak-14", title: "Fortnight Force", description: "Maintain a 14-day streak", icon: "🔥", rarity: "rare", xp_reward: 250, category: "streak", condition_type: "streak_count", condition_value: { count: 14 } },
  { slug: "streak-30", title: "Month Master", description: "Maintain a 30-day streak", icon: "🔥", rarity: "rare", xp_reward: 500, category: "streak", condition_type: "streak_count", condition_value: { count: 30 } },
  { slug: "streak-100", title: "Century Sage", description: "Maintain a 100-day streak", icon: "🔥", rarity: "epic", xp_reward: 2000, category: "streak", condition_type: "streak_count", condition_value: { count: 100 } },
  { slug: "streak-365", title: "Eternal Flame", description: "Maintain a 365-day streak", icon: "🔥", rarity: "legendary", xp_reward: 10000, category: "streak", condition_type: "streak_count", condition_value: { count: 365 } },

  // Focus achievements
  { slug: "focus-first", title: "First Focus", description: "Complete your first focus session", icon: "⏱", rarity: "common", xp_reward: 50, category: "focus", condition_type: "session_count", condition_value: { count: 1 } },
  { slug: "focus-100", title: "Iron Focus", description: "Complete 100 focus sessions", icon: "⏱", rarity: "rare", xp_reward: 300, category: "focus", condition_type: "session_count", condition_value: { count: 100 } },
  { slug: "focus-500", title: "Flow State God", description: "Complete 500 focus sessions", icon: "⏱", rarity: "epic", xp_reward: 1000, category: "focus", condition_type: "session_count", condition_value: { count: 500 } },
  { slug: "focus-1000h", title: "Chronos", description: "Accumulate 1000 hours of total focus", icon: "⏱", rarity: "legendary", xp_reward: 5000, category: "focus", condition_type: "total_minutes", condition_value: { minutes: 60000 } },

  // Goal achievements
  { slug: "goal-first", title: "First Quest", description: "Complete your first goal", icon: "🎯", rarity: "common", xp_reward: 50, category: "goals", condition_type: "goal_count", condition_value: { count: 1 } },
  { slug: "goal-perfect-day", title: "Perfect Day", description: "Complete all daily goals", icon: "🎯", rarity: "rare", xp_reward: 250, category: "goals", condition_type: "perfect_day", condition_value: {} },
  { slug: "goal-200", title: "Overachiever", description: "Complete 200 goals total", icon: "🎯", rarity: "legendary", xp_reward: 3000, category: "goals", condition_type: "goal_count", condition_value: { count: 200 } },

  // Notes achievements
  { slug: "note-first", title: "First Page", description: "Create your first note", icon: "📓", rarity: "common", xp_reward: 25, category: "notes", condition_type: "note_count", condition_value: { count: 1 } },
  { slug: "note-50", title: "Librarian", description: "Create 50 notes", icon: "📓", rarity: "rare", xp_reward: 200, category: "notes", condition_type: "note_count", condition_value: { count: 50 } },

  // Special
  { slug: "night-owl", title: "Night Owl", description: "Complete 3 sessions after midnight", icon: "🦉", rarity: "rare", xp_reward: 200, category: "special", condition_type: "time_pattern", condition_value: { hour_after: 0, count: 3 } },
  { slug: "early-bird", title: "Early Bird", description: "Complete 3 sessions before 6am", icon: "🌅", rarity: "rare", xp_reward: 200, category: "special", condition_type: "time_pattern", condition_value: { hour_before: 6, count: 3 } },
  { slug: "founder", title: "Founder", description: "Joined FocusOS in the first month", icon: "🌟", rarity: "legendary", xp_reward: 1000, category: "special", condition_type: "manual", condition_value: {} },
] as const;

// ─── Navigation ──────────────────────────────────────────

export const APP_NAV_ITEMS = [
  { label: "Command Center", href: "/app/dashboard", icon: "⚡" },
  { label: "Focus Engine", href: "/app/focus", icon: "⏱" },
  { label: "Knowledge Vault", href: "/app/notes", icon: "📓" },
  { label: "Quest Board", href: "/app/goals", icon: "🎯" },
  { label: "Observatory", href: "/app/analytics", icon: "📊" },
  { label: "Trophy Room", href: "/app/achievements", icon: "🏆" },
  { label: "AI Oracle", href: "/app/coach", icon: "🤖" },
] as const;

// ─── Subscription Plans ──────────────────────────────────

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    goals_limit: 5,
    notes_limit: 20,
    ai_requests_per_day: 3,
    focus_history_days: 7,
  },
  pro: {
    name: "Pro",
    price_monthly_inr: 299,
    price_annual_inr: 2499,
    goals_limit: Infinity,
    notes_limit: Infinity,
    ai_requests_per_day: 50,
    focus_history_days: 365,
  },
} as const;

// ─── Poster Colors for Categories ────────────────────────

export const GOAL_CATEGORY_CONFIG = {
  study: { color: "#7C3AED", bg: "rgba(124,58,237,0.12)", icon: "📚", label: "Study" },
  workout: { color: "#34D399", bg: "rgba(52,211,153,0.12)", icon: "💪", label: "Workout" },
  reading: { color: "#22D3EE", bg: "rgba(34,211,238,0.12)", icon: "📖", label: "Reading" },
  meditation: { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", icon: "🧘", label: "Meditation" },
  sleep: { color: "#6366F1", bg: "rgba(99,102,241,0.12)", icon: "😴", label: "Sleep" },
  nutrition: { color: "#FBBF24", bg: "rgba(251,191,36,0.12)", icon: "🥗", label: "Nutrition" },
  custom: { color: "#9898B8", bg: "rgba(152,152,184,0.12)", icon: "⭐", label: "Custom" },
} as const;
