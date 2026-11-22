import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs font-semibold tracking-wide",
    md: "px-6 py-2.5 text-sm font-semibold tracking-wide shadow-sm",
    lg: "px-8 py-3.5 text-base font-semibold tracking-wide shadow-md",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-royal-800 to-magenta-700 text-white hover:from-royal-900 hover:to-magenta-800 focus:ring-royal-500 shadow-royal-glow/20",
    gold:
      "bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-royal-950 hover:brightness-105 font-bold shadow-gold-glow/40 focus:ring-gold-400 border border-gold-200/50",
    secondary:
      "bg-ivory-200 text-royal-900 hover:bg-ivory-300 border border-ivory-300 focus:ring-royal-400",
    outline:
      "border-2 border-gold-500 text-royal-900 hover:bg-gold-50 hover:border-gold-600 focus:ring-gold-400",
    ghost:
      "text-royal-800 hover:bg-royal-50/80 hover:text-royal-950 focus:ring-royal-400",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
