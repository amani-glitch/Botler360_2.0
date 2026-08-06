import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderCaptureProps {
  label: string;
  icon?: LucideIcon;
  variant?: "tile" | "wall";
  /** Hero/demo sections stay dark and product/FAQ sections stay light by
   * design (brief §5), independent of the site's light/dark toggle — so
   * this uses explicit tones rather than theme tokens that would flip. */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Honest stand-in for a real production screenshot that doesn't exist in
 * this repo yet (see brief §12 — Maeva's own concrete dependency). Reuses
 * a plain grid pattern instead of inventing a new visual, and always names
 * what's missing rather than faking a screenshot.
 */
export default function PlaceholderCapture({
  label,
  icon: Icon,
  variant = "tile",
  tone = "light",
  className,
}: PlaceholderCaptureProps) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "relative rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 text-center px-4 py-6",
        variant === "wall" ? "aspect-video" : "aspect-square",
        isDark
          ? "border-white/15 bg-white/[0.03] text-slate-400"
          : "border-slate-300 bg-slate-50 text-slate-500",
        className,
      )}
      style={{
        backgroundImage: isDark
          ? "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
          : "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {Icon && <Icon className="w-6 h-6 opacity-60" />}
      <span className={cn("text-xs font-medium", isDark ? "text-slate-200" : "text-slate-700")}>
        {label}
      </span>
      <span className="text-[10px] opacity-70">Capture à venir</span>
    </div>
  );
}
