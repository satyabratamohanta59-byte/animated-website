"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { useUIStore } from "@/stores/ui-store";

interface SmoothScrollContextValue {
  lenis: unknown | null;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<unknown>(null);
  const reducedMotion = useUIStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    let lenis: {
      raf: (time: number) => void;
      destroy: () => void;
      scrollTo: (target: string | number | HTMLElement, opts?: Record<string, unknown>) => void;
      on: (event: string, callback: (e: unknown) => void) => void;
    } | null = null;

    let rafId: number;

    async function initLenis() {
      const { default: Lenis } = await import("@studio-freight/lenis");

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
      }) as typeof lenis;

      lenisRef.current = lenis;

      // Connect to GSAP ScrollTrigger if available
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        lenis?.on("scroll", () => ScrollTrigger.update());
      } catch {
        // GSAP not loaded yet, that's fine
      }

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: Record<string, unknown>
  ) => {
    const lenis = lenisRef.current as { scrollTo: (t: typeof target, o?: typeof options) => void } | null;
    lenis?.scrollTo(target, options);
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
