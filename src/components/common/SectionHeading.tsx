import React from "react";
import { cn } from "@/lib/utils/cn";
import { DecorativeMotif } from "./DecorativeMotif";

interface SectionHeadingProps {
  badge?: string;
  badgeHindi?: string;
  title: string;
  titleHindi?: string;
  subtitle?: string;
  subtitleHindi?: string;
  align?: "left" | "center";
  showMotif?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  badgeHindi,
  title,
  titleHindi,
  subtitle,
  subtitleHindi,
  align = "center",
  showMotif = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-10 sm:mb-14",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-800 border border-gold-300/70 mb-3 tracking-wider uppercase">
          {badge} {badgeHindi && <span className="font-hindi ml-1">({badgeHindi})</span>}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-royal-950 tracking-tight leading-tight">
        {title}
        {titleHindi && (
          <span className="block font-hindi text-2xl sm:text-3xl lg:text-4xl font-normal text-magenta-700 mt-1">
            {titleHindi}
          </span>
        )}
      </h2>

      {showMotif && <DecorativeMotif className="mt-3 mb-2" />}

      {subtitle && (
        <p className="mt-2 text-stone-600 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
          {subtitle}
          {subtitleHindi && (
            <span className="block font-hindi text-stone-500 text-sm sm:text-base mt-1">
              {subtitleHindi}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
