/**
 * server/chat.ts — Gemini-powered chat handler.
 * Loads a system prompt by theme and returns Gemini's reply.
 * Called from the Vite dev middleware and (later) a production Express server.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, "prompts");

// theme (from ChatWidget / ROUTE_MAP) → prompt file (without .md)
const THEME_TO_PROMPT: Record<string, string> = {
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

const promptCache = new Map<string, string>();
const IS_DEV = process.env.NODE_ENV !== "production";

function loadPrompt(name: string): string {
  // In dev, always read fresh so edits in server/prompts/*.md are picked up
  // without a full server restart.
  if (!IS_DEV) {
    const cached = promptCache.get(name);
    if (cached) return cached;
  }
  const file = path.join(PROMPTS_DIR, `${name}.md`);
  if (!fs.existsSync(file)) throw new Error(`Prompt file not found: ${file}`);
  const content = fs.readFileSync(file, "utf-8");
  if (!IS_DEV) promptCache.set(name, content);
  return content;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatRequest {
  theme: string;
  messages: ChatMessage[]; // most recent user message is the last one
}

export class ChatError extends Error {
  constructor(
    message: string,
    public status: number,
    public userHint?: string,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

export async function handleChat(req: ChatRequest): Promise<{ reply: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_NEW_KEY_FROM_AISTUDIO") {
    throw new ChatError(
      "GEMINI_API_KEY is not set. Put a fresh key in .env.local.",
      503,
      "Le serveur n'a pas de clé Gemini configurée.",
    );
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const promptName = THEME_TO_PROMPT[req.theme] || "main";
  const systemPrompt = loadPrompt(promptName);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
    },
  });

  const history = req.messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
  const lastUserMsg = req.messages[req.messages.length - 1];
  if (!lastUserMsg || lastUserMsg.role !== "user") {
    throw new ChatError("Last message must be from the user", 400);
  }

  const chat = model.startChat({ history });

  try {
    const result = await chat.sendMessage(lastUserMsg.text);
    return { reply: result.response.text() };
  } catch (err) {
    throw translateGeminiError(err, modelName);
  }
}

/**
 * Streaming variant. Yields text chunks as Gemini produces them, so the client
 * can pipe them to TTS sentence-by-sentence for realtime voice playback.
 */
export async function* handleChatStream(req: ChatRequest): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_NEW_KEY_FROM_AISTUDIO") {
    throw new ChatError(
      "GEMINI_API_KEY is not set.",
      503,
      "Le serveur n'a pas de clé Gemini configurée.",
    );
  }
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const promptName = THEME_TO_PROMPT[req.theme] || "main";
  const systemPrompt = loadPrompt(promptName);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
  });

  const history = req.messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
  const lastUserMsg = req.messages[req.messages.length - 1];
  if (!lastUserMsg || lastUserMsg.role !== "user") {
    throw new ChatError("Last message must be from the user", 400);
  }

  const chat = model.startChat({ history });
  try {
    const result = await chat.sendMessageStream(lastUserMsg.text);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  } catch (err) {
    throw translateGeminiError(err, modelName);
  }
}

function translateGeminiError(err: unknown, modelName: string): ChatError {
  const msg = err instanceof Error ? err.message : String(err);
  if (/API_KEY_HTTP_REFERRER_BLOCKED|Requests from referer/.test(msg)) {
    return new ChatError(
      "Your Gemini API key has an HTTP referrer restriction.",
      403,
      "Ta clé Gemini est restreinte aux appels navigateur. Sur aistudio.google.com/app/apikey, passe 'Application restrictions' à 'None' ou IP.",
    );
  }
  if (/API key not valid|API_KEY_INVALID/.test(msg)) {
    return new ChatError(
      "The GEMINI_API_KEY is invalid.",
      401,
      "La clé Gemini est invalide. Régénère-la sur aistudio.google.com/app/apikey.",
    );
  }
  if (/quota|RATE_LIMIT|RESOURCE_EXHAUSTED/i.test(msg)) {
    return new ChatError(
      "Gemini quota exceeded.",
      429,
      "Quota Gemini atteint. Attends quelques minutes ou passe à un plan payant.",
    );
  }
  if (/404|not found/i.test(msg) && /model/i.test(msg)) {
    return new ChatError(
      `Gemini model "${modelName}" not available for this key.`,
      404,
      `Le modèle "${modelName}" n'est pas accessible. Essaie gemini-2.0-flash ou gemini-1.5-flash dans .env.local.`,
    );
  }
  return new ChatError(msg, 500);
}
