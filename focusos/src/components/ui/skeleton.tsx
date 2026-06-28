import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  lines = 1,
  ...props
}: SkeletonProps) {
  const base = cn(
    "animate-pulse bg-white/5 rounded-lg",
    variant === "circular" && "rounded-full",
    variant === "text" && "h-4 rounded",
    className
  );

  if (variant === "text" && lines > 1) {
    return (
      <div className="flex flex-col gap-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(base, i === lines - 1 && "w-3/4")}
            style={{
              width: i === lines - 1 ? "75%" : "100%",
              height: height ?? 16,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={base}
      style={{
        width: width ?? "100%",
        height: height ?? (variant === "text" ? 16 : "auto"),
      }}
      {...props}
    />
  );
}

// ─── Shimmer Skeleton ────────────────────────────────────

export function ShimmerSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-white/5",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        "before:animate-[shimmer_1.5s_ease-in-out_infinite]",
        "before:bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}
