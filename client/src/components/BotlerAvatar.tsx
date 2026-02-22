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

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow ping when talking */}
      {isTalking && (
        <div
          className="absolute -inset-1 rounded-full bg-amber-400/25"
          style={{
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
      <div className="absolute inset-[2.5px] rounded-full bg-[#f5c518]" />

      {/* Botler character face */}
      <img
        src="/images/botler-logo.png"
        alt="Botler"
        draggable={false}
        className="absolute inset-[2.5px] rounded-full object-cover"
        style={{ objectPosition: "center 20%" }}
      />

      {/* Breathing scale for idle */}
      {state === "idle" && (
        <div
          className="absolute inset-0 rounded-full border-2 border-amber-500/20"
          style={{
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Voice bars when talking */}
      {isTalking && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-end gap-[2px]">
          <span
            className="rounded-full bg-amber-500"
            style={{
              width: size > 36 ? 3 : 2,
              animation: "bounce 0.5s ease-in-out infinite",
              animationDelay: "0ms",
              height: size > 36 ? 8 : 5,
            }}
          />
          <span
            className="rounded-full bg-amber-400"
            style={{
              width: size > 36 ? 3 : 2,
              animation: "bounce 0.4s ease-in-out infinite",
              animationDelay: "120ms",
              height: size > 36 ? 12 : 7,
            }}
          />
          <span
            className="rounded-full bg-amber-500"
            style={{
              width: size > 36 ? 3 : 2,
              animation: "bounce 0.45s ease-in-out infinite",
              animationDelay: "60ms",
              height: size > 36 ? 10 : 6,
            }}
          />
          <span
            className="rounded-full bg-amber-400"
            style={{
              width: size > 36 ? 3 : 2,
              animation: "bounce 0.35s ease-in-out infinite",
              animationDelay: "180ms",
              height: size > 36 ? 7 : 4,
            }}
          />
        </div>
      )}

      {/* Mic pulse when listening */}
      {isListening && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <div
            className="rounded-full bg-red-500"
            style={{
              width: size > 36 ? 10 : 7,
              height: size > 36 ? 10 : 7,
              animation: "pulse 1s ease-in-out infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
