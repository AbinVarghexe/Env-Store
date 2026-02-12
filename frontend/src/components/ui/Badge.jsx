"use client";

import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]",
    secondary:
      "bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] border border-[rgb(var(--border))]",
    outline: "border border-[rgb(var(--border))] text-[rgb(var(--foreground))]",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
