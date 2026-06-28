-- ═══════════════════════════════════════════════════════════
-- FocusOS — Database Functions & Triggers
-- Migration: 004_functions
-- ═══════════════════════════════════════════════════════════

-- ─── XP Level Thresholds ────────────────────────────────

CREATE OR REPLACE FUNCTION compute_xp_for_level(p_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Formula: base * (level ^ 1.5) * 10
  RETURN ROUND(100 * POWER(p_level, 1.5) * 10);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION compute_level_from_xp(p_total_xp BIGINT)
RETURNS TABLE (
  level               INTEGER,
  xp_in_current_level INTEGER,
  xp_to_next_level    INTEGER
) AS $$
DECLARE
  v_level       INTEGER := 1;
  v_cumulative  BIGINT := 0;
  v_level_xp    INTEGER;
BEGIN
  LOOP
    v_level_xp := compute_xp_for_level(v_level);
    EXIT WHEN v_cumulative + v_level_xp > p_total_xp;
    v_cumulative := v_cumulative + v_level_xp;
    v_level := v_level + 1;
  END LOOP;

  RETURN QUERY SELECT
    v_level,
    (p_total_xp - v_cumulative)::INTEGER,
    compute_xp_for_level(v_level);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─── Atomic XP Award ─────────────────────────────────────

CREATE OR REPLACE FUNCTION award_xp_atomic(
  p_user_id   UUID,
  p_amount    INTEGER,
  p_source    TEXT,
  p_metadata  JSONB DEFAULT '{}'
)
RETURNS TABLE (
  new_total_xp      BIGINT,
  new_level         INTEGER,
  leveled_up        BOOLEAN,
  xp_transaction_id UUID
) AS $$
DECLARE
  v_old_level         INTEGER;
  v_new_level_data    RECORD;
  v_new_total         BIGINT;
  v_transaction_id    UUID;
BEGIN
  -- Get current level
  SELECT current_level INTO v_old_level
  FROM user_xp WHERE user_id = p_user_id
  FOR UPDATE;

  -- Insert XP transaction
  INSERT INTO xp_transactions (user_id, amount, source, metadata)
  VALUES (p_user_id, p_amount, p_source, p_metadata)
  RETURNING id INTO v_transaction_id;

  -- Update total XP
  UPDATE user_xp
  SET
    total_xp    = total_xp + p_amount,
    lifetime_xp = lifetime_xp + p_amount
  WHERE user_id = p_user_id
  RETURNING total_xp INTO v_new_total;

  -- Compute new level
  SELECT * INTO v_new_level_data
  FROM compute_level_from_xp(v_new_total);

  -- Update level data
  UPDATE user_xp
  SET
    current_level       = v_new_level_data.level,
    xp_in_current_level = v_new_level_data.xp_in_current_level,
    xp_to_next_level    = v_new_level_data.xp_to_next_level
  WHERE user_id = p_user_id;

  -- Update daily analytics
  INSERT INTO daily_analytics (user_id, date, xp_earned)
  VALUES (p_user_id, CURRENT_DATE, p_amount)
  ON CONFLICT (user_id, date)
  DO UPDATE SET xp_earned = daily_analytics.xp_earned + p_amount;

  RETURN QUERY SELECT
    v_new_total,
    v_new_level_data.level,
    (v_new_level_data.level > v_old_level),
    v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Streak Check & Update ───────────────────────────────

CREATE OR REPLACE FUNCTION check_and_update_streak(p_user_id UUID)
RETURNS TABLE (
  streak_maintained BOOLEAN,
  current_streak    INTEGER,
  streak_broken     BOOLEAN
) AS $$
DECLARE
  v_streak     streaks%ROWTYPE;
  v_today      DATE := CURRENT_DATE;
  v_maintained BOOLEAN := FALSE;
  v_broken     BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_streak
  FROM streaks WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Create streak record
    INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date)
    VALUES (p_user_id, 1, 1, v_today);

    RETURN QUERY SELECT TRUE, 1, FALSE;
    RETURN;
  END IF;

  -- Already checked in today
  IF v_streak.last_active_date = v_today THEN
    RETURN QUERY SELECT TRUE, v_streak.current_streak, FALSE;
    RETURN;
  END IF;

  -- Check if yesterday
  IF v_streak.last_active_date = v_today - INTERVAL '1 day' THEN
    -- Continue streak
    UPDATE streaks SET
      current_streak   = current_streak + 1,
      longest_streak   = GREATEST(longest_streak, current_streak + 1),
      last_active_date = v_today
    WHERE user_id = p_user_id
    RETURNING current_streak INTO v_streak.current_streak;

    v_maintained := TRUE;
  ELSE
    -- Streak broken (unless frozen)
    IF v_streak.streak_frozen AND v_streak.freeze_count > 0 THEN
      -- Use freeze
      UPDATE streaks SET
        streak_frozen    = (freeze_count - 1 > 0),
        freeze_count     = freeze_count - 1,
        last_active_date = v_today
      WHERE user_id = p_user_id;
      v_maintained := TRUE;
    ELSE
      -- Reset streak
      UPDATE streaks SET
        current_streak   = 1,
        last_active_date = v_today
      WHERE user_id = p_user_id;
      v_broken := TRUE;
    END IF;
  END IF;

  RETURN QUERY SELECT
    v_maintained,
    v_streak.current_streak,
    v_broken;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Profile Auto-Create on Auth ─────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      LOWER(REPLACE(NEW.raw_user_meta_data->>'username', ' ', '_')),
      'user_' || SUBSTR(NEW.id::TEXT, 1, 8)
    ),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create XP record
  INSERT INTO user_xp (user_id, total_xp, current_level, xp_to_next_level)
  VALUES (NEW.id, 0, 1, compute_xp_for_level(1))
  ON CONFLICT (user_id) DO NOTHING;

  -- Create streak record
  INSERT INTO streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Complete Focus Session ──────────────────────────────

CREATE OR REPLACE FUNCTION complete_focus_session(
  p_session_id UUID,
  p_actual_mins INTEGER,
  p_reflection  TEXT DEFAULT NULL
)
RETURNS TABLE (
  xp_awarded  INTEGER,
  focus_score NUMERIC,
  leveled_up  BOOLEAN
) AS $$
DECLARE
  v_session focus_sessions%ROWTYPE;
  v_score   NUMERIC;
  v_xp      INTEGER;
  v_result  RECORD;
BEGIN
  SELECT * INTO v_session
  FROM focus_sessions WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND OR v_session.status = 'completed' THEN
    RAISE EXCEPTION 'Session not found or already completed';
  END IF;

  -- Calculate focus score (0-10)
  v_score := ROUND(
    LEAST(p_actual_mins::NUMERIC / v_session.planned_mins, 1.0) * 10,
    1
  );

  -- Calculate XP based on completion
  v_xp := CASE
    WHEN p_actual_mins >= v_session.planned_mins THEN 150
    WHEN p_actual_mins >= v_session.planned_mins * 0.5 THEN 50
    ELSE 10
  END;

  -- Update session
  UPDATE focus_sessions SET
    status       = 'completed',
    actual_mins  = p_actual_mins,
    focus_score  = v_score,
    xp_awarded   = v_xp,
    reflection   = p_reflection,
    ended_at     = NOW()
  WHERE id = p_session_id;

  -- Update daily analytics
  INSERT INTO daily_analytics (
    user_id, date, focus_minutes, sessions_count, focus_score, xp_earned
  ) VALUES (
    v_session.user_id, CURRENT_DATE, p_actual_mins, 1, v_score, v_xp
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    focus_minutes  = daily_analytics.focus_minutes + p_actual_mins,
    sessions_count = daily_analytics.sessions_count + 1,
    focus_score    = ROUND((daily_analytics.focus_score + v_score) / 2, 1),
    xp_earned      = daily_analytics.xp_earned + v_xp;

  -- Award XP
  SELECT * INTO v_result
  FROM award_xp_atomic(
    v_session.user_id, v_xp, 'focus_session_complete',
    jsonb_build_object('session_id', p_session_id, 'mins', p_actual_mins)
  );

  -- Update streak
  PERFORM check_and_update_streak(v_session.user_id);

  RETURN QUERY SELECT v_xp, v_score, v_result.leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Note Full-Text Search ───────────────────────────────

CREATE OR REPLACE FUNCTION search_notes(
  p_user_id UUID,
  p_query   TEXT,
  p_limit   INTEGER DEFAULT 20,
  p_offset  INTEGER DEFAULT 0
)
RETURNS SETOF notes AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM notes
  WHERE
    user_id = p_user_id
    AND is_archived = FALSE
    AND to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content_text,''))
        @@ plainto_tsquery('english', p_query)
  ORDER BY
    ts_rank(
      to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content_text,'')),
      plainto_tsquery('english', p_query)
    ) DESC,
    updated_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
