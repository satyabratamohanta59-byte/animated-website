import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, hint, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-text-muted flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full rounded-lg bg-[#13131F] border border-white/10",
              "text-text-primary text-sm placeholder:text-text-muted",
              "px-3.5 py-2.5",
              "transition-all duration-150",
              "focus:outline-none focus:border-violet-500/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-rose-500/50 focus:border-rose-500/70 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-text-muted flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
