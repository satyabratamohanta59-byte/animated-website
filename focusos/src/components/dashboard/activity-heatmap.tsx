"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HeatmapEntry } from "@/lib/dashboard";

interface ActivityHeatmapProps {
  data: HeatmapEntry[];
  totalFocusMinutes: number;
}

const INTENSITY_COLORS = [
  "bg-white/5 border-white/4",           // 0 - empty
  "bg-violet-900/60 border-violet-800/40", // 1 - light
  "bg-violet-700/70 border-violet-600/50", // 2 - medium
  "bg-violet-500/80 border-violet-400/60", // 3 - strong
  "bg-violet-400 border-violet-300/70 shadow-[0_0_6px_rgba(167,139,250,0.5)]", // 4 - max
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["", "Mon", "", "Wed", "", "Fri", ""];

interface TooltipState {
  entry: HeatmapEntry;
  x: number;
  y: number;
}

function formatMinutes(mins: number): string {
  if (mins === 0) return "No activity";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function ActivityHeatmap({ data, totalFocusMinutes }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Group data into weeks (columns of 7)
  const { weeks, monthLabels } = useMemo(() => {
    const allDays = [...data];
    // Pad to start on Sunday
    const firstDate = allDays[0] ? new Date(allDays[0].date) : new Date();
    const startPad = firstDate.getDay(); // 0=Sun
    const padded: (HeatmapEntry | null)[] = [
      ...Array(startPad).fill(null),
      ...allDays,
    ];

    const numWeeks = Math.ceil(padded.length / 7);
    const weeks: (HeatmapEntry | null)[][] = [];
    for (let w = 0; w < numWeeks; w++) {
      weeks.push(padded.slice(w * 7, w * 7 + 7));
    }

    // Month labels: find which column each month starts in
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    allDays.forEach((d) => {
      const date = new Date(d.date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        const dayIndex = data.indexOf(d) + startPad;
        const col = Math.floor(dayIndex / 7);
        if (col < weeks.length - 1) {
          labels.push({ label: MONTHS[month], col });
        }
        lastMonth = month;
      }
    });

    return { weeks, monthLabels: labels };
  }, [data]);

  const totalActiveDays = data.filter((d) => d.minutes > 0).length;
  const totalHours = Math.floor(totalFocusMinutes / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-col gap-4 p-5 rounded-2xl bg-[#13131F] border border-white/6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium mb-0.5">
            Focus Activity
          </p>
          <h3 className="text-sm font-bold text-text-primary">
            {totalHours}h total · {totalActiveDays} active days
          </h3>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-muted">Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn("w-3 h-3 rounded-sm border", INTENSITY_COLORS[i])}
            />
          ))}
          <span className="text-[10px] text-text-muted">More</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: `${weeks.length * 14 + 24}px` }}>
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: "24px" }}>
            {weeks.map((_, colIdx) => {
              const monthLabel = monthLabels.find((m) => m.col === colIdx);
              return (
                <div
                  key={colIdx}
                  className="flex-shrink-0 text-[9px] text-text-muted/70"
                  style={{ width: "14px" }}
                >
                  {monthLabel ? monthLabel.label : ""}
                </div>
              );
            })}
          </div>

          {/* Day labels + Grid */}
          <div className="flex gap-0">
            {/* Day labels column */}
            <div className="flex flex-col justify-between pr-1" style={{ width: "24px" }}>
              {DAYS.map((day, i) => (
                <div
                  key={i}
                  className="text-[9px] text-text-muted/60 leading-none"
                  style={{ height: "12px", lineHeight: "12px" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap columns */}
            <div className="flex gap-0.5">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-0.5">
                  {week.map((entry, rowIdx) => {
                    if (!entry) {
                      return (
                        <div
                          key={rowIdx}
                          className="w-3 h-3 rounded-sm"
                        />
                      );
                    }
                    return (
                      <div
                        key={rowIdx}
                        className={cn(
                          "w-3 h-3 rounded-sm border cursor-pointer transition-transform hover:scale-125",
                          INTENSITY_COLORS[entry.intensity]
                        )}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            entry,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-50 px-2.5 py-1.5 rounded-lg bg-[#1A1A2E] border border-white/12 shadow-xl text-xs pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 6,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-semibold text-text-primary">
            {formatMinutes(tooltip.entry.minutes)}
          </p>
          <p className="text-text-muted text-[10px]">
            {new Date(tooltip.entry.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {tooltip.entry.sessionsCount > 0 && (
            <p className="text-violet-400 text-[10px]">
              {tooltip.entry.sessionsCount} session{tooltip.entry.sessionsCount > 1 ? "s" : ""}
              {tooltip.entry.xpEarned > 0 ? ` · +${tooltip.entry.xpEarned} XP` : ""}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
