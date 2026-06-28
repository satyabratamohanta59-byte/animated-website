import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/8 border-white/10 text-text-secondary text-xs px-2.5 py-0.5",
        primary: "bg-violet-500/15 border-violet-500/30 text-violet-300 text-xs px-2.5 py-0.5",
        secondary: "bg-white/6 border-white/8 text-text-muted text-xs px-2.5 py-0.5",
        success: "bg-emerald-500/12 border-emerald-500/25 text-emerald-400 text-xs px-2.5 py-0.5",
        warning: "bg-amber-500/12 border-amber-500/25 text-amber-400 text-xs px-2.5 py-0.5",
        danger: "bg-rose-500/12 border-rose-500/25 text-rose-400 text-xs px-2.5 py-0.5",
        xp: "bg-amber-400/15 border-amber-400/30 text-amber-400 text-xs px-2.5 py-0.5 font-mono",
        level: "bg-violet-500/20 border-violet-500/40 text-violet-300 text-xs px-3 py-1",
        streak: "bg-orange-500/12 border-orange-500/25 text-orange-400 text-xs px-2.5 py-0.5",
        // Rarity
        common: "bg-white/6 border-white/10 text-text-muted text-xs px-2.5 py-0.5",
        rare: "bg-cyan-500/12 border-cyan-500/25 text-cyan-400 text-xs px-2.5 py-0.5",
        epic: "bg-violet-500/15 border-violet-500/35 text-violet-300 text-xs px-2.5 py-0.5",
        legendary: "bg-amber-400/15 border-amber-400/35 text-amber-300 text-xs px-2.5 py-0.5 shadow-[0_0_8px_rgba(251,191,36,0.2)]",
        new: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 text-[10px] px-2 py-0.5 uppercase tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
