import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkBoundary } from "@/providers/clerk-boundary";
import { Providers } from "@/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Noir Atelier Coffee | Crafted Beyond Coffee",
    template: "%s | Noir Atelier Coffee",
  },
  description:
    "A cinematic luxury coffee experience following the transformation from origin beans to a premium cup and signature brand reveal.",
  keywords: [
    "luxury coffee",
    "single origin coffee",
    "artisan roasting",
    "premium coffee",
    "specialty coffee",
    "Noir Atelier",
  ],
  authors: [{ name: "Noir Atelier" }],
  creator: "Noir Atelier",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://noiratelier.coffee"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Noir Atelier Coffee | Crafted Beyond Coffee",
    description:
      "A scroll-controlled cinematic journey from coffee bean to luxury brand signature.",
    siteName: "Noir Atelier Coffee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noir Atelier Coffee | Crafted Beyond Coffee",
    description: "A premium scroll-controlled coffee transformation experience.",
    creator: "@noiratelier",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#030201",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-hidden bg-[#030201] text-[#FFF7E8] antialiased">
        <ClerkBoundary>
          <Providers>{children}</Providers>
        </ClerkBoundary>
      </body>
    </html>
  );
}
