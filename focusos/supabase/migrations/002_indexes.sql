-- ═══════════════════════════════════════════════════════════
-- FocusOS — Indexes for Performance
-- Migration: 002_indexes
-- ═══════════════════════════════════════════════════════════

-- ─── Profiles ───────────────────────────────────────────

CREATE INDEX idx_profiles_username ON profiles (username);

-- ─── XP & Levels ────────────────────────────────────────

CREATE INDEX idx_user_xp_user_id ON user_xp (user_id);
CREATE INDEX idx_user_xp_total_xp ON user_xp (total_xp DESC); -- Leaderboard sort
CREATE INDEX idx_xp_transactions_user_id ON xp_transactions (user_id);
CREATE INDEX idx_xp_transactions_source ON xp_transactions (source);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions (created_at DESC);

-- ─── Streaks ────────────────────────────────────────────

CREATE INDEX idx_streaks_user_id ON streaks (user_id);
CREATE INDEX idx_streaks_current ON streaks (current_streak DESC);

-- ─── Goals ──────────────────────────────────────────────

CREATE INDEX idx_goals_user_id ON goals (user_id);
CREATE INDEX idx_goals_category ON goals (user_id, category);
CREATE INDEX idx_goals_active ON goals (user_id, is_active);

-- ─── Goal Completions ────────────────────────────────────

CREATE INDEX idx_goal_completions_user_date ON goal_completions (user_id, completed_date DESC);
CREATE INDEX idx_goal_completions_goal ON goal_completions (goal_id, completed_date DESC);

-- ─── Focus Sessions ─────────────────────────────────────

CREATE INDEX idx_focus_sessions_user_id ON focus_sessions (user_id);
CREATE INDEX idx_focus_sessions_user_date ON focus_sessions (user_id, created_at DESC);
CREATE INDEX idx_focus_sessions_status ON focus_sessions (user_id, status);
CREATE INDEX idx_focus_sessions_goal ON focus_sessions (goal_id);

-- ─── Notes ──────────────────────────────────────────────

CREATE INDEX idx_notes_user_id ON notes (user_id);
CREATE INDEX idx_notes_updated ON notes (user_id, updated_at DESC);
CREATE INDEX idx_notes_pinned ON notes (user_id, is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_notes_archived ON notes (user_id, is_archived);
CREATE INDEX idx_notes_parent ON notes (parent_id);
CREATE INDEX idx_notes_tags ON notes USING gin (tags);

-- Full-text search on notes
CREATE INDEX idx_notes_search ON notes
  USING gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, '')));

-- ─── Flashcards ─────────────────────────────────────────

CREATE INDEX idx_flashcards_user_id ON flashcards (user_id);
CREATE INDEX idx_flashcards_next_review ON flashcards (user_id, next_review);
CREATE INDEX idx_flashcards_note ON flashcards (note_id);

-- ─── Achievements ────────────────────────────────────────

CREATE INDEX idx_user_achievements_user ON user_achievements (user_id);
CREATE INDEX idx_user_achievements_earned ON user_achievements (user_id, earned_at DESC);

-- ─── Daily Quests ────────────────────────────────────────

CREATE INDEX idx_daily_quests_user_date ON daily_quests (user_id, quest_date DESC);
CREATE INDEX idx_daily_quests_incomplete ON daily_quests (user_id, is_completed)
  WHERE is_completed = FALSE;

-- ─── AI Insights ────────────────────────────────────────

CREATE INDEX idx_ai_insights_user ON ai_insights (user_id, created_at DESC);
CREATE INDEX idx_ai_insights_unread ON ai_insights (user_id, is_read)
  WHERE is_read = FALSE;

-- ─── Daily Analytics ────────────────────────────────────

CREATE INDEX idx_daily_analytics_user_date ON daily_analytics (user_id, date DESC);
