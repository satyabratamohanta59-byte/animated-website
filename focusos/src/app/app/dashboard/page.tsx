import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  getDefaultDashboardData,
  normalizeXP,
  normalizeHeatmap,
  type DashboardData,
  type DashboardXP,
  type DashboardStreak,
  type DashboardToday,
  type DashboardSession,
  type DashboardQuest,
  type DashboardInsight,
} from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Command Center",
};

// ─── Fetch Dashboard Data ─────────────────────────────────

async function fetchDashboardData(clerkId: string): Promise<DashboardData | null> {
  const supabase = await createSupabaseAdminClient();

  // Get the aggregate data from our PostgreSQL function
  const { data: raw, error } = await supabase.rpc("get_dashboard_data", {
    p_clerk_id: clerkId,
  });

  if (error || !raw || (raw as Record<string, unknown>).error) {
    return null;
  }

  const payload = raw as Record<string, unknown>;

  // ── Normalize XP ──────────────────────────────────────
  const xp: DashboardXP = payload.xp
    ? normalizeXP(payload.xp as Record<string, unknown>)
    : {
        totalXP: 0,
        currentLevel: 1,
        xpInCurrentLevel: 0,
        xpToNextLevel: 1000,
        progressPercent: 0,
        lifetimeXP: 0,
      };

  // ── Normalize Streak ──────────────────────────────────
  const streakRaw = (payload.streak ?? {}) as Record<string, unknown>;
  const streak: DashboardStreak = {
    currentStreak: Number(streakRaw.current_streak ?? 0),
    longestStreak: Number(streakRaw.longest_streak ?? 0),
    lastActiveDate: (streakRaw.last_active_date as string) ?? null,
    freezeCount: Number(streakRaw.freeze_count ?? 0),
  };

  // ── Normalize Today ───────────────────────────────────
  const todayRaw = (payload.today ?? {}) as Record<string, unknown>;
  const today: DashboardToday = {
    xpEarned: Number(todayRaw.xp_earned ?? 0),
    focusMinutes: Number(todayRaw.focus_minutes ?? 0),
    sessionsCount: Number(todayRaw.sessions_count ?? 0),
    goalsCompleted: Number(todayRaw.goals_completed ?? 0),
  };

  // ── Normalize Heatmap ─────────────────────────────────
  const heatmap = normalizeHeatmap(
    (payload.heatmap as Array<Record<string, unknown>>) ?? []
  );

  // ── Normalize Sessions ────────────────────────────────
  const sessions: DashboardSession[] = (
    (payload.sessions as Array<Record<string, unknown>>) ?? []
  ).map((s) => ({
    id: String(s.id),
    createdAt: String(s.created_at),
    plannedMins: Number(s.planned_mins),
    actualMins: s.actual_mins != null ? Number(s.actual_mins) : null,
    focusScore: s.focus_score != null ? Number(s.focus_score) : null,
    status: String(s.status ?? "completed"),
    goalTitle: s.goal_title ? String(s.goal_title) : null,
  }));

  // ── Normalize Quests ──────────────────────────────────
  const quests: DashboardQuest[] = (
    (payload.quests as Array<Record<string, unknown>>) ?? []
  ).map((q) => ({
    id: String(q.id),
    title: String(q.title),
    description: String(q.description ?? ""),
    questType: String(q.quest_type ?? ""),
    xpReward: Number(q.xp_reward ?? 0),
    progress: Number(q.progress ?? 0),
    targetValue: Number(q.target_value ?? 1),
    isCompleted: Boolean(q.is_completed),
  }));

  // ── Normalize Insight ─────────────────────────────────
  const insightRaw = payload.insight as Record<string, unknown> | null;
  const insight: DashboardInsight | null = insightRaw
    ? {
        id: String(insightRaw.id),
        title: String(insightRaw.title),
        content: String(insightRaw.content),
        type: String(insightRaw.type ?? "suggestion"),
        isRead: Boolean(insightRaw.is_read),
      }
    : null;

  return { user: { displayName: "", avatarUrl: null, username: "" }, xp, streak, today, heatmap, sessions, quests, insight };
}

// ─── Auto-sync new user to Supabase ──────────────────────

async function syncUserToSupabase(
  clerkId: string,
  username: string,
  displayName: string | null,
  avatarUrl: string | null
): Promise<void> {
  try {
    const supabase = await createSupabaseAdminClient();
    await supabase.rpc("sync_clerk_user", {
      p_clerk_id: clerkId,
      p_username: username,
      p_display_name: displayName,
      p_avatar_url: avatarUrl,
    });
  } catch {
    // Non-fatal — dashboard will show default data
  }
}

// ─── Dashboard Page ───────────────────────────────────────

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const displayName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    "there";
  const avatarUrl = clerkUser?.imageUrl ?? null;
  const username =
    clerkUser?.username ??
    `user_${userId.replace("user_", "").slice(0, 8)}`;

  const userMeta = { displayName, avatarUrl, username };

  // Try to fetch real data from Supabase
  let dashboardData: DashboardData | null = null;
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseConfigured) {
    dashboardData = await fetchDashboardData(userId);

    // First visit — sync user record and fetch again
    if (!dashboardData) {
      await syncUserToSupabase(userId, username, displayName || null, avatarUrl);
      dashboardData = await fetchDashboardData(userId);
    }
  }

  // Use default data if Supabase isn't configured or returned nothing
  const finalData: DashboardData = dashboardData
    ? { ...dashboardData, user: userMeta }
    : { ...getDefaultDashboardData(userMeta), user: userMeta };

  return <DashboardShell data={finalData} />;
}
