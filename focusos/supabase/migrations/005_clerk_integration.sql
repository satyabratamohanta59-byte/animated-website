-- ═══════════════════════════════════════════════════════════
-- FocusOS — Clerk Authentication Integration
-- Migration: 005_clerk_integration
-- ═══════════════════════════════════════════════════════════
-- Since we use Clerk (not Supabase Auth), we need to:
-- 1. Remove the FK constraint from profiles.id to auth.users
-- 2. Add a clerk_id column for user identification
-- 3. Provide a sync function to initialize user records

-- Drop the Supabase Auth trigger (Clerk handles auth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remove FK constraint from profiles to auth.users
-- (Clerk user IDs are strings like "user_2abc...", not Supabase auth UUIDs)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
ALTER TABLE profiles ADD PRIMARY KEY (id);

-- Add clerk_id column for Clerk user identification
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles (clerk_id);

-- ─── Sync Clerk User → Supabase Records ──────────────────

CREATE OR REPLACE FUNCTION sync_clerk_user(
  p_clerk_id     TEXT,
  p_username     TEXT,
  p_display_name TEXT DEFAULT NULL,
  p_avatar_url   TEXT DEFAULT NULL,
  p_email        TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_is_new  BOOLEAN := FALSE;
BEGIN
  -- Check for existing profile
  SELECT id INTO v_user_id
  FROM profiles
  WHERE clerk_id = p_clerk_id;

  IF NOT FOUND THEN
    v_user_id := gen_random_uuid();
    v_is_new  := TRUE;

    INSERT INTO profiles (id, clerk_id, username, display_name, avatar_url)
    VALUES (v_user_id, p_clerk_id, p_username, p_display_name, p_avatar_url)
    ON CONFLICT (clerk_id) DO UPDATE
      SET display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
          avatar_url   = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url)
    RETURNING id INTO v_user_id;

    -- Initialize XP record
    INSERT INTO user_xp (user_id, total_xp, lifetime_xp, current_level, xp_in_current_level, xp_to_next_level)
    VALUES (v_user_id, 0, 0, 1, 0, compute_xp_for_level(1))
    ON CONFLICT (user_id) DO NOTHING;

    -- Initialize streak record
    INSERT INTO streaks (user_id, current_streak, longest_streak)
    VALUES (v_user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- Award onboarding XP
    PERFORM award_xp_atomic(v_user_id, 500, 'onboarding_complete', '{"source": "new_user"}');
  ELSE
    -- Update profile info
    UPDATE profiles
    SET
      display_name = COALESCE(p_display_name, display_name),
      avatar_url   = COALESCE(p_avatar_url, avatar_url)
    WHERE id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'is_new',  v_is_new
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Helper: Get Internal UUID from Clerk ID ─────────────

CREATE OR REPLACE FUNCTION get_user_id_from_clerk(p_clerk_id TEXT)
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE clerk_id = p_clerk_id LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ─── Dashboard Aggregate Query ────────────────────────────

CREATE OR REPLACE FUNCTION get_dashboard_data(p_clerk_id TEXT)
RETURNS JSONB AS $$
DECLARE
  v_user_id      UUID;
  v_xp_data      JSONB;
  v_streak_data  JSONB;
  v_today_stats  JSONB;
  v_heatmap      JSONB;
  v_sessions     JSONB;
  v_quests       JSONB;
  v_insight      JSONB;
  v_today        DATE := CURRENT_DATE;
BEGIN
  v_user_id := get_user_id_from_clerk(p_clerk_id);
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'user_not_found');
  END IF;

  -- XP data
  SELECT jsonb_build_object(
    'total_xp',           total_xp,
    'current_level',      current_level,
    'xp_in_current_level', xp_in_current_level,
    'xp_to_next_level',   xp_to_next_level,
    'lifetime_xp',        lifetime_xp
  ) INTO v_xp_data
  FROM user_xp WHERE user_id = v_user_id;

  -- Streak data
  SELECT jsonb_build_object(
    'current_streak',  current_streak,
    'longest_streak',  longest_streak,
    'last_active_date', last_active_date,
    'freeze_count',    freeze_count
  ) INTO v_streak_data
  FROM streaks WHERE user_id = v_user_id;

  -- Today's stats
  SELECT jsonb_build_object(
    'xp_earned',       COALESCE(xp_earned, 0),
    'focus_minutes',   COALESCE(focus_minutes, 0),
    'sessions_count',  COALESCE(sessions_count, 0),
    'goals_completed', COALESCE(goals_completed, 0)
  ) INTO v_today_stats
  FROM daily_analytics
  WHERE user_id = v_user_id AND date = v_today;

  IF v_today_stats IS NULL THEN
    v_today_stats := '{"xp_earned":0,"focus_minutes":0,"sessions_count":0,"goals_completed":0}'::JSONB;
  END IF;

  -- Heatmap (365 days)
  SELECT jsonb_agg(
    jsonb_build_object(
      'date',          date,
      'minutes',       COALESCE(focus_minutes, 0),
      'xp_earned',     COALESCE(xp_earned, 0),
      'sessions_count', COALESCE(sessions_count, 0)
    ) ORDER BY date
  ) INTO v_heatmap
  FROM daily_analytics
  WHERE user_id = v_user_id
    AND date >= (v_today - INTERVAL '364 days')
    AND date <= v_today;

  -- Recent sessions (last 8)
  SELECT jsonb_agg(s ORDER BY s->>'created_at' DESC) INTO v_sessions
  FROM (
    SELECT jsonb_build_object(
      'id',          fs.id,
      'created_at',  fs.created_at,
      'planned_mins', fs.planned_mins,
      'actual_mins', fs.actual_mins,
      'focus_score', fs.focus_score,
      'status',      fs.status,
      'goal_title',  g.title
    ) AS s
    FROM focus_sessions fs
    LEFT JOIN goals g ON g.id = fs.goal_id
    WHERE fs.user_id = v_user_id
    ORDER BY fs.created_at DESC
    LIMIT 8
  ) sub;

  -- Today's quests
  SELECT jsonb_agg(q ORDER BY q->>'is_completed', q->>'xp_reward' DESC) INTO v_quests
  FROM (
    SELECT jsonb_build_object(
      'id',           id,
      'title',        title,
      'description',  description,
      'quest_type',   quest_type,
      'xp_reward',    xp_reward,
      'progress',     progress,
      'target_value', target_value,
      'is_completed', is_completed
    ) AS q
    FROM daily_quests
    WHERE user_id = v_user_id AND quest_date = v_today
    LIMIT 6
  ) sub;

  -- Latest unread AI insight
  SELECT jsonb_build_object(
    'id',      id,
    'title',   title,
    'content', content,
    'type',    insight_type,
    'is_read', is_read
  ) INTO v_insight
  FROM ai_insights
  WHERE user_id = v_user_id AND is_read = FALSE
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN jsonb_build_object(
    'xp',      v_xp_data,
    'streak',  v_streak_data,
    'today',   v_today_stats,
    'heatmap', COALESCE(v_heatmap, '[]'::JSONB),
    'sessions', COALESCE(v_sessions, '[]'::JSONB),
    'quests',  COALESCE(v_quests, '[]'::JSONB),
    'insight', v_insight
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
