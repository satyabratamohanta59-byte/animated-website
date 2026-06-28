export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          timezone: string;
          onboarding_data: Json | null;
          onboarding_completed: boolean;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          timezone?: string;
          onboarding_data?: Json | null;
          onboarding_completed?: boolean;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      user_xp: {
        Row: {
          id: string;
          user_id: string;
          total_xp: number;
          current_level: number;
          xp_in_current_level: number;
          xp_to_next_level: number;
          lifetime_xp: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_xp?: number;
          current_level?: number;
          xp_in_current_level?: number;
          xp_to_next_level?: number;
          lifetime_xp?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_xp"]["Insert"]>;
      };

      xp_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          source: XPSource;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          source: XPSource;
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
      };

      streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          streak_frozen: boolean;
          freeze_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          streak_frozen?: boolean;
          freeze_count?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["streaks"]["Insert"]>;
      };

      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: GoalCategory;
          icon: string | null;
          color: string | null;
          frequency: GoalFrequency;
          target_value: number | null;
          target_unit: string | null;
          xp_reward: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: GoalCategory;
          icon?: string | null;
          color?: string | null;
          frequency: GoalFrequency;
          target_value?: number | null;
          target_unit?: string | null;
          xp_reward?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
      };

      goal_completions: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string;
          completed_date: string;
          value_logged: number | null;
          note: string | null;
          xp_awarded: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id: string;
          completed_date: string;
          value_logged?: number | null;
          note?: string | null;
          xp_awarded?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goal_completions"]["Insert"]>;
      };

      goal_milestones: {
        Row: {
          id: string;
          goal_id: string;
          title: string;
          target_value: number;
          xp_bonus: number;
          achieved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          title: string;
          target_value: number;
          xp_bonus?: number;
          achieved_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goal_milestones"]["Insert"]>;
      };

      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string | null;
          note_id: string | null;
          session_type: SessionType;
          planned_mins: number;
          actual_mins: number | null;
          focus_score: number | null;
          ambient_sound: string | null;
          status: SessionStatus;
          xp_awarded: number;
          reflection: string | null;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id?: string | null;
          note_id?: string | null;
          session_type?: SessionType;
          planned_mins: number;
          actual_mins?: number | null;
          focus_score?: number | null;
          ambient_sound?: string | null;
          status?: SessionStatus;
          xp_awarded?: number;
          reflection?: string | null;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["focus_sessions"]["Insert"]>;
      };

      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: Json | null;
          content_text: string | null;
          tags: string[];
          is_pinned: boolean;
          is_archived: boolean;
          cover_image: string | null;
          icon: string | null;
          word_count: number;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          content?: Json | null;
          content_text?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          is_archived?: boolean;
          cover_image?: string | null;
          icon?: string | null;
          word_count?: number;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
      };

      flashcards: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          front: string;
          back: string;
          difficulty: number;
          next_review: string | null;
          review_count: number;
          ease_factor: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          front: string;
          back: string;
          difficulty?: number;
          next_review?: string | null;
          review_count?: number;
          ease_factor?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["flashcards"]["Insert"]>;
      };

      achievements: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          badge_url: string | null;
          rarity: AchievementRarity;
          xp_reward: number;
          category: AchievementCategory;
          condition_type: string;
          condition_value: Json;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          badge_url?: string | null;
          rarity: AchievementRarity;
          xp_reward?: number;
          category: AchievementCategory;
          condition_type: string;
          condition_value: Json;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };

      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: never;
      };

      daily_quests: {
        Row: {
          id: string;
          user_id: string;
          quest_date: string;
          title: string;
          description: string | null;
          quest_type: QuestType;
          target_value: number;
          current_value: number;
          xp_reward: number;
          is_completed: boolean;
          completed_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_date: string;
          title: string;
          description?: string | null;
          quest_type: QuestType;
          target_value: number;
          current_value?: number;
          xp_reward?: number;
          is_completed?: boolean;
          completed_at?: string | null;
          expires_at: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_quests"]["Insert"]>;
      };

      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          insight_type: InsightType;
          title: string;
          content: string;
          is_read: boolean;
          action_url: string | null;
          priority: "high" | "medium" | "low";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          insight_type: InsightType;
          title: string;
          content: string;
          is_read?: boolean;
          action_url?: string | null;
          priority?: "high" | "medium" | "low";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_insights"]["Insert"]>;
      };

      daily_analytics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          focus_minutes: number;
          sessions_count: number;
          goals_completed: number;
          goals_total: number;
          notes_created: number;
          xp_earned: number;
          focus_score: number | null;
          mood: number | null;
          energy_level: number | null;
          streak_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          focus_minutes?: number;
          sessions_count?: number;
          goals_completed?: number;
          goals_total?: number;
          notes_created?: number;
          xp_earned?: number;
          focus_score?: number | null;
          mood?: number | null;
          energy_level?: number | null;
          streak_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["daily_analytics"]["Insert"]>;
      };
    };

    Views: {
      public_leaderboard: {
        Row: {
          username: string;
          avatar_url: string | null;
          total_xp: number;
          current_level: number;
          current_streak: number;
        };
      };
    };

    Functions: {
      award_xp_atomic: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_source: XPSource;
          p_metadata: Json;
        };
        Returns: {
          new_total_xp: number;
          new_level: number;
          leveled_up: boolean;
          xp_transaction_id: string;
        };
      };
      check_and_update_streak: {
        Args: { p_user_id: string };
        Returns: {
          streak_maintained: boolean;
          current_streak: number;
          streak_broken: boolean;
        };
      };
      sync_clerk_user: {
        Args: {
          p_clerk_id: string;
          p_username: string;
          p_display_name?: string | null;
          p_avatar_url?: string | null;
          p_email?: string | null;
        };
        Returns: Json;
      };
      get_dashboard_data: {
        Args: { p_clerk_id: string };
        Returns: Json;
      };
      get_user_id_from_clerk: {
        Args: { p_clerk_id: string };
        Returns: string;
      };
      compute_xp_for_level: {
        Args: { p_level: number };
        Returns: number;
      };
      compute_level_from_xp: {
        Args: { p_total_xp: number };
        Returns: { level: number; xp_in_current_level: number; xp_to_next_level: number };
      };
      complete_focus_session: {
        Args: {
          p_session_id: string;
          p_actual_mins: number;
          p_reflection?: string | null;
        };
        Returns: { xp_awarded: number; focus_score: number; leveled_up: boolean };
      };
      search_notes: {
        Args: {
          p_user_id: string;
          p_query: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Database["public"]["Tables"]["notes"]["Row"][];
      };
    };

    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ─── Domain Types ───────────────────────────────────────

export type XPSource =
  | "focus_session_complete"
  | "focus_session_partial"
  | "goal_complete_daily"
  | "goal_streak_7"
  | "goal_streak_30"
  | "note_created"
  | "flashcard_reviewed"
  | "daily_quest_complete"
  | "weekly_quest_complete"
  | "achievement_unlocked"
  | "streak_maintained"
  | "streak_milestone"
  | "perfect_day"
  | "onboarding_complete"
  | "first_session";

export type GoalCategory =
  | "study"
  | "workout"
  | "reading"
  | "meditation"
  | "sleep"
  | "nutrition"
  | "custom";

export type GoalFrequency = "daily" | "weekly" | "monthly" | "custom";

export type SessionType = "pomodoro" | "deep_work" | "custom" | "short";
export type SessionStatus =
  | "planned"
  | "active"
  | "paused"
  | "completed"
  | "abandoned";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";
export type AchievementCategory =
  | "streak"
  | "focus"
  | "goals"
  | "notes"
  | "social"
  | "special"
  | "seasonal";

export type QuestType = "focus" | "goal" | "note" | "review" | "social";

export type InsightType =
  | "burnout_warning"
  | "peak_hours"
  | "weak_subject"
  | "celebration"
  | "suggestion"
  | "prediction"
  | "streak_risk"
  | "pattern_anomaly";

// ─── Table Row Shorthands ───────────────────────────────

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserXP = Database["public"]["Tables"]["user_xp"]["Row"];
export type Streak = Database["public"]["Tables"]["streaks"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type GoalCompletion =
  Database["public"]["Tables"]["goal_completions"]["Row"];
export type FocusSession =
  Database["public"]["Tables"]["focus_sessions"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement =
  Database["public"]["Tables"]["user_achievements"]["Row"];
export type DailyQuest = Database["public"]["Tables"]["daily_quests"]["Row"];
export type AIInsight = Database["public"]["Tables"]["ai_insights"]["Row"];
export type DailyAnalytics =
  Database["public"]["Tables"]["daily_analytics"]["Row"];
