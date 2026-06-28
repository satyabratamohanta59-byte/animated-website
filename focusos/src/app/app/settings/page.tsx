import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-3">
        {["Account", "Appearance", "Notifications", "Privacy", "Subscription"].map((section) => (
          <div
            key={section}
            className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/6"
          >
            <span className="text-sm font-medium text-text-primary">{section}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
