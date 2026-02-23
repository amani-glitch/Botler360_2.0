import { useState, useRef, useEffect } from "react";
import { X, Send, Minus, Mic } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import BotlerAvatar from "@/components/BotlerAvatar";
import LiveVoiceAgent from "@/components/LiveVoiceAgent";

export default function BotlerChat() {
  const { isOpen, toggleChat, closeChat } = useChat();
  const { messages, isLoading, sendMessage } = useGeminiChat();
  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // scroll + focus
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  useEffect(() => {
    if (isOpen && !voiceMode) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen, voiceMode]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage(text);
  };

  // ── Avatar state ───────────────────────────────────────
  const avatarState = isLoading ? "talking" : "idle";

  // ── Voice mode overlay ─────────────────────────────────
  if (voiceMode) {
    return <LiveVoiceAgent onClose={() => setVoiceMode(false)} />;
  }

  // ── Render (chat closed) ───────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        aria-label="Ouvrir le chat avec Botler"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-2 pr-5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all cursor-pointer"
      >
        <BotlerAvatar state="idle" size={44} />
        <span className="hidden sm:inline">Parler à Botler</span>
      </button>
    );
  }

  // ── Render (chat open) ─────────────────────────────────
  return (
    <div role="dialog" aria-label="Chat Botler" className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card backdrop-blur-xl">
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
          {/* Voice chat button */}
          <button
            onClick={() => setVoiceMode(true)}
            aria-label="Passer en mode vocal"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer transition-colors bg-amber-500/15 hover:bg-amber-500/25 text-amber-400"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Parler</span>
          </button>
          <button
            onClick={closeChat}
            aria-label="Réduire le chat"
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={closeChat}
            aria-label="Fermer le chat"
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div role="log" aria-live="polite" aria-label="Messages du chat" className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] bg-background/95">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-2"}`}
          >
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
          handleSend();
        }}
        className="flex items-center gap-2 p-3 border-t border-border/30 bg-background/90"
      >
        <input
          ref={inputRef}
          value={input}
          aria-label="Votre message"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Écrivez votre message..."
          className="flex-1 px-3 py-2 text-sm rounded-xl bg-muted/50 border border-border/30 focus:outline-none focus:border-amber-500 text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Envoyer le message"
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
