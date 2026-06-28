"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClerkBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!clerkPublishableKey && pathname === "/") {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{
        variables: {
          colorPrimary: "#D6B36A",
          colorBackground: "#030201",
          colorInput: "#120B05",
          colorForeground: "#FFF7E8",
          colorNeutral: "#C8A15C",
          colorBorder: "rgba(214,179,106,0.24)",
          borderRadius: "8px",
          fontFamily: "var(--font-geist-sans)",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
