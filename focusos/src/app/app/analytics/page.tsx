import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Observatory",
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-text-primary">Observatory</h1>
      <p className="text-sm text-text-muted">Productivity analytics & heatmaps — coming in Phase 7</p>
      <div className="h-96 rounded-2xl bg-white/3 border border-white/6 animate-pulse" />
    </div>
  );
}
