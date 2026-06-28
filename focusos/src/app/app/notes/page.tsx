import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Vault",
};

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-bold text-text-primary">Knowledge Vault</h1>
      <p className="text-sm text-text-muted">Rich text notes with AI & flashcards — coming in Phase 4</p>
      <div className="h-96 rounded-2xl bg-white/3 border border-white/6 animate-pulse" />
    </div>
  );
}
