-- ═══════════════════════════════════════════════════════════
-- FocusOS — Seed Data
-- ═══════════════════════════════════════════════════════════

-- ─── Achievement Definitions ─────────────────────────────

INSERT INTO achievements (slug, title, description, icon, rarity, xp_reward, category, condition_type, condition_value) VALUES

-- Streak achievements
('streak-3',   'First Flame',     'Maintain a 3-day streak',   '🔥', 'common',    50,    'streak', 'streak_count', '{"count": 3}'),
('streak-7',   'Week Warrior',    'Maintain a 7-day streak',   '🔥', 'common',    100,   'streak', 'streak_count', '{"count": 7}'),
('streak-14',  'Fortnight Force', 'Maintain a 14-day streak',  '🔥', 'rare',      250,   'streak', 'streak_count', '{"count": 14}'),
('streak-30',  'Month Master',    'Maintain a 30-day streak',  '🔥', 'rare',      500,   'streak', 'streak_count', '{"count": 30}'),
('streak-100', 'Century Sage',    'Maintain a 100-day streak', '🔥', 'epic',      2000,  'streak', 'streak_count', '{"count": 100}'),
('streak-365', 'Eternal Flame',   'Maintain a 365-day streak', '🔥', 'legendary', 10000, 'streak', 'streak_count', '{"count": 365}'),

-- Focus achievements
('focus-first', 'First Focus',    'Complete your first focus session', '⏱', 'common',    50,   'focus', 'session_count',  '{"count": 1}'),
('focus-10',    'Getting Warmed', '10 focus sessions completed',       '⏱', 'common',    75,   'focus', 'session_count',  '{"count": 10}'),
('focus-50',    'Focus Master',   '50 focus sessions completed',       '⏱', 'rare',      150,  'focus', 'session_count',  '{"count": 50}'),
('focus-100',   'Iron Focus',     '100 focus sessions completed',      '⏱', 'rare',      300,  'focus', 'session_count',  '{"count": 100}'),
('focus-500',   'Flow State God', '500 focus sessions completed',      '⏱', 'epic',      1000, 'focus', 'session_count',  '{"count": 500}'),
('focus-1000h', 'Chronos',        '1000 hours of total focus',         '⌛', 'legendary', 5000, 'focus', 'total_minutes', '{"minutes": 60000}'),
('focus-deep',  'Deep Diver',     'Focus 5+ hours in a single day',   '🌊', 'rare',      200,  'focus', 'daily_minutes', '{"minutes": 300}'),

-- Goal achievements
('goal-first',   'First Quest',    'Complete your first goal',      '🎯', 'common',    50,   'goals', 'goal_count',  '{"count": 1}'),
('goal-10',      'Quest Runner',   'Complete 10 goals',             '🎯', 'common',    100,  'goals', 'goal_count',  '{"count": 10}'),
('goal-perfect', 'Perfect Day',    'Complete all daily goals',      '⭐', 'rare',      250,  'goals', 'perfect_day', '{}'),
('goal-7day',    'Perfect Week',   'All goals for 7 days straight', '⭐', 'epic',      1000, 'goals', 'perfect_week','{}'),
('goal-200',     'Overachiever',   '200 total goal completions',    '🎯', 'legendary', 3000, 'goals', 'goal_count',  '{"count": 200}'),

-- Notes achievements
('note-first',   'First Page',     'Create your first note',       '📓', 'common',  25,  'notes', 'note_count', '{"count": 1}'),
('note-10',      'Scribbler',      'Create 10 notes',              '📓', 'common',  50,  'notes', 'note_count', '{"count": 10}'),
('note-50',      'Librarian',      'Create 50 notes',              '📓', 'rare',    200, 'notes', 'note_count', '{"count": 50}'),
('flash-100',    'Flash Master',   'Review 100 flashcards',        '⚡', 'rare',    300, 'notes', 'flash_count','{"count": 100}'),

-- Special achievements
('night-owl',  'Night Owl',   'Complete 3 sessions after midnight', '🦉', 'rare',      200,  'special', 'time_pattern', '{"hour_after": 0, "count": 3}'),
('early-bird', 'Early Bird',  'Complete 3 sessions before 6am',    '🌅', 'rare',      200,  'special', 'time_pattern', '{"hour_before": 6, "count": 3}'),
('top-1pct',   'The 1%',      'Reach top 1% XP globally',         '👑', 'epic',      2000, 'special', 'leaderboard',  '{"percentile": 99}'),
('founder',    'Founder',     'Joined FocusOS in the first month', '🌟', 'legendary', 1000, 'special', 'manual',       '{}');
