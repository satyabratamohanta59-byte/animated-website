"use client";

import { QueryProvider } from "./query-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SmoothScrollProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#F0F0FF",
              borderRadius: "12px",
              backdropFilter: "blur(20px)",
            },
          }}
          closeButton
        />
      </SmoothScrollProvider>
    </QueryProvider>
  );
}
