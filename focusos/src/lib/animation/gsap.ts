"use client";

import type { RefObject } from "react";

// ─── GSAP loader (tree-shaken, client-only) ──────────────

let gsapInstance: typeof import("gsap").gsap | null = null;
let ScrollTriggerPlugin: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
let SplitTextPlugin: unknown = null;

export async function loadGSAP() {
  if (gsapInstance) return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerPlugin };

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  gsapInstance = gsap;
  ScrollTriggerPlugin = ScrollTrigger;

  return { gsap, ScrollTrigger };
}

// ─── Text Reveal (split into chars) ─────────────────────

export async function animateTextReveal(
  element: HTMLElement,
  delay = 0
): Promise<void> {
  const { gsap } = await loadGSAP();

  const text = element.textContent ?? "";
  element.innerHTML = text
    .split("")
    .map((char) =>
      char === " "
        ? " "
        : `<span style="display:inline-block;overflow:hidden"><span class="char" style="display:inline-block">${char}</span></span>`
    )
    .join("");

  const chars = element.querySelectorAll<HTMLElement>(".char");

  gsap.fromTo(
    chars,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.025,
      ease: "expo.out",
      delay,
    }
  );
}

// ─── Count Up Animation ──────────────────────────────────

export async function animateCountUp(
  element: HTMLElement,
  target: number,
  duration = 1.5,
  prefix = "",
  suffix = ""
): Promise<void> {
  const { gsap } = await loadGSAP();
  const obj = { value: 0 };

  gsap.to(obj, {
    value: target,
    duration,
    ease: "expo.out",
    onUpdate() {
      element.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
    },
  });
}

// ─── Stagger Reveal ─────────────────────────────────────

export async function animateStaggerReveal(
  elements: NodeListOf<HTMLElement> | HTMLElement[],
  delay = 0
): Promise<void> {
  const { gsap } = await loadGSAP();

  gsap.fromTo(
    elements,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "expo.out",
      delay,
    }
  );
}

// ─── Scroll-triggered Parallax ───────────────────────────

export async function createParallaxEffect(
  element: HTMLElement,
  speed = 0.3
): Promise<() => void> {
  const { gsap, ScrollTrigger } = await loadGSAP();
  if (!ScrollTrigger) return () => {};

  const tween = gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element.parentElement ?? element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

// ─── Pinned Section ─────────────────────────────────────

export async function createPinnedSection(
  trigger: HTMLElement,
  duration = "200%"
): Promise<() => void> {
  const { ScrollTrigger } = await loadGSAP();
  if (!ScrollTrigger) return () => {};

  const st = ScrollTrigger.create({
    trigger,
    pin: true,
    start: "top top",
    end: `+=${duration}`,
    scrub: 1,
  });

  return () => st.kill();
}

// ─── Timeline for Landing Page Sections ─────────────────

export async function createLandingTimeline(
  containerRef: RefObject<HTMLElement | null>
): Promise<() => void> {
  const { gsap, ScrollTrigger } = await loadGSAP();
  if (!ScrollTrigger || !containerRef.current) return () => {};

  const container = containerRef.current;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      pin: true,
      start: "top top",
      end: "+=400%",
      scrub: 1.5,
      snap: { snapTo: "labels", duration: { min: 0.3, max: 1 }, delay: 0.2 },
    },
  });

  tl.addLabel("start");

  // Animate feature reveals
  const features = container.querySelectorAll<HTMLElement>("[data-feature]");
  features.forEach((el, i) => {
    tl.addLabel(`feature-${i}`);
    tl.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.5 });
  });

  tl.addLabel("end");

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

// ─── Morphing Background ────────────────────────────────

export async function morphBackground(
  element: HTMLElement,
  colors: [string, string],
  duration = 8
): Promise<() => void> {
  const { gsap } = await loadGSAP();

  const tween = gsap.to(element, {
    backgroundImage: `radial-gradient(circle at 50% 50%, ${colors[1]} 0%, transparent 70%)`,
    duration,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  return () => tween.kill();
}

// ─── XP Float Animation ─────────────────────────────────

export function createXPFloat(
  container: HTMLElement,
  amount: number,
  x: number,
  y: number
): void {
  const el = document.createElement("div");
  el.textContent = `+${amount} XP`;
  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    color: #FBBF24;
    font-size: 14px;
    font-weight: 700;
    font-family: var(--font-mono);
    pointer-events: none;
    z-index: 9999;
    text-shadow: 0 0 10px rgba(251,191,36,0.8);
  `;
  document.body.appendChild(el);

  // Animate using Web Animations API for performance
  const animation = el.animate(
    [
      { opacity: 1, transform: "translateY(0px) scale(1)" },
      { opacity: 0, transform: "translateY(-60px) scale(1.2)" },
    ],
    { duration: 1200, easing: "cubic-bezier(0.19, 1, 0.22, 1)" }
  );

  animation.onfinish = () => el.remove();
}
