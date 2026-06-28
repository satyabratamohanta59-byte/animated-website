import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { XPAnimation, LevelUpEvent, Achievement } from "@/types";
import { getXPProgress } from "@/lib/utils";

interface GamificationStore {
  // State
  totalXP: number;
  currentLevel: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  currentStreak: number;
  longestStreak: number;

  // Animation queue
  pendingXPAnimations: XPAnimation[];
  pendingLevelUp: LevelUpEvent | null;
  pendingAchievement: Achievement | null;
  unreadAchievements: Achievement[];

  // Actions
  setXPData: (data: {
    totalXP: number;
    currentLevel: number;
    xpInCurrentLevel: number;
    xpToNextLevel: number;
  }) => void;
  addXP: (amount: number, source: string) => void;
  triggerLevelUp: (event: LevelUpEvent) => void;
  clearLevelUp: () => void;
  showAchievement: (achievement: Achievement) => void;
  dismissAchievement: () => void;
  clearXPAnimation: (id: string) => void;
  setStreak: (current: number, longest: number) => void;
}

export const useGamificationStore = create<GamificationStore>()(
  subscribeWithSelector((set, get) => ({
    totalXP: 0,
    currentLevel: 1,
    xpInCurrentLevel: 0,
    xpToNextLevel: 1000,
    progressPercent: 0,
    currentStreak: 0,
    longestStreak: 0,
    pendingXPAnimations: [],
    pendingLevelUp: null,
    pendingAchievement: null,
    unreadAchievements: [],

    setXPData: ({ totalXP, currentLevel, xpInCurrentLevel, xpToNextLevel }) => {
      const progressPercent = Math.round((xpInCurrentLevel / xpToNextLevel) * 100);
      set({ totalXP, currentLevel, xpInCurrentLevel, xpToNextLevel, progressPercent });
    },

    addXP: (amount, source) => {
      const id = `xp-${Date.now()}-${Math.random()}`;
      const animation: XPAnimation = {
        id,
        amount,
        source,
        triggeredAt: new Date(),
      };

      // Optimistically update XP
      const { totalXP } = get();
      const newTotal = totalXP + amount;
      const progress = getXPProgress(newTotal);

      set((state) => ({
        totalXP: newTotal,
        currentLevel: progress.level,
        xpInCurrentLevel: progress.xpInLevel,
        xpToNextLevel: progress.xpToNextLevel,
        progressPercent: progress.progressPercent,
        pendingXPAnimations: [...state.pendingXPAnimations, animation],
      }));

      // Auto-clear animation after 2s
      setTimeout(() => get().clearXPAnimation(id), 2000);
    },

    triggerLevelUp: (event) => {
      set({ pendingLevelUp: event });
    },

    clearLevelUp: () => set({ pendingLevelUp: null }),

    showAchievement: (achievement) => {
      set({ pendingAchievement: achievement });
    },

    dismissAchievement: () => {
      set((state) => ({
        pendingAchievement: null,
        unreadAchievements: state.unreadAchievements.filter(
          (a) => a.id !== state.pendingAchievement?.id
        ),
      }));
    },

    clearXPAnimation: (id) => {
      set((state) => ({
        pendingXPAnimations: state.pendingXPAnimations.filter((a) => a.id !== id),
      }));
    },

    setStreak: (current, longest) => {
      set({ currentStreak: current, longestStreak: longest });
    },
  }))
);
