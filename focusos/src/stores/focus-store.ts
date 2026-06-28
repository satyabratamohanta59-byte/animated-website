import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { ActiveSession, AmbientSound, TimerStatus } from "@/types";

interface FocusStore {
  session: ActiveSession | null;
  isDeepFocusMode: boolean;
  ambientVolume: number;

  // Actions
  startSession: (config: {
    goalId: string | null;
    plannedMins: number;
    breakMins: number;
    ambientSound: AmbientSound | null;
    sessionId: string;
  }) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  tickSecond: () => void;
  startBreak: () => void;
  endSession: () => ActiveSession | null;
  abandonSession: () => void;
  setAmbientSound: (sound: AmbientSound | null) => void;
  setAmbientVolume: (volume: number) => void;
  toggleDeepFocusMode: () => void;
  resetSession: () => void;
}

export const useFocusStore = create<FocusStore>()(
  subscribeWithSelector((set, get) => ({
    session: null,
    isDeepFocusMode: false,
    ambientVolume: 0.5,

    startSession: ({ goalId, plannedMins, breakMins, ambientSound, sessionId }) => {
      set({
        session: {
          id: sessionId,
          status: "running" as TimerStatus,
          plannedMins,
          remainingSeconds: plannedMins * 60,
          breakRemainingSeconds: breakMins * 60,
          breakMins,
          ambientSound,
          goalId,
          startedAt: new Date(),
          sessionsCompleted: 0,
        },
      });
    },

    pauseSession: () => {
      set((state) => {
        if (!state.session || state.session.status !== "running") return state;
        return { session: { ...state.session, status: "paused" as TimerStatus } };
      });
    },

    resumeSession: () => {
      set((state) => {
        if (!state.session) return state;
        return { session: { ...state.session, status: "running" as TimerStatus } };
      });
    },

    tickSecond: () => {
      const { session } = get();
      if (!session) return;

      if (session.status === "running") {
        const newRemaining = session.remainingSeconds - 1;

        if (newRemaining <= 0) {
          // Session complete — go to break
          set({
            session: {
              ...session,
              remainingSeconds: 0,
              status: "break" as TimerStatus,
              sessionsCompleted: session.sessionsCompleted + 1,
            },
          });
        } else {
          set({ session: { ...session, remainingSeconds: newRemaining } });
        }
      } else if (session.status === "break") {
        const newBreakRemaining = session.breakRemainingSeconds - 1;

        if (newBreakRemaining <= 0) {
          // Break over — session completed
          set({
            session: {
              ...session,
              breakRemainingSeconds: 0,
              status: "completed" as TimerStatus,
            },
          });
        } else {
          set({ session: { ...session, breakRemainingSeconds: newBreakRemaining } });
        }
      }
    },

    startBreak: () => {
      set((state) => {
        if (!state.session) return state;
        return {
          session: {
            ...state.session,
            status: "break" as TimerStatus,
            breakRemainingSeconds: state.session.breakMins * 60,
            sessionsCompleted: state.session.sessionsCompleted + 1,
          },
        };
      });
    },

    endSession: () => {
      const { session } = get();
      set({ session: null, isDeepFocusMode: false });
      return session;
    },

    abandonSession: () => {
      set((state) => ({
        session: state.session
          ? { ...state.session, status: "abandoned" as TimerStatus }
          : null,
        isDeepFocusMode: false,
      }));
      setTimeout(() => set({ session: null }), 100);
    },

    setAmbientSound: (sound) => {
      set((state) => ({
        session: state.session ? { ...state.session, ambientSound: sound } : null,
      }));
    },

    setAmbientVolume: (volume) => set({ ambientVolume: volume }),

    toggleDeepFocusMode: () =>
      set((state) => ({ isDeepFocusMode: !state.isDeepFocusMode })),

    resetSession: () =>
      set({ session: null, isDeepFocusMode: false }),
  }))
);

// ─── Selectors ───────────────────────────────────────────

export const selectSession = (s: FocusStore) => s.session;
export const selectTimerStatus = (s: FocusStore) => s.session?.status ?? "idle";
export const selectRemainingSeconds = (s: FocusStore) =>
  s.session?.remainingSeconds ?? 0;
export const selectIsRunning = (s: FocusStore) =>
  s.session?.status === "running";
export const selectProgressPercent = (s: FocusStore) => {
  if (!s.session) return 0;
  const total = s.session.plannedMins * 60;
  const elapsed = total - s.session.remainingSeconds;
  return Math.round((elapsed / total) * 100);
};
