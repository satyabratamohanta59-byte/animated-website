-- ═══════════════════════════════════════════════════════════
-- FocusOS — Initial Database Schema
-- Migration: 001_initial_schema
-- ═══════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ─── PROFILES ───────────────────────────────────────────

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL CHECK (char_length(username) BETWEEN 3 AND 30),
  display_name    TEXT,
  avatar_url      TEXT,
  bio             TEXT CHECK (char_length(bio) <= 300),
  timezone        TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  onboarding_data JSONB,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  preferences     JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── USER XP ────────────────────────────────────────────

CREATE TABLE user_xp (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_xp             BIGINT NOT NULL DEFAULT 0,
  current_level        INTEGER NOT NULL DEFAULT 1,
  xp_in_current_level  INTEGER NOT NULL DEFAULT 0,
  xp_to_next_level     INTEGER NOT NULL DEFAULT 1000,
  lifetime_xp          BIGINT NOT NULL DEFAULT 0,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── XP TRANSACTIONS ────────────────────────────────────

CREATE TABLE xp_transactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount     INTEGER NOT NULL,
  source     TEXT NOT NULL,
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STREAKS ────────────────────────────────────────────

CREATE TABLE streaks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak   INTEGER NOT NULL DEFAULT 0,
  longest_streak   INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  streak_frozen    BOOLEAN NOT NULL DEFAULT FALSE,
  freeze_count     INTEGER NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── GOALS ──────────────────────────────────────────────

CREATE TABLE goals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description  TEXT,
  category     TEXT NOT NULL DEFAULT 'custom'
               CHECK (category IN ('study','workout','reading','meditation','sleep','nutrition','custom')),
  icon         TEXT,
  color        TEXT,
  frequency    TEXT NOT NULL DEFAULT 'daily'
               CHECK (frequency IN ('daily','weekly','monthly','custom')),
  target_value NUMERIC,
  target_unit  TEXT,
  xp_reward    INTEGER NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── GOAL COMPLETIONS ───────────────────────────────────

CREATE TABLE goal_completions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_id        UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  value_logged   NUMERIC,
  note           TEXT,
  xp_awarded     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (goal_id, completed_date)
);

-- ─── GOAL MILESTONES ────────────────────────────────────

CREATE TABLE goal_milestones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id      UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  xp_bonus     INTEGER NOT NULL DEFAULT 100,
  achieved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FOCUS SESSIONS ─────────────────────────────────────

CREATE TABLE focus_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_id        UUID REFERENCES goals(id) ON DELETE SET NULL,
  note_id        UUID,  -- FK added after notes table
  session_type   TEXT NOT NULL DEFAULT 'pomodoro'
                 CHECK (session_type IN ('pomodoro','deep_work','custom','short')),
  planned_mins   INTEGER NOT NULL CHECK (planned_mins > 0),
  actual_mins    INTEGER CHECK (actual_mins >= 0),
  focus_score    NUMERIC(3,1) CHECK (focus_score BETWEEN 0 AND 10),
  ambient_sound  TEXT,
  status         TEXT NOT NULL DEFAULT 'planned'
                 CHECK (status IN ('planned','active','paused','completed','abandoned')),
  xp_awarded     INTEGER NOT NULL DEFAULT 0,
  reflection     TEXT,
  started_at     TIMESTAMPTZ,
  ended_at       TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SESSION BREAKS ─────────────────────────────────────

CREATE TABLE session_breaks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES focus_sessions(id) ON DELETE CASCADE,
  planned_mins INTEGER NOT NULL DEFAULT 10,
  actual_mins  INTEGER,
  break_type   TEXT NOT NULL DEFAULT 'short' CHECK (break_type IN ('short','long')),
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ
);

-- ─── NOTES ──────────────────────────────────────────────

CREATE TABLE notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL DEFAULT 'Untitled',
  content      JSONB,
  content_text TEXT,  -- Extracted plain text for search
  tags         TEXT[] NOT NULL DEFAULT '{}',
  is_pinned    BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived  BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image  TEXT,
  icon         TEXT,
  word_count   INTEGER NOT NULL DEFAULT 0,
  parent_id    UUID REFERENCES notes(id) ON DELETE SET NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add FK from focus_sessions to notes
ALTER TABLE focus_sessions
  ADD CONSTRAINT fk_focus_sessions_note
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL;

-- ─── NOTE ATTACHMENTS ───────────────────────────────────

CREATE TABLE note_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id     UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT NOT NULL,
  file_size   BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FLASHCARDS ─────────────────────────────────────────

CREATE TABLE flashcards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note_id      UUID REFERENCES notes(id) ON DELETE SET NULL,
  front        TEXT NOT NULL,
  back         TEXT NOT NULL,
  difficulty   INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  next_review  DATE,
  review_count INTEGER NOT NULL DEFAULT 0,
  ease_factor  NUMERIC(4,2) NOT NULL DEFAULT 2.5,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ACHIEVEMENTS ───────────────────────────────────────

CREATE TABLE achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon            TEXT NOT NULL,
  badge_url       TEXT,
  rarity          TEXT NOT NULL DEFAULT 'common'
                  CHECK (rarity IN ('common','rare','epic','legendary')),
  xp_reward       INTEGER NOT NULL DEFAULT 0,
  category        TEXT NOT NULL
                  CHECK (category IN ('streak','focus','goals','notes','social','special','seasonal')),
  condition_type  TEXT NOT NULL,
  condition_value JSONB NOT NULL DEFAULT '{}'
);

-- ─── USER ACHIEVEMENTS ──────────────────────────────────

CREATE TABLE user_achievements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  earned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- ─── DAILY QUESTS ───────────────────────────────────────

CREATE TABLE daily_quests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  title         TEXT NOT NULL,
  description   TEXT,
  quest_type    TEXT NOT NULL
                CHECK (quest_type IN ('focus','goal','note','review','social')),
  target_value  INTEGER NOT NULL DEFAULT 1,
  current_value INTEGER NOT NULL DEFAULT 0,
  xp_reward     INTEGER NOT NULL DEFAULT 100,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AI INSIGHTS ────────────────────────────────────────

CREATE TABLE ai_insights (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL
               CHECK (insight_type IN (
                 'burnout_warning','peak_hours','weak_subject',
                 'celebration','suggestion','prediction',
                 'streak_risk','pattern_anomaly'
               )),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  action_url   TEXT,
  priority     TEXT NOT NULL DEFAULT 'medium'
               CHECK (priority IN ('high','medium','low')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DAILY ANALYTICS SNAPSHOTS ──────────────────────────

CREATE TABLE daily_analytics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  focus_minutes   INTEGER NOT NULL DEFAULT 0,
  sessions_count  INTEGER NOT NULL DEFAULT 0,
  goals_completed INTEGER NOT NULL DEFAULT 0,
  goals_total     INTEGER NOT NULL DEFAULT 0,
  notes_created   INTEGER NOT NULL DEFAULT 0,
  xp_earned       INTEGER NOT NULL DEFAULT 0,
  focus_score     NUMERIC(3,1),
  mood            INTEGER CHECK (mood BETWEEN 1 AND 5),
  energy_level    INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  streak_count    INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_user_xp_updated_at
  BEFORE UPDATE ON user_xp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_streaks_updated_at
  BEFORE UPDATE ON streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
