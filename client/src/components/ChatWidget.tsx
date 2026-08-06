import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { GeminiLive, type LiveSession, type LiveState } from "@/lib/geminiLive";

export type ChatTheme =
  | "signature"
  | "pricing"
  | "showcase"
  | "tourisme"
  | "viticulture"
  | "restaurants"
  | "boulangerie"
  | "immobilier"
  | "hebergements"
  | "sites-web-pro"
  | "contact"
  | "hub";

type QuickReply = { label: string; intent?: string };

export type ChatWidgetErrorInfo = { status?: number; message: string };

export type ChatWidgetHandle = {
  /** Programmatically send a message through the widget (e.g. a prequalifying opener). */
  send: (text: string, intent?: string) => void;
};

interface ChatWidgetProps {
  theme: ChatTheme;
  avatar?: string;
  teaser?: string;
  greeting?: { title: string; body: string };
  quickReplies?: QuickReply[] | string[];
  mode?: "floating" | "inline";
  containerId?: string;
  onSend?: (text: string, intent: string) => Promise<string> | string;
  /** Fired when the agent fails to respond (HTTP error, stream error, or timeout). */
  onError?: (info: ChatWidgetErrorInfo) => void;
}

type BotlerChatInstance = {
  root: HTMLElement;
  wrap?: HTMLElement;
  send?: (text: string, intent?: string) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    BotlerChat?: {
      init(opts: Record<string, unknown>): BotlerChatInstance;
      PRESETS: Record<string, unknown>;
    };
  }
}

const SCRIPT_SRC = "/assets/chat/botler-chat.js";
const CSS_HREFS = [
  "/assets/chat/botler-chat.css",
  "/assets/chat/botler-chat-dark.css",
  "/assets/chat/botler-chat-align.css",
];

function ensureAssets() {
  CSS_HREFS.forEach((href) => {
    if (!document.querySelector(`link[data-bc="${href}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.setAttribute("data-bc", href);
      document.head.appendChild(l);
    }
  });
  if (!document.querySelector(`script[data-bc]`)) {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.defer = true;
    s.setAttribute("data-bc", "");
    document.body.appendChild(s);
  }
}

/* ========== API base resolution (frontend on bucket → Cloud Run) ========== */
// Build-time env: VITE_API_BASE = "https://botler-api-xxx.a.run.app" (no trailing slash)
// Defaults to same-origin for local dev where Vite proxies /api/* itself.
const API_BASE: string =
  ((import.meta as unknown as { env: { VITE_API_BASE?: string } }).env
    .VITE_API_BASE || "").replace(/\/$/, "");

/* ========== Chat client with streaming + subscribers ========== */
type ChatMessage = { role: "user" | "model"; text: string };
type ChunkListener = (chunk: string, accumulated: string) => void;
type DoneListener = (finalText: string) => void;
type ErrorListener = (info: ChatWidgetErrorInfo) => void;

const RESPONSE_TIMEOUT_MS = 15000;

interface ChatClient {
  onSend: (text: string, intent: string) => Promise<string>;
  onChunk: (fn: ChunkListener) => () => void;
  onDone: (fn: DoneListener) => () => void;
  onError: (fn: ErrorListener) => () => void;
  /** Abort the in-flight stream so no more chunks arrive (used for barge-in). */
  abortStream: () => void;
}

function createChatClient(theme: ChatTheme): ChatClient {
  const history: ChatMessage[] = [];
  const chunkSubs: ChunkListener[] = [];
  const doneSubs: DoneListener[] = [];
  const errorSubs: ErrorListener[] = [];
  let currentController: AbortController | null = null;

  const onSend = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    history.push({ role: "user", text });

    // Abort any previous in-flight request
    if (currentController) currentController.abort();
    const controller = new AbortController();
    currentController = controller;

    // A turn that neither errors nor streams anything back within this
    // window must still not leave the hero agent looking silently dead.
    let timedOut = false;
    let gotFirstChunk = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, RESPONSE_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => ({}))) as { userHint?: string };
        const msg = err.userHint
          ? `⚠️ ${err.userHint}`
          : `Désolé, je rencontre un souci technique (${res.status}).`;
        errorSubs.forEach((s) => s({ status: res.status, message: msg }));
        doneSubs.forEach((s) => s(msg));
        return msg;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line) as {
                chunk?: string;
                done?: boolean;
                error?: string;
                userHint?: string;
              };
              if (data.error) {
                const msg = data.userHint ? `⚠️ ${data.userHint}` : `⚠️ ${data.error}`;
                accumulated = msg;
                errorSubs.forEach((s) => s({ message: msg }));
                doneSubs.forEach((s) => s(msg));
                return msg;
              }
              if (data.chunk) {
                gotFirstChunk = true;
                window.clearTimeout(timeoutId);
                accumulated += data.chunk;
                chunkSubs.forEach((s) => s(data.chunk!, accumulated));
              }
              if (data.done) {
                history.push({ role: "model", text: accumulated });
                doneSubs.forEach((s) => s(accumulated));
                return accumulated;
              }
            } catch {
              /* ignore malformed line */
            }
          }
        }
      } catch (e) {
        // A real barge-in abort (user interrupted) has no timeout involved —
        // return what we have. A timeout-triggered abort is a real failure.
        if ((e as { name?: string }).name === "AbortError") {
          if (timedOut && !gotFirstChunk) {
            const msg = "Je n'ai pas de réponse pour le moment.";
            errorSubs.forEach((s) => s({ message: msg }));
            doneSubs.forEach((s) => s(msg));
            return msg;
          }
          history.push({ role: "model", text: accumulated });
          doneSubs.forEach((s) => s(accumulated));
          return accumulated;
        }
        throw e;
      }

      // Stream ended without explicit {done:true}
      history.push({ role: "model", text: accumulated });
      doneSubs.forEach((s) => s(accumulated));
      return accumulated;
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") {
        return "";
      }
      console.error("[chat stream]", e);
      const msg = "Je n'arrive pas à joindre le serveur. Réessayez.";
      errorSubs.forEach((s) => s({ message: msg }));
      doneSubs.forEach((s) => s(msg));
      return msg;
    } finally {
      window.clearTimeout(timeoutId);
      if (currentController === controller) currentController = null;
    }
  };

  return {
    onSend,
    onChunk: (fn) => {
      chunkSubs.push(fn);
      return () => {
        const i = chunkSubs.indexOf(fn);
        if (i !== -1) chunkSubs.splice(i, 1);
      };
    },
    onDone: (fn) => {
      doneSubs.push(fn);
      return () => {
        const i = doneSubs.indexOf(fn);
        if (i !== -1) doneSubs.splice(i, 1);
      };
    },
    onError: (fn) => {
      errorSubs.push(fn);
      return () => {
        const i = errorSubs.indexOf(fn);
        if (i !== -1) errorSubs.splice(i, 1);
      };
    },
    abortStream: () => {
      if (currentController) currentController.abort();
    },
  };
}

/* ========== Voice: Gemini Live realtime audio ========== */

const MIC_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v4"/><path d="M8 23h8"/></svg>`;
const STOP_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;

/**
 * Voice mode powered by Gemini Live API:
 *   - Click mic once → open realtime bidirectional audio session with Gemini
 *   - Gemini handles VAD + barge-in natively (speak anytime to interrupt)
 *   - Audio captured at 16kHz PCM, played back at 24kHz PCM
 *   - Transcripts can be surfaced in the chat bubbles for UX parity
 *   - Click mic again → stop session, release mic
 *
 * The chat's existing text input (field + send) stays 100% functional for
 * typing, using the streaming /api/chat/stream endpoint (non-Live path).
 */
function enhanceWithVoice(
  root: HTMLElement,
  _client: ChatClient,
  persona: ChatTheme,
  _lang = "fr-FR",
) {
  const inputRow = root.querySelector(".bc-input") as HTMLElement | null;
  if (!inputRow) return () => {};

  let session: LiveSession | null = null;
  let state: LiveState = "closed";
  let latestLevel = 0;

  const micBtn = document.createElement("button");
  micBtn.type = "button";
  micBtn.className = "bc-voice-btn bc-mic";
  micBtn.innerHTML = MIC_SVG;
  micBtn.setAttribute("aria-label", "Démarrer la conversation vocale");
  micBtn.title = "Parler au bot en direct (Gemini Live)";

  // Visualizer ring (absolute element behind the icon) that scales with voice level
  const ring = document.createElement("span");
  ring.className = "bc-mic-ring";
  ring.setAttribute("aria-hidden", "true");
  micBtn.appendChild(ring);

  function updateMicButton() {
    micBtn.classList.remove("is-listening", "is-speaking", "is-connecting", "is-open");
    // Use text node-free replacement: we need the ring child to stay
    const iconHost = micBtn.querySelector(".bc-mic-icon") as HTMLSpanElement | null;
    const iconHtml = state === "speaking" ? STOP_SVG : MIC_SVG;
    if (iconHost) {
      iconHost.innerHTML = iconHtml;
    } else {
      micBtn.innerHTML = `<span class="bc-mic-icon">${iconHtml}</span>`;
      micBtn.appendChild(ring);
    }
    if (state === "connecting") {
      micBtn.classList.add("is-connecting");
      micBtn.setAttribute("aria-label", "Connexion à Gemini Live…");
      micBtn.title = "Connexion…";
    } else if (state === "open" || state === "listening") {
      micBtn.classList.add("is-listening");
      micBtn.setAttribute("aria-label", "Mode vocal actif — je t'écoute");
      micBtn.title = "Je t'écoute — cliquez pour arrêter";
    } else if (state === "speaking") {
      micBtn.classList.add("is-speaking");
      micBtn.setAttribute("aria-label", "Arrêter le bot (barge-in)");
      micBtn.title = "Parle ou clique pour couper le bot";
    } else {
      micBtn.setAttribute("aria-label", "Démarrer la conversation vocale");
      micBtn.title = "Parler au bot en direct (Gemini Live)";
    }
  }

  // RAF loop for smoothed volume ring; avoids churn on every level event
  let rafId = 0;
  let displayedLevel = 0;
  function tick() {
    // Smooth with simple lerp
    displayedLevel += (latestLevel - displayedLevel) * 0.3;
    // Map [0, 0.3] → [1, 1.35] scale
    const scale = 1 + Math.min(displayedLevel, 0.3) * 1.2;
    ring.style.transform = `scale(${scale.toFixed(3)})`;
    ring.style.opacity = String(Math.min(displayedLevel * 3, 1));
    rafId = requestAnimationFrame(tick);
  }

  // Native-audio Live doesn't emit transcripts — we just surface errors as
  // in-chat banners so the user sees any issue without opening the console.
  const messagesEl = root.querySelector(".bc-messages");
  function showBanner(text: string) {
    if (!messagesEl) return;
    const banner = document.createElement("div");
    banner.className = "bc-msg bc-msg--bot";
    banner.textContent = text;
    messagesEl.appendChild(banner);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function start() {
    try {
      state = "connecting";
      updateMicButton();
      if (!rafId) rafId = requestAnimationFrame(tick);
      session = await GeminiLive.start({
        persona,
        onEvent: (ev) => {
          if (ev.type === "state") {
            state = ev.state;
            updateMicButton();
          } else if (ev.type === "level") {
            latestLevel = ev.value;
          } else if (ev.type === "error") {
            showBanner(ev.userHint ? `⚠️ ${ev.userHint}` : `⚠️ ${ev.message}`);
            stop();
          }
        },
      });
    } catch (e) {
      const msg = (e as Error).message || "Impossible de démarrer la session vocale.";
      showBanner(`⚠️ ${msg}`);
      state = "closed";
      updateMicButton();
    }
  }

  function stop() {
    try { session?.stop(); } catch { /* ignore */ }
    session = null;
    state = "closed";
    updateMicButton();
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    latestLevel = 0;
    displayedLevel = 0;
    ring.style.transform = "scale(1)";
    ring.style.opacity = "0";
  }

  micBtn.addEventListener("click", () => {
    if (state === "closed") start();
    else if (state === "speaking") {
      // Allow click-to-interrupt in addition to native barge-in
      session?.interrupt();
    } else {
      stop();
    }
  });

  // Insert mic button: [mic] [field] [send]
  const field = root.querySelector(".bc-field");
  if (field) inputRow.insertBefore(micBtn, field);
  else inputRow.prepend(micBtn);

  // Clean up when the widget is removed from the DOM (e.g. route change)
  const visObserver = new MutationObserver(() => {
    if (!document.body.contains(root)) stop();
  });
  visObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    stop();
    micBtn.remove();
    visObserver.disconnect();
  };
}

const ChatWidget = forwardRef<ChatWidgetHandle, ChatWidgetProps>(function ChatWidget(
  {
    theme,
    avatar,
    teaser,
    greeting,
    quickReplies,
    mode = "floating",
    containerId,
    onSend,
    onError,
  },
  ref,
) {
  const instanceRef = useRef<BotlerChatInstance | null>(null);
  // Sends requested via the imperative handle before the async BotlerChat
  // mount resolves are queued here and flushed once `instanceRef` is set.
  const pendingSendsRef = useRef<Array<{ text: string; intent?: string }>>([]);
  const greetingKey = greeting ? `${greeting.title}|${greeting.body}` : "";
  const chipsKey = quickReplies ? JSON.stringify(quickReplies) : "";

  useImperativeHandle(ref, () => ({
    send: (text, intent) => {
      if (instanceRef.current?.send) {
        instanceRef.current.send(text, intent);
      } else {
        pendingSendsRef.current.push({ text, intent });
      }
    },
  }));

  useEffect(() => {
    ensureAssets();
    let cancelled = false;
    let rafId = 0;
    let voiceCleanup: (() => void) | null = null;

    const client = createChatClient(theme);
    const effectiveOnSend =
      onSend || ((text: string, _intent: string) => client.onSend(text, _intent));
    const unsubscribeError = onError ? client.onError(onError) : undefined;

    const mount = () => {
      if (cancelled) return;
      if (!window.BotlerChat) {
        rafId = window.setTimeout(mount, 80);
        return;
      }
      const normalizedChips = quickReplies
        ? (quickReplies as Array<string | QuickReply>).map((q) =>
            typeof q === "string" ? { label: q, intent: "default" } : q,
          )
        : undefined;

      const opts: Record<string, unknown> = {
        theme,
        avatar,
        teaser,
        mode,
        greeting,
        quickReplies: normalizedChips,
        onSend: effectiveOnSend,
      };
      if (mode === "inline" && containerId) opts.container = "#" + containerId;

      const instance = window.BotlerChat.init(opts);
      instanceRef.current = instance;

      if (instance.send && pendingSendsRef.current.length) {
        const queued = pendingSendsRef.current.splice(0);
        queued.forEach(({ text, intent }) => instance.send!(text, intent));
      }

      // Avatar fallback: if the image 404s (or path is wrong), replace it
      // with a styled "B" so we never show the broken-image icon.
      const avatarImg = instance.root.querySelector<HTMLImageElement>(
        ".bc-avatar img",
      );
      if (avatarImg) {
        avatarImg.alt = "Botler";
        avatarImg.addEventListener(
          "error",
          () => {
            const host = avatarImg.parentElement as HTMLElement | null;
            if (!host) return;
            host.innerHTML =
              '<span style="font-family:\'Fraunces\',\'Inter\',serif;font-size:18px;font-weight:700;color:#0F172A;line-height:1;letter-spacing:-0.02em;">B</span>';
          },
          { once: true },
        );
      }

      const htmlLang = document.documentElement.getAttribute("lang") || "fr";
      const lang = htmlLang.startsWith("en") ? "en-US" : "fr-FR";
      voiceCleanup = enhanceWithVoice(instance.root, client, theme, lang);
    };

    mount();

    return () => {
      cancelled = true;
      if (rafId) clearTimeout(rafId);
      if (unsubscribeError) unsubscribeError();
      if (voiceCleanup) {
        try { voiceCleanup(); } catch { /* ignore */ }
        voiceCleanup = null;
      }
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy();
        } catch {
          /* ignore */
        }
        instanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, avatar, teaser, mode, containerId, greetingKey, chipsKey]);

  if (mode === "inline" && containerId) {
    return <div id={containerId} />;
  }
  return null;
});

export default ChatWidget;
