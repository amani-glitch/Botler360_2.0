interface BotlerAvatarProps {
  state?: "idle" | "talking" | "listening";
  size?: number;
  className?: string;
}

export default function BotlerAvatar({
  state = "idle",
  size = 44,
  className = "",
}: BotlerAvatarProps) {
  const isTalking = state === "talking";
  const isListening = state === "listening";

  // Scale all decorations proportionally
  const scale = size / 44; // 44px = base reference
  const borderWidth = Math.max(2, Math.round(2.5 * scale));
  const barWidth = Math.max(2, Math.round(3 * scale));
  const barGap = Math.max(1, Math.round(2 * scale));
  const micSize = Math.max(6, Math.round(10 * scale));

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow ping when talking */}
      {isTalking && (
        <div
          className="absolute rounded-full bg-amber-400/25"
          style={{
            inset: -Math.round(4 * scale),
            animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
      )}

      {/* Border ring — navy (idle), amber (talking), red (listening) */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isTalking
            ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/40"
            : isListening
              ? "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/40"
              : "bg-[#1e2a4a]"
        }`}
      />

      {/* Golden background (matches logo circle) */}
      <div
        className="absolute rounded-full bg-[#f5c518]"
        style={{ inset: borderWidth }}
      />

      {/* Botler character face */}
      <img
        src="/images/botler-logo.png"
        alt="Botler"
        draggable={false}
        className="absolute rounded-full object-cover"
        style={{ inset: borderWidth, objectPosition: "center 20%" }}
      />

      {/* Breathing scale for idle */}
      {state === "idle" && (
        <div
          className="absolute inset-0 rounded-full border-2 border-amber-500/20"
          style={{ animation: "pulse 3s ease-in-out infinite" }}
        />
      )}

      {/* Voice bars when talking */}
      {isTalking && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-end"
          style={{ bottom: -Math.round(2 * scale), gap: barGap }}
        >
          {[
            { h: 8, dur: "0.5s", delay: "0ms" },
            { h: 12, dur: "0.4s", delay: "120ms" },
            { h: 10, dur: "0.45s", delay: "60ms" },
            { h: 7, dur: "0.35s", delay: "180ms" },
          ].map((bar, i) => (
            <span
              key={i}
              className={`rounded-full ${i % 2 === 0 ? "bg-amber-500" : "bg-amber-400"}`}
              style={{
                width: barWidth,
                height: Math.round(bar.h * scale),
                animation: `bounce ${bar.dur} ease-in-out infinite`,
                animationDelay: bar.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Mic pulse when listening */}
      {isListening && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: -Math.round(4 * scale) }}
        >
          <div
            className="rounded-full bg-red-500"
            style={{
              width: micSize,
              height: micSize,
              animation: "pulse 1s ease-in-out infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
