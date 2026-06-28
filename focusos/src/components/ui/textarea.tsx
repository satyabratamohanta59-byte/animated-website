import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full resize-none rounded-xl border px-3 py-2.5 text-sm",
            "bg-white/4 border-white/10",
            "text-text-primary placeholder:text-text-muted",
            "transition-colors duration-150",
            "focus:outline-none focus:border-violet-500/50 focus:bg-white/6 focus:ring-1 focus:ring-violet-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p className={cn("text-[11px]", error ? "text-rose-400" : "text-text-muted")}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
