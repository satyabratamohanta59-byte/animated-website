-- ═══════════════════════════════════════════════════════════
-- FocusOS — Row Level Security Policies
-- Migration: 003_rls_policies
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp           ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_completions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones    ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_breaks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_attachments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards         ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights        ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics    ENABLE ROW LEVEL SECURITY;

-- ─── Profiles ───────────────────────────────────────────

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── User XP ────────────────────────────────────────────

CREATE POLICY "user_xp_select_own"
  ON user_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_xp_insert_own"
  ON user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_xp_update_own"
  ON user_xp FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── XP Transactions ────────────────────────────────────

CREATE POLICY "xp_transactions_select_own"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "xp_transactions_insert_own"
  ON xp_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── Streaks ────────────────────────────────────────────

CREATE POLICY "streaks_all_own"
  ON streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Goals ──────────────────────────────────────────────

CREATE POLICY "goals_all_own"
  ON goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Goal Completions ────────────────────────────────────

CREATE POLICY "goal_completions_all_own"
  ON goal_completions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Goal Milestones ────────────────────────────────────

CREATE POLICY "goal_milestones_select_own"
  ON goal_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = goal_milestones.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "goal_milestones_insert_own"
  ON goal_milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = goal_milestones.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "goal_milestones_update_own"
  ON goal_milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = goal_milestones.goal_id
    AND goals.user_id = auth.uid()
  ));

-- ─── Focus Sessions ─────────────────────────────────────

CREATE POLICY "focus_sessions_all_own"
  ON focus_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Session Breaks ─────────────────────────────────────

CREATE POLICY "session_breaks_own"
  ON session_breaks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM focus_sessions
    WHERE focus_sessions.id = session_breaks.session_id
    AND focus_sessions.user_id = auth.uid()
  ));

-- ─── Notes ──────────────────────────────────────────────

CREATE POLICY "notes_all_own"
  ON notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Note Attachments ────────────────────────────────────

CREATE POLICY "note_attachments_all_own"
  ON note_attachments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Flashcards ─────────────────────────────────────────

CREATE POLICY "flashcards_all_own"
  ON flashcards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Achievements (public read) ──────────────────────────

CREATE POLICY "achievements_public_read"
  ON achievements FOR SELECT
  TO PUBLIC
  USING (TRUE);

-- ─── User Achievements ──────────────────────────────────

CREATE POLICY "user_achievements_select_own"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_achievements_insert_own"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── Daily Quests ────────────────────────────────────────

CREATE POLICY "daily_quests_all_own"
  ON daily_quests FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── AI Insights ────────────────────────────────────────

CREATE POLICY "ai_insights_all_own"
  ON ai_insights FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Daily Analytics ────────────────────────────────────

CREATE POLICY "daily_analytics_all_own"
  ON daily_analytics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Public Leaderboard View ─────────────────────────────

CREATE VIEW public_leaderboard AS
  SELECT
    p.username,
    p.avatar_url,
    x.total_xp,
    x.current_level,
    s.current_streak
  FROM profiles p
  JOIN user_xp x ON x.user_id = p.id
  JOIN streaks s ON s.user_id = p.id
  WHERE (p.preferences->>'public_profile')::boolean = TRUE
  ORDER BY x.total_xp DESC
  LIMIT 100;

-- ─── Storage: Note Attachments ───────────────────────────

INSERT INTO storage.buckets (id, name, public)
  VALUES ('note-attachments', 'note-attachments', FALSE)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', TRUE)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatar_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatar_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "note_attachment_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'note-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "note_attachment_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'note-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "note_attachment_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'note-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
