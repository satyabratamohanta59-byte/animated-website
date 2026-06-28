import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Sign In",
    template: "%s | FocusOS",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#080810] relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)" }}
        />
      </div>

      {/* Branding */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center text-sm font-bold shadow-[0_0_16px_rgba(124,58,237,0.5)]">
          ⚡
        </div>
        <span className="font-bold text-sm text-text-primary tracking-tight">FocusOS</span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
