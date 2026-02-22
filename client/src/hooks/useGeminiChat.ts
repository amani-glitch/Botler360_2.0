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
  timestamp: Date;
}

// Server injects system prompt, tools, and generation config
async function callGemini(contents: ConversationMessage[]) {
  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error: ${res.status} — ${errorText}`);
  }

  return res.json();
}

async function executeFunctionCall(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  if (name === "write_to_crm") {
    try {
      const res = await fetch(CRM_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      if (!res.ok) throw new Error(`CRM ${res.status}`);
      return "Lead enregistré avec succès dans le CRM.";
    } catch (error) {
      console.error("[BotlerChat] CRM write error:", error);
      return "ERREUR: L'enregistrement dans le CRM a échoué. Informe l'utilisateur que ses informations ont été notées et qu'un membre de l'équipe le recontactera.";
    }
  }

  return `Fonction inconnue: ${name}`;
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Bonjour ! Je suis Botler, l'assistant IA de Botler 360. Je suis là pour comprendre vos besoins et voir comment on peut vous aider. Qu'est-ce qui vous amène aujourd'hui ?",
  timestamp: new Date(),
};

export function useGeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const conversationHistory = useRef<ConversationMessage[]>([]);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
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
          .join("") || "Désolé, je n'ai pas pu générer de réponse.";

      conversationHistory.current.push({
        role: "model",
        parts: [{ text: assistantText }],
      });

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("[BotlerChat] Error:", error);
      conversationHistory.current.pop();
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    conversationHistory.current = [];
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
}
