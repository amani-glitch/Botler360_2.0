/**
 * geminiLive.ts — browser client for Gemini Live via our /api/chat/live WS proxy.
 *
 * Protocol:
 *   Client → Server:
 *     { type: "connect",    persona: "<id>" }
 *     { type: "audio",      data, mimeType: "audio/pcm;rate=16000" }
 *     { type: "disconnect" }
 *
 *   Server → Client:
 *     { type: "open" }
 *     { type: "audio",         data, mimeType }
 *     { type: "interrupted" }
 *     { type: "turn_complete" }
 *     { type: "closed" }
 *     { type: "error",         message, userHint? }
 *
 * Capture: 16kHz mono, ScriptProcessorNode (buffer 2048) → PCM 16-bit LE → base64.
 * Playback: AudioBufferSource queue with continuity (nextStartTime).
 * Barge-in: on {interrupted}, all scheduled sources are stopped immediately.
 *
 * A volume-level callback is emitted on each capture tick for a live
 * visualiser UI (ring/halo around the mic button).
 */

export type LiveState =
  | "connecting" // WS handshake
  | "open"       // Gemini ready, streaming mic
  | "speaking"   // bot audio playing
  | "listening"  // waiting for user speech
  | "closed";

export type LiveEvent =
  | { type: "state"; state: LiveState }
  | { type: "level"; value: number }   // 0..1 input level
  | { type: "error"; message: string; userHint?: string };

export interface LiveOptions {
  persona: string;
  onEvent?: (ev: LiveEvent) => void;
}

export interface LiveSession {
  stop: () => void;
  interrupt: () => void;
  getState: () => LiveState;
}

const CAPTURE_SAMPLE_RATE = 16000;
const DEFAULT_PLAYBACK_RATE = 24000;

// ---------- base64 helpers ----------
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(binary);
}

function base64ToInt16(b64: string): Int16Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
}

function rateFromMime(mime?: string): number {
  const m = mime?.match(/rate=(\d+)/);
  return m ? parseInt(m[1], 10) : DEFAULT_PLAYBACK_RATE;
}

type AudioCtxCtor = typeof AudioContext;
function getAudioCtor(): AudioCtxCtor {
  const w = window as unknown as { AudioContext: AudioCtxCtor; webkitAudioContext?: AudioCtxCtor };
  return w.AudioContext || w.webkitAudioContext!;
}

export const GeminiLive = {
  async start(opts: LiveOptions): Promise<LiveSession> {
    const emit = (ev: LiveEvent) => opts.onEvent?.(ev);
    let state: LiveState = "connecting";
    const setState = (s: LiveState) => {
      if (s === state) return;
      state = s;
      emit({ type: "state", state: s });
    };

    // ---------- WebSocket ----------
    // VITE_API_BASE points to the Cloud Run URL when the frontend is hosted
    // on a bucket. Falls back to same-origin during local dev.
    const apiBase: string =
      ((import.meta as unknown as { env: { VITE_API_BASE?: string } }).env
        .VITE_API_BASE || "").replace(/\/$/, "");
    const wsUrl = apiBase
      ? apiBase.replace(/^http/, "ws") + "/api/chat/live"
      : `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/chat/live`;
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";

    let openResolve: () => void;
    let openReject: (e: unknown) => void;
    const openPromise = new Promise<void>((res, rej) => {
      openResolve = res;
      openReject = rej;
    });

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "connect", persona: opts.persona }));
    });
    ws.addEventListener("error", () => {
      emit({ type: "error", message: "WebSocket connection failed." });
      openReject?.(new Error("ws error"));
    });
    ws.addEventListener("close", () => {
      setState("closed");
      cleanup();
    });

    // ---------- Capture ----------
    const AudioCtor = getAudioCtor();
    let mediaStream: MediaStream | null = null;
    let captureCtx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let processor: ScriptProcessorNode | null = null;

    async function startCapture() {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: CAPTURE_SAMPLE_RATE,
        },
      });

      captureCtx = new AudioCtor({ sampleRate: CAPTURE_SAMPLE_RATE });
      source = captureCtx.createMediaStreamSource(mediaStream);
      // Deprecated but explicitly requested by the spec (buffer 2048)
      processor = captureCtx.createScriptProcessor(2048, 1, 1);

      source.connect(processor);
      // Route to destination with a muted gain so onaudioprocess fires reliably
      // without playing the mic back to the speakers.
      const mute = captureCtx.createGain();
      mute.gain.value = 0;
      processor.connect(mute);
      mute.connect(captureCtx.destination);

      processor.onaudioprocess = (ev) => {
        const input = ev.inputBuffer.getChannelData(0);
        const len = input.length;

        // Float32 → PCM 16 LE (clamp + scale asymmetric for negative/positive)
        const int16 = new Int16Array(len);
        let levelSum = 0;
        let levelCount = 0;
        for (let i = 0; i < len; i++) {
          let s = input[i];
          if (s > 1) s = 1;
          else if (s < -1) s = -1;
          int16[i] = s < 0 ? (s * 0x8000) | 0 : (s * 0x7fff) | 0;
          if ((i & 3) === 0) {
            levelSum += Math.abs(s);
            levelCount++;
          }
        }

        // Send to server
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "audio",
            data: bufferToBase64(int16.buffer),
            mimeType: "audio/pcm;rate=16000",
          }));
        }

        // UI visualizer — average |sample| across every 4th sample
        if (levelCount > 0) {
          emit({ type: "level", value: levelSum / levelCount });
        }
      };
    }

    // ---------- Playback ----------
    const playbackCtx = new AudioCtor();
    let nextStartTime = 0;
    let activeSources: AudioBufferSourceNode[] = [];

    function schedulePlayback(b64: string, mimeType?: string) {
      const rate = rateFromMime(mimeType);
      const int16 = base64ToInt16(b64);
      if (int16.length === 0) return;
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 0x8000;

      const buf = playbackCtx.createBuffer(1, float32.length, rate);
      buf.copyToChannel(float32, 0);

      const src = playbackCtx.createBufferSource();
      src.buffer = buf;
      src.connect(playbackCtx.destination);

      const now = playbackCtx.currentTime;
      const startAt = Math.max(now, nextStartTime);
      src.start(startAt);
      nextStartTime = startAt + buf.duration;

      activeSources.push(src);
      src.onended = () => {
        activeSources = activeSources.filter((s) => s !== src);
        if (activeSources.length === 0 && state === "speaking") {
          setState("listening");
        }
      };
      setState("speaking");
    }

    function interruptPlayback() {
      activeSources.forEach((s) => {
        try { s.stop(); } catch { /* ignore */ }
      });
      activeSources = [];
      nextStartTime = playbackCtx.currentTime;
      if (state === "speaking") setState("listening");
    }

    // ---------- Messages ----------
    ws.addEventListener("message", async (ev) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(typeof ev.data === "string" ? ev.data : "");
      } catch {
        return;
      }

      switch (msg.type) {
        case "open":
          try {
            await startCapture();
            setState("listening");
            openResolve?.();
          } catch (e) {
            emit({ type: "error", message: `Microphone error: ${(e as Error).message}` });
            openReject?.(e);
          }
          return;
        case "audio":
          if (typeof msg.data === "string") {
            schedulePlayback(msg.data, typeof msg.mimeType === "string" ? msg.mimeType : undefined);
          }
          return;
        case "interrupted":
          interruptPlayback();
          return;
        case "turn_complete":
          // Playback will flip the state back to listening once the last
          // scheduled source finishes.
          return;
        case "closed":
          setState("closed");
          return;
        case "error":
          emit({
            type: "error",
            message: typeof msg.message === "string" ? msg.message : "Erreur Gemini Live",
            userHint: typeof msg.userHint === "string" ? msg.userHint : undefined,
          });
          return;
      }
    });

    function cleanup() {
      try { processor?.disconnect(); } catch { /* ignore */ }
      try { source?.disconnect(); } catch { /* ignore */ }
      try { mediaStream?.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
      try { captureCtx?.close(); } catch { /* ignore */ }
      interruptPlayback();
      try { playbackCtx.close(); } catch { /* ignore */ }
    }

    // Wait for server-confirmed open before returning to the caller.
    try {
      await openPromise;
    } catch (e) {
      cleanup();
      try { ws.close(); } catch { /* ignore */ }
      throw e;
    }

    return {
      stop: () => {
        try { ws.send(JSON.stringify({ type: "disconnect" })); } catch { /* ignore */ }
        try { ws.close(1000); } catch { /* ignore */ }
        cleanup();
        setState("closed");
      },
      interrupt: () => interruptPlayback(),
      getState: () => state,
    };
  },
};
