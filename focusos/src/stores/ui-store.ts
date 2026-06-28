import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppTheme = "dark" | "cosmic" | "forest";

interface UIStore {
  // Layout
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeModal: string | null;
  modalProps: Record<string, unknown>;

  // Preferences
  theme: AppTheme;
  reducedMotion: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;

  // Onboarding
  onboardingStep: number;
  tourCompleted: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openModal: (name: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
  setTheme: (theme: AppTheme) => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleSound: () => void;
  setOnboardingStep: (step: number) => void;
  completeTour: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      activeModal: null,
      modalProps: {},
      theme: "dark",
      reducedMotion: false,
      soundEnabled: true,
      notificationsEnabled: true,
      onboardingStep: 0,
      tourCompleted: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      openCommandPalette: () =>
        set({ commandPaletteOpen: true }),

      closeCommandPalette: () =>
        set({ commandPaletteOpen: false }),

      openModal: (name, props = {}) =>
        set({ activeModal: name, modalProps: props }),

      closeModal: () =>
        set({ activeModal: null, modalProps: {} }),

      setTheme: (theme) => set({ theme }),

      setReducedMotion: (reducedMotion) => set({ reducedMotion }),

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),

      completeTour: () => set({ tourCompleted: true }),
    }),
    {
      name: "focusos-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        reducedMotion: state.reducedMotion,
        soundEnabled: state.soundEnabled,
        tourCompleted: state.tourCompleted,
      }),
    }
  )
);
