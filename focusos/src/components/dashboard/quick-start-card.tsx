"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SESSION_PRESETS } from "@/lib/constants";

const PRESET_ACCENTS = [
  { bg: "bg-rose-500/12 border-rose-500/25 hover:bg-rose-500/20", text: "text-rose-300", ring: "ring-rose-500/30" },
  { bg: "bg-violet-500/12 border-violet-500/25 hover:bg-violet-500/20", text: "text-violet-300", ring: "ring-violet-500/30" },
  { bg: "bg-cyan-500/12 border-cyan-500/25 hover:bg-cyan-500/20", text: "text-cyan-300", ring: "ring-cyan-500/30" },
  { bg: "bg-emerald-500/12 border-emerald-500/25 hover:bg-emerald-500/20", text: "text-emerald-300", ring: "ring-emerald-500/30" },
];

export function QuickStartCard() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);

  const preset = SESSION_PRESETS[selected];

  const handleStart = () => {
    router.push(
      `/app/focus?preset=${selected}&mins=${preset.focusMins}&break=${preset.breakMins}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
      className="relative flex flex-col gap-5 p-5 rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(34,211,238,0.08) 50%, rgba(19,19,31,1) 100%)",
        border: "1px solid rgba(124,58,237,0.25)",
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/3 pointer-events-none" />

      <div className="relative">
        <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium mb-1">
          Quick Start
        </p>
        <h3 className="text-lg font-bold text-text-primary">
          Focus Engine
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Pick a session type and dive in
        </p>
      </div>

      {/* Preset selector */}
      <div className="relative grid grid-cols-2 gap-2">
        {SESSION_PRESETS.map((p, i) => {
          const accent = PRESET_ACCENTS[i];
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-200",
                accent.bg,
                isSelected && `ring-2 ${accent.ring}`
              )}
            >
              <span className="text-lg">{p.icon}</span>
              <span className={cn("text-xs font-semibold", accent.text)}>
                {p.label}
              </span>
              <span className="text-[10px] text-text-muted">
                {p.focusMins}m / {p.breakMins}m break
              </span>
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <motion.button
        onClick={handleStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full py-3 rounded-xl font-bold text-sm text-white overflow-hidden transition-all"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
          boxShadow: "0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <span className="relative flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Start {preset.icon} {preset.label}
        </span>
      </motion.button>
    </motion.div>
  );
}
