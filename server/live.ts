/**
 * server/live.ts — WebSocket proxy to Google Gemini Live API.
 *
 * Protocol (JSON over WS, text frames):
 *
 *   Client → Server:
 *     { type: "connect",    persona: "<id>" }
 *     { type: "audio",      data: "<base64 PCM>", mimeType: "audio/pcm;rate=16000" }
 *     { type: "disconnect" }
 *
 *   Server → Client:
 *     { type: "open" }                              // Gemini ready, start streaming
 *     { type: "audio", data, mimeType }             // audio chunk (usually 24kHz)
 *     { type: "interrupted" }                       // user barged in, flush playback
 *     { type: "turn_complete" }                     // bot turn finished
 *     { type: "closed" }                            // session closed
 *     { type: "error", message, userHint? }
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { WebSocket } from "ws";
import { GoogleGenAI, Modality, type LiveServerMessage, type Session } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, "prompts");

const PERSONA_TO_PROMPT: Record<string, string> = {
  signature: "main",
  pricing: "main",
  showcase: "main",
  contact: "main",
  tourisme: "tourisme",
  "sites-web-pro": "websites",
  viticulture: "wine",
  restaurants: "restaurant",
  boulangerie: "bakery",
  immobilier: "real-estate",
  hebergements: "accommodation",
  hub: "hub",
};

/**
 * Per-persona voice. Available voices: Puck, Kore, Aoede, Charon, Fenrir,
 * Leda, Orus, Zephyr. The choice follows the persona's tone.
 */
const PERSONA_TO_VOICE: Record<string, string> = {
  signature: "Kore",       // pro, rassurant
  pricing: "Kore",
  showcase: "Aoede",       // doux, vivant
  contact: "Kore",
  tourisme: "Puck",        // jeune, énergique
  "sites-web-pro": "Orus", // clair, technique
  viticulture: "Charon",   // grave, élégant
  restaurants: "Fenrir",   // chaleureux français
  boulangerie: "Leda",     // doux, gourmand
  immobilier: "Zephyr",    // posé, pro
  hebergements: "Aoede",   // apaisant, serein
  hub: "Kore",             // pro, rassurant — voix d'accueil Botler
};

const promptCache = new Map<string, string>();
const IS_DEV = process.env.NODE_ENV !== "production";

function loadPrompt(name: string): string {
  if (!IS_DEV) {
    const cached = promptCache.get(name);
    if (cached) return cached;
  }
  const file = path.join(PROMPTS_DIR, `${name}.md`);
  const content = fs.readFileSync(file, "utf-8");
  if (!IS_DEV) promptCache.set(name, content);
  return content;
}

function safeSend(ws: WebSocket, data: unknown) {
  try {
    // 1 === OPEN in ws library
    if (ws.readyState === 1) ws.send(JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function handleLiveConnection(ws: WebSocket) {
  let session: Session | null = null;
  let closed = false;

  const close = (code?: number, reason?: string) => {
    if (closed) return;
    closed = true;
    try { session?.close(); } catch { /* ignore */ }
    safeSend(ws, { type: "closed" });
    try { ws.close(code ?? 1000, reason ?? ""); } catch { /* ignore */ }
  };

  ws.on("message", async (raw) => {
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      safeSend(ws, { type: "error", message: "Invalid JSON payload" });
      return;
    }

    // ---------- CONNECT: open Gemini Live session ----------
    if (msg.type === "connect") {
      if (session) {
        safeSend(ws, { type: "error", message: "Session already connected" });
        return;
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "REPLACE_WITH_YOUR_NEW_KEY_FROM_AISTUDIO") {
        safeSend(ws, {
          type: "error",
          message: "GEMINI_API_KEY is not set.",
          userHint: "Le serveur n'a pas de clé Gemini configurée dans .env.local.",
        });
        close(1011);
        return;
      }

      const persona = typeof msg.persona === "string" ? msg.persona : "signature";
      const promptName = PERSONA_TO_PROMPT[persona] || "main";
      let systemPrompt = "";
      try {
        systemPrompt = loadPrompt(promptName);
      } catch {
        safeSend(ws, { type: "error", message: `Prompt not found: ${promptName}` });
        close(1011);
        return;
      }

      const modelName =
        process.env.GEMINI_LIVE_MODEL ||
        "gemini-2.5-flash-native-audio-preview-12-2025";
      const voiceName =
        process.env.GEMINI_LIVE_VOICE || PERSONA_TO_VOICE[persona] || "Charon";

      try {
        const ai = new GoogleGenAI({ apiKey });
        session = await ai.live.connect({
          model: modelName,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: systemPrompt,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            },
          },
          callbacks: {
            onopen: () => {
              safeSend(ws, { type: "open" });
            },
            onmessage: (message: LiveServerMessage) => {
              try {
                const sc = message.serverContent as (NonNullable<typeof message.serverContent> & { audioData?: { data?: string; mimeType?: string } }) | undefined;
                if (!sc) {
                  // Fallback for SDK variants that put audio at top level
                  const anyMsg = message as { data?: string; mimeType?: string };
                  if (anyMsg.data) {
                    safeSend(ws, {
                      type: "audio",
                      data: anyMsg.data,
                      mimeType: anyMsg.mimeType || "audio/pcm;rate=24000",
                    });
                  }
                  return;
                }

                // Audio chunks live inside modelTurn.parts[].inlineData
                const parts = sc.modelTurn?.parts || [];
                for (const part of parts) {
                  const inline = part.inlineData;
                  if (inline?.data && (inline.mimeType || "").startsWith("audio/")) {
                    safeSend(ws, {
                      type: "audio",
                      data: inline.data,
                      mimeType: inline.mimeType,
                    });
                  }
                }

                // Some SDK variants: serverContent.audioData
                if (sc.audioData?.data) {
                  safeSend(ws, {
                    type: "audio",
                    data: sc.audioData.data,
                    mimeType: sc.audioData.mimeType || "audio/pcm;rate=24000",
                  });
                }

                if (sc.interrupted) safeSend(ws, { type: "interrupted" });
                if (sc.turnComplete) safeSend(ws, { type: "turn_complete" });
              } catch {
                /* ignore parsing oddities — keep the session alive */
              }
            },
            onerror: (e: ErrorEvent) => {
              const message = e.message || "Gemini Live error";
              let userHint: string | undefined;
              if (/referrer|referer/i.test(message)) {
                userHint = "Ta clé Gemini a une restriction HTTP referrer. Passe-la à 'None' sur aistudio.google.com/app/apikey.";
              } else if (/not found|404/i.test(message)) {
                userHint = `Modèle "${modelName}" indisponible. Essaie GEMINI_LIVE_MODEL=gemini-2.0-flash-exp dans .env.local.`;
              }
              safeSend(ws, { type: "error", message, userHint });
              close(1011);
            },
            onclose: (e?: CloseEvent) => {
              if (e && e.code !== 1000 && e.reason) {
                let userHint: string | undefined;
                if (/not found|not supported|bidiGenerateContent/i.test(e.reason)) {
                  userHint = `Modèle Live indisponible avec cette clé. Essaie GEMINI_LIVE_MODEL=gemini-2.0-flash-exp dans .env.local (nécessite billing activé côté Google Cloud).`;
                } else if (/referrer|referer/i.test(e.reason)) {
                  userHint = "Ta clé Gemini a une restriction HTTP referrer — passe-la à 'None'.";
                } else if (/API key/i.test(e.reason)) {
                  userHint = "Clé Gemini invalide ou sans accès à l'API Live.";
                }
                safeSend(ws, { type: "error", message: e.reason, userHint });
              }
              close(1000);
            },
          },
        });
      } catch (e) {
        const err = e as Error;
        let userHint: string | undefined;
        if (/referrer|referer/i.test(err.message)) {
          userHint = "Ta clé Gemini a une restriction HTTP referrer.";
        }
        safeSend(ws, { type: "error", message: err.message, userHint });
        close(1011);
      }
      return;
    }

    // ---------- AUDIO: forward mic chunks to Gemini ----------
    if (msg.type === "audio") {
      if (!session) {
        safeSend(ws, { type: "error", message: "Send connect first" });
        return;
      }
      const data = typeof msg.data === "string" ? msg.data : null;
      const mimeType = typeof msg.mimeType === "string" ? msg.mimeType : "audio/pcm;rate=16000";
      if (!data) return;
      try {
        session.sendRealtimeInput({ media: { mimeType, data } });
      } catch {
        /* session may have closed — ignore */
      }
      return;
    }

    // ---------- DISCONNECT: clean shutdown ----------
    if (msg.type === "disconnect") {
      close(1000);
      return;
    }
  });

  ws.on("close", () => close(1000));
  ws.on("error", () => close(1011));
}
