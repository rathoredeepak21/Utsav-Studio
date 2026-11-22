import React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "royal" | "magenta" | "success" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  const variantStyles = {
    gold: "bg-gold-50 text-gold-800 border-gold-300/80",
    royal: "bg-royal-50 text-royal-800 border-royal-200",
    magenta: "bg-magenta-50 text-magenta-800 border-magenta-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
