import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focus Engine",
};

export default function FocusPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-xl font-bold text-text-primary text-center mb-2">Focus Engine</h1>
        <p className="text-sm text-text-muted text-center">Pomodoro & deep work timer — coming in Phase 3</p>
        <div className="mt-8 h-64 rounded-2xl bg-white/3 border border-white/6 animate-pulse" />
      </div>
    </div>
  );
}
