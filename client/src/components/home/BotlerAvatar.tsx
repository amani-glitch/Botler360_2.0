import { cn } from "@/lib/utils";

interface BotlerAvatarProps {
  size?: number;
  showLabel?: boolean;
  className?: string;
}

/**
 * Temporary Botler avatar (brief §4 Q3 — a clean, single Botler avatar is
 * its own design deliverable that doesn't exist in this repo yet). Reuses
 * the existing, previously-unused botler-logo.png (a clean headshot crop
 * with no wordmark) rather than the full logo, which bakes in "by Best of
 * Tours Ltd." — a different legal name than the Botler 360 Ltd entity used
 * in the footer/legal pages.
 */
export default function BotlerAvatar({ size = 64, showLabel = false, className }: BotlerAvatarProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <div
        className="relative rounded-full overflow-hidden ring-2 ring-amber-500/40 bg-slate-900 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src="/images/botler-logo.png"
          alt="Botler"
          className="w-full h-full object-cover object-top"
          loading="eager"
          decoding="async"
        />
      </div>
      {showLabel && (
        <span className="text-[10px] text-muted-foreground/70 text-center">
          Avatar temporaire
        </span>
      )}
    </div>
  );
}
