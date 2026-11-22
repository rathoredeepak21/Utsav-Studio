import React from "react";
import { cn } from "@/lib/utils/cn";

interface DecorativeMotifProps {
  type?: "flourish" | "lotus" | "kalash" | "mandala";
  className?: string;
}

export function DecorativeMotif({ type = "flourish", className }: DecorativeMotifProps) {
  if (type === "lotus") {
    return (
      <svg
        viewBox="0 0 100 60"
        className={cn("w-16 h-10 text-gold-500 fill-current", className)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 5 C45 25, 20 28, 10 45 C25 45, 38 38, 48 48 C49 32, 45 15, 50 5 Z" opacity="0.85" />
        <path d="M50 5 C55 25, 80 28, 90 45 C75 45, 62 38, 52 48 C51 32, 55 15, 50 5 Z" opacity="0.85" />
        <path d="M50 5 C42 22, 38 35, 50 52 C62 35, 58 22, 50 5 Z" />
        <circle cx="50" cy="54" r="2.5" />
      </svg>
    );
  }

  if (type === "mandala") {
    return (
      <svg
        viewBox="0 0 100 100"
        className={cn("w-20 h-20 text-gold-400 stroke-current fill-none", className)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="35" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="20" strokeWidth="1" />
        <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" strokeWidth="0.75" opacity="0.6" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    );
  }

  // Default elegant ceremonial flourish
  return (
    <div className={cn("inline-flex items-center justify-center space-x-2 text-gold-500", className)}>
      <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-current text-gold-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
      </svg>
      <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
    </div>
  );
}
