import { useState, useCallback, useRef } from "react";
import { CHAT_API_URL, CRM_API_URL } from "@/config/gemini";

interface MessagePart {
  text?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
  functionResponse?: { name: string; response: { result: string } };
}

interface ConversationMessage {
  role: "user" | "model" | "function";
  parts: MessagePart[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Server injects system prompt, tools, and generation config
async function callGemini(contents: ConversationMessage[]) {
  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error: ${res.status} — ${errorText}`);
  }

  return res.json();
}

// ── Function call handlers (via backend proxy) ─────────
const FUNCTION_ENDPOINTS: Record<string, string> = {
  write_to_crm: CRM_API_URL,
  schedule_callback: "/api/schedule",
  check_availability: "/api/availability",
};

async function executeFunctionCall(
  name: string,
  args: Record<string, unknown>,
  conversationHistory?: ConversationMessage[],
): Promise<string> {
  const url = FUNCTION_ENDPOINTS[name];
  if (!url) return `Fonction inconnue: ${name}`;

  // Attach full conversation log for CRM writes
  if (name === "write_to_crm" && conversationHistory) {
    const log = conversationHistory
      .filter(m => m.role === "user" || (m.role === "model" && m.parts?.some(p => p.text)))
      .map(m => {
        const text = m.parts?.find(p => p.text)?.text || "";
        return `${m.role === "user" ? "PROSPECT" : "BOTLER"}: ${text}`;
      })
      .join("\n");
    args.full_conversation_log = log;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
      body: JSON.stringify(args),
    });

    if (!res.ok) throw new Error(`${name} ${res.status}`);
    const data = await res.json();

    if (name === "write_to_crm") {
      return data.status === "ok"
        ? "Lead enregistré avec succès dans le CRM."
        : "ERREUR: L'enregistrement CRM a échoué.";
    }
    if (name === "schedule_callback") {
      return data.status === "ok"
        ? "Rappel planifié avec succès. L'équipe recontactera le prospect."
        : "ERREUR: La planification du rappel a échoué.";
    }
    if (name === "check_availability") {
      return JSON.stringify(data);
    }
    return JSON.stringify(data);
  } catch {
    return `ERREUR: L'appel à ${name} a échoué. Informe l'utilisateur que ses informations ont été notées et qu'un membre de l'équipe le recontactera.`;
  }
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Bonjour ! Je suis Botler, l'assistant IA de Botler 360. Je suis là pour comprendre vos besoins et voir comment on peut vous aider. Qu'est-ce qui vous amène aujourd'hui ?",
};

export function useGeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const conversationHistory = useRef<ConversationMessage[]>([]);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: userText },
    ]);
    setIsLoading(true);

    conversationHistory.current.push({
      role: "user",
      parts: [{ text: userText }],
    });

    try {
      let response = await callGemini(conversationHistory.current);
      let candidate = response.candidates?.[0]?.content;

      if (!candidate) throw new Error("No response from Gemini");

      // Handle function calling loop
      while (candidate.parts?.some((p: MessagePart) => p.functionCall)) {
        const functionCallPart = candidate.parts.find(
          (p: MessagePart) => p.functionCall,
        );

        if (!functionCallPart?.functionCall) break;

        conversationHistory.current.push({
          role: "model",
          parts: candidate.parts,
        });

        const result = await executeFunctionCall(
          functionCallPart.functionCall.name,
          functionCallPart.functionCall.args,
          conversationHistory.current,
        );

        conversationHistory.current.push({
          role: "function",
          parts: [
            {
              functionResponse: {
                name: functionCallPart.functionCall.name,
                response: { result },
              },
            },
          ],
        });

        response = await callGemini(conversationHistory.current);
        candidate = response.candidates?.[0]?.content;

        if (!candidate) throw new Error("No response after function call");
      }

      const assistantText =
        candidate.parts
          ?.filter((p: MessagePart) => p.text)
          .map((p: MessagePart) => p.text)
          .join("") || "...";

      conversationHistory.current.push({
        role: "model",
        parts: [{ text: assistantText }],
      });

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: assistantText },
      ]);
    } catch (error) {
      console.error("[useGeminiChat]", error);
      conversationHistory.current.pop();
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Désolé, une erreur est survenue. Réessayez.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
}
