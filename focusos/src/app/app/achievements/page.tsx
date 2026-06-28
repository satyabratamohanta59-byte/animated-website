import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trophy Room",
};

export default function AchievementsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-text-primary">Trophy Room</h1>
      <p className="text-sm text-text-muted">Achievements & gamification — coming in Phase 6</p>
      <div className="h-96 rounded-2xl bg-white/3 border border-white/6 animate-pulse" />
    </div>
  );
}
