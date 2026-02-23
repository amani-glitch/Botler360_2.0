/**
 * Gemini Live API — Real-time bidirectional audio streaming
 * Adapted from PULSE (Jean) for Botler 360
 */
import { GoogleGenAI, Modality, type LiveServerMessage } from "@google/genai";

// ── PCM audio utilities ─────────────────────────────────
export function encodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeBase64(base64: string): Uint8Array {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

export function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  channels: number
): AudioBuffer {
  const int16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = int16.length / channels;
  const buffer = ctx.createBuffer(channels, frameCount, sampleRate);
  for (let ch = 0; ch < channels; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = int16[i * channels + ch] / 32768.0;
    }
  }
  return buffer;
}

// ── Callbacks ───────────────────────────────────────────
export interface LiveCallbacks {
  onAudio: (base64Data: string) => void;
  onInterrupted: () => void;
  onTranscription: (text: string, isUser: boolean) => void;
  onTurnComplete: () => void;
}

export interface LiveConfig {
  systemInstruction: string;
  voiceName: string;
}

// ── Connect to Gemini Live API ──────────────────────────
export function connectGeminiLive(config: LiveConfig, callbacks: LiveCallbacks) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY not set");

  const ai = new GoogleGenAI({ apiKey });

  return ai.live.connect({
    model: "gemini-2.5-flash-native-audio-preview-12-2025",
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction:
        config.systemInstruction +
        "\n\nMODE VOCAL ACTIVÉ. Sois extra concis, chaleureux et naturel. Maximum 2-3 phrases par réponse. Parle comme dans une vraie conversation téléphonique.",
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voiceName } },
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
    callbacks: {
      onopen: () => console.log("[GeminiLive] WebSocket OPEN"),
      onmessage: (message: LiveServerMessage) => {
        if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
          callbacks.onAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
        }
        if (message.serverContent?.inputTranscription) {
          callbacks.onTranscription(
            (message.serverContent.inputTranscription as Record<string, string>).text,
            true
          );
        }
        if (message.serverContent?.outputTranscription) {
          callbacks.onTranscription(
            (message.serverContent.outputTranscription as Record<string, string>).text,
            false
          );
        }
        if (message.serverContent?.interrupted) {
          callbacks.onInterrupted();
        }
        if (message.serverContent?.turnComplete) {
          callbacks.onTurnComplete();
        }
      },
      onerror: (e: unknown) => {
        console.error("[GeminiLive] WebSocket ERROR:", e);
      },
      onclose: (e: unknown) => {
        console.warn("[GeminiLive] WebSocket CLOSED:", e);
      },
    },
  });
}
