import { useState, useRef, useEffect, useCallback } from "react";
import { PhoneOff, ArrowLeft, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import BotlerAvatar from "@/components/BotlerAvatar";
import {
  connectGeminiLive,
  encodeBytes,
  decodeBase64,
  pcmToAudioBuffer,
} from "@/lib/gemini-live";

interface LiveVoiceAgentProps {
  onClose: () => void;
}

interface TranscriptEntry {
  speaker: "user" | "assistant";
  text: string;
}

export default function LiveVoiceAgent({ onClose }: LiveVoiceAgentProps) {
  const [status, setStatus] = useState<"ready" | "connecting" | "active" | "saving" | "error">("ready");
  const [errorMsg, setErrorMsg] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Audio refs
  const sessionRef = useRef<Awaited<ReturnType<typeof connectGeminiLive>> | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (showTranscript) {
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript, showTranscript]);

  // ── Start session ──────────────────────────────────────
  const handleStart = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg("");

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Cle API Gemini manquante. Ajoutez VITE_GEMINI_API_KEY dans .env");
      }

      // Fetch voice config (system prompt + voice) from server
      const configRes = await fetch("/api/voice-config");
      if (!configRes.ok) throw new Error("Impossible de charger la configuration vocale");
      const voiceConfig = await configRes.json();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;

      const session = await connectGeminiLive(
        { systemInstruction: voiceConfig.systemInstruction, voiceName: voiceConfig.voiceName || "Puck" },
        {
          onAudio: (base64) => {
            const ctx = outputCtxRef.current;
            if (!ctx || ctx.state === "closed") return;
            setIsSpeaking(true);

            const pcm = decodeBase64(base64);
            const buffer = pcmToAudioBuffer(pcm, ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);

            const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;

            audioSourcesRef.current.add(source);
            source.onended = () => {
              audioSourcesRef.current.delete(source);
              if (audioSourcesRef.current.size === 0) setIsSpeaking(false);
            };
          },
          onInterrupted: () => {
            audioSourcesRef.current.forEach((s) => {
              try { s.stop(); } catch {}
            });
            audioSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setIsSpeaking(false);
          },
          onTranscription: (text, isUser) => {
            if (!text.trim()) return;
            setTranscript((prev) => [
              ...prev,
              { speaker: isUser ? "user" : "assistant", text: text.trim() },
            ]);
          },
          onTurnComplete: () => {},
        }
      );

      sessionRef.current = session;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        try {
          session.sendRealtimeInput({
            audio: {
              data: encodeBytes(new Uint8Array(int16.buffer)),
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } catch (err) {
          console.warn("[LiveVoice] Send audio:", err);
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      setStatus("active");
    } catch (err) {
      console.error("[LiveVoice] Connection failed:", err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, []);

  // ── Cleanup ────────────────────────────────────────────
  const cleanup = useCallback(() => {
    try { sessionRef.current?.close(); } catch {}
    sessionRef.current = null;

    audioSourcesRef.current.forEach((s) => {
      try { s.stop(); } catch {}
    });
    audioSourcesRef.current.clear();

    try { processorRef.current?.disconnect(); } catch {}
    try { inputCtxRef.current?.close(); } catch {}
    try { outputCtxRef.current?.close(); } catch {}

    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // ── Hang up → save to CRM ─────────────────────────────
  const handleHangUp = useCallback(async () => {
    cleanup();

    // If we have transcript, save to CRM
    if (transcript.length > 0) {
      setStatus("saving");

      const transcriptText = transcript
        .map((e) => `${e.speaker === "user" ? "PROSPECT" : "BOTLER"}: ${e.text}`)
        .join("\n");

      try {
        const res = await fetch("/api/voice-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
          body: JSON.stringify({ transcript: transcriptText }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log("[LiveVoice] CRM saved:", data);
        } else {
          console.warn("[LiveVoice] CRM save failed:", res.status);
        }
      } catch (err) {
        console.warn("[LiveVoice] CRM save error:", err);
      }
    }

    onClose();
  }, [cleanup, onClose, transcript]);

  // ── Last transcript line (for subtle display) ──────────
  const lastEntry = transcript[transcript.length - 1];

  // ── Ready screen ───────────────────────────────────────
  if (status === "ready") {
    return (
      <div role="dialog" aria-label="Agent vocal Botler" className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <button onClick={onClose} aria-label="Retour au chat texte" className="text-white/50 hover:text-white cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BotlerAvatar state="idle" size={36} />
          <div>
            <span className="text-white font-semibold text-sm">Botler</span>
            <div className="text-xs text-white/50">Agent vocal</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
          {/* Large portrait avatar */}
          <div className="relative">
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-amber-500/8 flex items-center justify-center">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-amber-500/12 flex items-center justify-center">
                <BotlerAvatar state="idle" size={260} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-white text-xl font-semibold mb-3">
              Parler avec Botler
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
              Appuyez sur Demarrer pour activer le micro et discuter avec Botler en temps reel.
            </p>
          </div>

          <button
            onClick={handleStart}
            aria-label="Démarrer la conversation vocale"
            className="px-12 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-lg cursor-pointer shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all"
          >
            Demarrer
          </button>

          <button
            onClick={onClose}
            aria-label="Revenir au chat texte"
            className="text-white/40 text-sm cursor-pointer hover:text-white/60"
          >
            Revenir au chat texte
          </button>
        </div>
      </div>
    );
  }

  // ── Saving screen ──────────────────────────────────────
  if (status === "saving") {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" style={{ inset: -20 }} />
          <BotlerAvatar state="talking" size={120} />
        </div>
        <div className="flex items-center gap-2 text-amber-400 text-sm mt-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Enregistrement dans le CRM...
        </div>
      </div>
    );
  }

  // ── Main live voice UI ─────────────────────────────────
  return (
    <div role="dialog" aria-label="Conversation vocale Botler" className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <button
          onClick={() => {
            if (status === "active" && transcript.length > 2) {
              if (!confirm("Quitter la conversation ?")) return;
            }
            handleHangUp();
          }}
          aria-label="Quitter la conversation vocale"
          className="text-white/50 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <BotlerAvatar state={isSpeaking ? "talking" : "listening"} size={36} />
        <div className="flex-1">
          <span className="text-white font-semibold text-sm">Botler</span>
          <div className="text-xs text-white/50">
            {status === "connecting" && "Connexion en cours..."}
            {status === "active" && (isSpeaking ? "parle..." : "ecoute...")}
            {status === "error" && "Erreur de connexion"}
          </div>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
            status === "active"
              ? "bg-emerald-500/20 text-emerald-400"
              : status === "connecting"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-red-500/20 text-red-400"
          }`}
        >
          {status === "active" ? "EN LIGNE" : status === "connecting" ? "CONNEXION" : "ERREUR"}
        </div>
      </div>

      {/* Main visual — large portrait avatar centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        {/* Animated rings + big avatar */}
        <div className="relative">
          {/* Outer ring 3 — slow pulse */}
          <div
            className={`absolute rounded-full transition-all duration-700 ${
              isSpeaking
                ? "bg-amber-500/6 scale-100"
                : "bg-amber-500/3 scale-95"
            }`}
            style={{
              inset: -44,
              animation: isSpeaking ? "pulse 2s ease-in-out infinite" : "pulse 4s ease-in-out infinite",
            }}
          />
          {/* Outer ring 2 */}
          <div
            className={`absolute rounded-full transition-all duration-500 ${
              isSpeaking
                ? "bg-amber-500/10 shadow-[0_0_100px_rgba(245,158,11,0.25)]"
                : "bg-amber-500/5"
            }`}
            style={{
              inset: -22,
              animation: isSpeaking ? "pulse 1.5s ease-in-out infinite 0.3s" : undefined,
            }}
          />
          {/* Avatar container */}
          <div
            className={`w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-all duration-500 ${
              isSpeaking
                ? "shadow-[0_0_120px_rgba(245,158,11,0.4)]"
                : ""
            }`}
          >
            <BotlerAvatar
              state={status === "active" ? (isSpeaking ? "talking" : "listening") : "idle"}
              size={300}
              className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
            />
          </div>
        </div>

        {/* Last spoken line — subtle caption */}
        {lastEntry && !showTranscript && (
          <div className="max-w-md text-center mt-2">
            <p className="text-white/25 text-xs mb-1 uppercase tracking-wider">
              {lastEntry.speaker === "user" ? "Vous" : "Botler"}
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              {lastEntry.text}
            </p>
          </div>
        )}

        {!lastEntry && status === "active" && (
          <p className="text-white/25 text-sm mt-2">Parlez naturellement...</p>
        )}

        {status === "connecting" && (
          <div className="flex items-center gap-2 text-white/30 text-sm mt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion en cours...
          </div>
        )}
      </div>

      {/* Expandable transcript */}
      {transcript.length > 0 && (
        <div className={`border-t border-white/10 transition-all ${showTranscript ? "max-h-[40vh]" : "max-h-0"} overflow-hidden`}>
          <div className="overflow-auto max-h-[calc(40vh-40px)] px-5 py-3 space-y-2">
            {transcript.map((entry, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className={`font-semibold shrink-0 ${entry.speaker === "user" ? "text-amber-500/70" : "text-white/40"}`}>
                  {entry.speaker === "user" ? "Vous" : "Botler"}
                </span>
                <span className="text-white/50">{entry.text}</span>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="px-5 py-5 flex items-center justify-center gap-4 border-t border-white/10">
        {/* Transcript toggle */}
        {transcript.length > 0 && status === "active" && (
          <button
            onClick={() => setShowTranscript((v) => !v)}
            aria-label={showTranscript ? "Masquer le transcript" : "Afficher le transcript"}
            aria-expanded={showTranscript}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-white/40 text-xs cursor-pointer hover:bg-white/5"
          >
            {showTranscript ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            Transcript
          </button>
        )}

        {status === "active" && (
          <button
            onClick={handleHangUp}
            aria-label="Raccrocher et terminer la conversation"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500 text-white font-bold text-base cursor-pointer shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
            Raccrocher
          </button>
        )}

        {status === "connecting" && (
          <div className="flex items-center gap-2 text-white/40 text-sm py-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion en cours...
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            {errorMsg && (
              <div className="text-white/40 text-xs text-center max-w-sm">{errorMsg}</div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleStart}
                className="px-6 py-3 rounded-xl border border-amber-500 text-amber-500 font-semibold text-sm cursor-pointer hover:bg-amber-500/10"
              >
                Reessayer
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-white/20 text-white/50 font-semibold text-sm cursor-pointer hover:bg-white/5"
              >
                Chat texte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
