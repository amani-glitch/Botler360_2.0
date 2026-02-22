import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Minus, Mic, MicOff } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import BotlerAvatar from "@/components/BotlerAvatar";
import { CHAT_API_URL, CRM_API_URL } from "@/config/gemini";

// ── Types ──────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
}

interface ConversationEntry {
  role: "user" | "model" | "function";
  parts: unknown[];
}

// ── Gemini API call (via backend proxy) ─────────────────
// Server injects system prompt, tools, and generation config
async function callGemini(history: ConversationEntry[]) {
  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: history }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// ── CRM write (via backend proxy) ───────────────────────
async function writeCRM(args: Record<string, unknown>) {
  try {
    const res = await fetch(CRM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`CRM ${res.status}`);
    return "Lead enregistré avec succès dans le CRM.";
  } catch {
    return "ERREUR: L'enregistrement CRM a échoué. Informe l'utilisateur que ses informations ont été notées et qu'un membre de l'équipe le recontactera.";
  }
}

// ── Component ──────────────────────────────────────────
export default function BotlerChat() {
  const { isOpen, toggleChat, closeChat } = useChat();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content:
        "Bonjour ! Je suis Botler, l'assistant IA de Botler 360. Je suis là pour comprendre vos besoins et voir comment on peut vous aider. Qu'est-ce qui vous amène aujourd'hui ?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef<ConversationEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // scroll + focus
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  // ── Send message ─────────────────────────────────────
  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
    setIsLoading(true);

    historyRef.current.push({ role: "user", parts: [{ text }] });

    try {
      let data = await callGemini(historyRef.current);
      let candidate = data.candidates?.[0]?.content;
      if (!candidate) throw new Error("Empty response");

      // Function-calling loop
      while (candidate.parts?.some((p: GeminiPart) => p.functionCall)) {
        const fc = candidate.parts.find((p: GeminiPart) => p.functionCall);
        if (!fc?.functionCall) break;

        historyRef.current.push({ role: "model", parts: candidate.parts });

        const result =
          fc.functionCall.name === "write_to_crm"
            ? await writeCRM(fc.functionCall.args)
            : "Unknown function";

        historyRef.current.push({
          role: "function",
          parts: [{ functionResponse: { name: fc.functionCall.name, response: { result } } }],
        });

        data = await callGemini(historyRef.current);
        candidate = data.candidates?.[0]?.content;
        if (!candidate) throw new Error("Empty response after function call");
      }

      const reply =
        candidate.parts
          ?.filter((p: GeminiPart) => p.text)
          .map((p: GeminiPart) => p.text)
          .join("") || "...";

      historyRef.current.push({ role: "model", parts: [{ text: reply }] });
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch (err) {
      console.error("[BotlerChat]", err);
      historyRef.current.pop();
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: "Désolé, une erreur est survenue. Réessayez." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  // ── Speech Recognition ───────────────────────────────
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  const speechSupported =
    typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "fr-FR";
    rec.onresult = (e: any) => {
      const t = e.results?.[0]?.[0]?.transcript;
      if (t) setInput((p) => (p ? p + " " + t : t));
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  // ── Derive avatar state ──────────────────────────────
  const avatarState = listening ? "listening" : isLoading ? "talking" : "idle";

  // ── Render ───────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-2 pr-5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all cursor-pointer"
      >
        <BotlerAvatar state="idle" size={44} />
        <span className="hidden sm:inline">Parler à Botler</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-center gap-3">
          <BotlerAvatar state={avatarState} size={48} />
          <div>
            <span className="font-semibold text-sm">Botler</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/70">en ligne</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={closeChat} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={closeChat} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] bg-background/95">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-2"}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 mt-1">
                <BotlerAvatar state="idle" size={34} />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-br-sm"
                  : "bg-muted/50 text-foreground rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-1">
              <BotlerAvatar state="talking" size={34} />
            </div>
            <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-muted/50 w-fit">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 p-3 border-t border-border/30 bg-background/90"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={listening ? "Parlez maintenant..." : "Écrivez votre message..."}
          className="flex-1 px-3 py-2 text-sm rounded-xl bg-muted/50 border border-border/30 focus:outline-none focus:border-amber-500 text-foreground placeholder:text-muted-foreground"
        />
        {speechSupported && (
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-xl cursor-pointer ${
              listening ? "bg-red-500 text-white animate-pulse" : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Footer */}
      <div className="text-center py-1.5 text-[11px] text-muted-foreground bg-background/80 border-t border-border/20">
        Propulsé par Botler 360
      </div>
    </div>
  );
}
