"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Metric = {
  label: string;
  value: number;
  suffix: string;
};

const transformationCards = [
  {
    title: "Single Origin",
    copy: "Rare lots selected for depth, clarity, and a slow honeyed finish.",
  },
  {
    title: "Artisan Roasting",
    copy: "Small-batch profiles tuned by sight, scent, temperature, and time.",
  },
  {
    title: "Sustainable Sourcing",
    copy: "Long-term farm partnerships built on traceability and better margins.",
  },
];

const metrics: Metric[] = [
  { label: "Roast Quality", value: 98, suffix: "%" },
  { label: "Freshness", value: 24, suffix: "h" },
  { label: "Craftsmanship", value: 12, suffix: "x" },
];

const stages = [
  {
    id: "beans",
    eyebrow: "Stage 01",
    title: "Every Origin Has A Story",
    copy: "Altitude, rainfall, soil, and patience. Before the cup, there is a landscape.",
  },
  {
    id: "transformation",
    eyebrow: "Stage 02",
    title: "The Art Of Transformation",
    copy: "Heat turns structure into aroma, sweetness into silk, and memory into ritual.",
  },
  {
    id: "craft",
    eyebrow: "Stage 03",
    title: "Precision In Every Detail",
    copy: "Each variable is measured, refined, and brought into quiet alignment.",
  },
  {
    id: "finale",
    eyebrow: "Stage 04",
    title: "Luxury In Every Sip",
    copy: "A final plume of steam. A signature mark. A finish designed to linger.",
  },
];

function SplitReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  const wordParts = words.map((word, wordIndex) => ({
    word,
    start: words
      .slice(0, wordIndex)
      .reduce((total, previousWord) => total + previousWord.length, 0),
  }));

  return (
    <span className={className} aria-label={text}>
      {wordParts.map(({ word, start }, wordIndex) => (
        <span className="coffee-word" aria-hidden="true" key={word}>
          {word.split("").map((char, charIndex) => {
            const index = start + charIndex;
            return (
              <span className="coffee-char-mask" key={`${char}-${index}`}>
                <motion.span
                  className="coffee-char"
                  initial={{ y: "115%", opacity: 0, filter: "blur(14px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.72,
                    delay: index * 0.024,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? <span className="coffee-word-space"> </span> : null}
        </span>
      ))}
    </span>
  );
}

function LuxuryPreloader({ ready }: { ready: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (ready) return;

    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + Math.max(1, Math.round((92 - value) * 0.08)), 92));
    }, 90);

    return () => window.clearInterval(timer);
  }, [ready]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-[#030201]"
      initial={{ opacity: 1 }}
      animate={{ opacity: ready ? 0 : 1, visibility: ready ? "hidden" : "visible" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: ready ? 0.25 : 0 }}
      aria-live="polite"
      aria-busy={!ready}
    >
      <div className="coffee-loader-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="coffee-loader-mark">
          <span />
        </div>
        <p className="text-xs uppercase tracking-[0.36em] text-[#c8a15c]">Noir Atelier</p>
        <div className="h-px w-52 overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-[#d6b36a]"
            animate={{ width: `${ready ? 100 : progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="font-mono text-sm text-[#f8ead0]">{ready ? 100 : progress}%</p>
      </div>
    </motion.div>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: 0.5, y: 0.5 };
    const particles = Array.from({ length: 92 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.7 + 0.35,
      speed: Math.random() * 0.00045 + 0.00015,
      drift: (Math.random() - 0.5) * 0.00028,
      alpha: Math.random() * 0.38 + 0.12,
      phase: index * 0.17,
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };

    let frame = 0;
    const render = () => {
      frame += 1;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const particle of particles) {
        particle.y -= particle.speed * (1 + pointer.y * 1.7);
        particle.x += particle.drift + (pointer.x - 0.5) * 0.00045;

        if (particle.y < -0.03) particle.y = 1.03;
        if (particle.x < -0.03) particle.x = 1.03;
        if (particle.x > 1.03) particle.x = -0.03;

        const x = particle.x * window.innerWidth;
        const y = particle.y * window.innerHeight;
        const pulse = Math.sin(frame * 0.018 + particle.phase) * 0.18 + 0.82;

        context.beginPath();
        context.fillStyle = `rgba(214, 179, 106, ${particle.alpha * pulse})`;
        context.arc(x, y, particle.size * pulse, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = requestAnimationFrame(render);
    };

    let animationFrame = requestAnimationFrame(render);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-20 opacity-70 mix-blend-screen" />;
}

function MagneticButton() {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const move = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.18}px, ${y * 0.24}px)`;
    };

    const leave = () => {
      button.style.transform = "translate(0px, 0px)";
    };

    button.addEventListener("pointermove", move);
    button.addEventListener("pointerleave", leave);

    return () => {
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <a ref={buttonRef} href="#collection" className="coffee-magnetic-button group">
      <span>Explore Collection</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </a>
  );
}

function AnimatedMetric({ metric, active }: { metric: Metric; active: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const total = 80;
    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 4);
      setValue(Math.round(metric.value * progress));
      if (frame < total) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, metric.value]);

  return (
    <div className="coffee-metric">
      <span className="font-mono text-[clamp(2rem,5vw,4.7rem)] leading-none text-[#f8ead0]">
        {value}
        {metric.suffix}
      </span>
      <span className="text-xs uppercase tracking-[0.28em] text-[#c8a15c]">{metric.label}</span>
    </div>
  );
}

function StageLayer({
  stage,
  index,
  activeIndex,
}: {
  stage: (typeof stages)[number];
  index: number;
  activeIndex: number;
}) {
  const active = activeIndex === index;

  return (
    <section className="coffee-stage-layer" data-stage={stage.id} aria-hidden={!active}>
      <motion.div
        className="mx-auto grid min-h-dvh w-full max-w-7xl items-center px-6 py-24 md:px-10"
        animate={{
          opacity: active ? 1 : 0,
          y: active ? 0 : 34,
          filter: active ? "blur(0px)" : "blur(20px)",
          pointerEvents: active ? "auto" : "none",
        }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className={`max-w-3xl ${index === 1 ? "md:ml-auto" : ""} ${index === 2 ? "mx-auto text-center" : ""}`}>
          <p className="mb-5 text-xs uppercase tracking-[0.36em] text-[#d6b36a]">{stage.eyebrow}</p>
          <h2 className="coffee-stage-title text-balance">{stage.title}</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#e7d8bd]/78 md:text-lg">{stage.copy}</p>

          {index === 1 && (
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {transformationCards.map((card, cardIndex) => (
                <motion.article
                  className="coffee-glass-panel"
                  key={card.title}
                  animate={{ opacity: active ? 1 : 0, y: active ? 0 : 28 }}
                  transition={{ duration: 0.7, delay: cardIndex * 0.09, ease: [0.19, 1, 0.22, 1] }}
                >
                  <h3 className="text-sm uppercase tracking-[0.2em] text-[#f8ead0]">{card.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#e7d8bd]/68">{card.copy}</p>
                </motion.article>
              ))}
            </div>
          )}

          {index === 2 && (
            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <AnimatedMetric key={metric.label} metric={metric} active={active} />
              ))}
            </div>
          )}

          {index === 3 && (
            <div className="mt-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="coffee-final-mark" aria-label="Noir Atelier logo">
                <span>N</span>
              </div>
              <MagneticButton />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export function CoffeeLanding() {
  const rootRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const reducedMotion = useReducedMotion();
  const prefersReducedMotion = reducedMotion ?? false;
  const visibleStage = prefersReducedMotion ? 3 : activeIndex;

  const stageMarkers = useMemo(() => [0.14, 0.34, 0.57, 0.8], []);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      light.style.setProperty("--mx", `${x}%`);
      light.style.setProperty("--my", `${y}%`);
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      if (video.duration && !Number.isNaN(video.duration)) {
        video.currentTime = 0.01;
      }
      setVideoReady(true);
    };

    if (video.readyState >= 1) {
      const timer = window.setTimeout(markReady, 0);
      return () => window.clearTimeout(timer);
    }

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("canplay", markReady);

    return () => {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("canplay", markReady);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let cleanup = () => {};

    async function initScrollCinema() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const video = videoRef.current;
      const pin = pinRef.current;
      if (!video || !pin) return;

      const setVideoTime = (progress: number) => {
        if (!video.duration || Number.isNaN(video.duration)) return;
        video.currentTime = Math.min(video.duration - 0.04, Math.max(0, video.duration * progress));
      };

      const story = { progress: 0 };
      const tween = gsap.to(story, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=520%",
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            setVideoTime(progress);
            const nextStage = stageMarkers.reduce((closest, marker, index) => (progress >= marker ? index : closest), -1);
            setActiveIndex(nextStage);
          },
        },
      });

      const parallaxItems = gsap.utils.toArray<HTMLElement>("[data-coffee-parallax]");
      const parallaxTweens = parallaxItems.map((item) =>
        gsap.to(item, {
          yPercent: Number(item.dataset.speed ?? -18),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=520%",
            scrub: true,
          },
        })
      );

      cleanup = () => {
        parallaxTweens.forEach((item) => item.kill());
        tween.scrollTrigger?.kill();
        tween.kill();
      };

      ScrollTrigger.refresh();
    }

    initScrollCinema();
    return () => cleanup();
  }, [prefersReducedMotion, stageMarkers]);

  return (
    <main ref={rootRef} className="coffee-luxury min-h-dvh overflow-x-hidden bg-[#030201] text-[#fff7e8]">
      <LuxuryPreloader ready={videoReady} />
      <ParticleField />
      <div ref={lightRef} className="coffee-reactive-light" aria-hidden="true" />

      <div ref={pinRef} className="relative h-dvh overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          poster=""
          aria-label="Cinematic transformation from coffee beans into a luxury coffee logo"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(214,179,106,0.12),transparent_36%),linear-gradient(90deg,rgba(3,2,1,0.78),rgba(3,2,1,0.18)_45%,rgba(3,2,1,0.76))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,2,1,0.42),transparent_30%,rgba(3,2,1,0.78))]" />
        <div className="coffee-film-grain" aria-hidden="true" />

        <div className="pointer-events-none absolute inset-0 z-30">
          {stages.map((stage, index) => (
            <StageLayer key={stage.id} stage={stage} index={index} activeIndex={visibleStage} />
          ))}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-40 mx-auto flex h-dvh max-w-7xl items-center px-6 md:px-10"
          animate={{
            opacity: visibleStage < 0 ? 1 : 0,
            y: visibleStage < 0 ? 0 : -34,
            filter: visibleStage < 0 ? "blur(0px)" : "blur(18px)",
          }}
          transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="max-w-5xl pt-28">
            <p className="mb-6 text-xs uppercase tracking-[0.42em] text-[#d6b36a]">Noir Atelier Coffee</p>
            <h1 className="coffee-hero-title text-balance">
              <SplitReveal text="Crafted Beyond Coffee" />
            </h1>
            <motion.p
              className="mt-6 max-w-xl text-base leading-8 text-[#f8ead0]/80 md:text-xl"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.19, 1, 0.22, 1] }}
            >
              A journey from bean to perfection.
            </motion.p>
          </div>
        </motion.div>

        <div className="absolute bottom-7 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3 text-[#f8ead0]/70">
          <span className="text-[0.62rem] uppercase tracking-[0.34em]">Scroll</span>
          <span className="h-14 w-px overflow-hidden bg-white/15">
            <span className="coffee-scroll-indicator block h-1/2 w-full bg-[#d6b36a]" />
          </span>
        </div>

        <div data-coffee-parallax data-speed="-26" className="coffee-depth-line left-[8%] top-[18%]" />
        <div data-coffee-parallax data-speed="22" className="coffee-depth-line right-[10%] top-[63%]" />
      </div>

      <section id="collection" className="relative z-10 bg-[#030201] px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 border-t border-[#d6b36a]/20 pt-12 md:grid-cols-[1fr_1.2fr]">
          <p className="text-xs uppercase tracking-[0.36em] text-[#d6b36a]">Private Reserve</p>
          <div>
            <h2 className="max-w-3xl text-[clamp(2.2rem,6vw,6rem)] font-medium leading-[0.98] text-[#fff7e8]">
              A collection measured in rarity, not volume.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#e7d8bd]/72">
              Seasonal releases, numbered roasts, and ceremonial blends crafted for the quiet
              hours when taste deserves the full room.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
