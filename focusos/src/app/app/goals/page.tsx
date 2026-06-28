import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quest Board",
};

export default function GoalsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-text-primary">Quest Board</h1>
      <p className="text-sm text-text-muted">Goal tracking & habit system — coming in Phase 5</p>
      <div className="h-96 rounded-2xl bg-white/3 border border-white/6 animate-pulse" />
    </div>
  );
}
