import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const isProd = process.env.NODE_ENV === "production";

// ── Security middleware ──────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: isProd ? undefined : false, // disable CSP in dev (Vite HMR)
}));

app.use(cors({
  origin: isProd
    ? ["https://botler360.com", "https://www.botler360.com"]
    : ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST"],
}));

app.use(express.json({ limit: "100kb" }));

// ── Rate limiting ────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60_000,       // 1 minute
  max: 15,                // 15 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez dans une minute." },
});

const crmLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes." },
});

const contactLimiter = rateLimit({
  windowMs: 300_000,      // 5 minutes
  max: 3,                 // 3 submissions per 5 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de soumissions, réessayez dans quelques minutes." },
});

// ── Config ───────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
const CRM_API_KEY = process.env.CRM_API_KEY;
const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;

// ── Load system prompt server-side ───────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let SYSTEM_PROMPT = "";
try {
  // In production: dist/BOTLER360_AGENT_SYSTEM_PROMPT.md (copied at build)
  // In dev: client/src/config/BOTLER360_AGENT_SYSTEM_PROMPT.md
  const promptPath = isProd
    ? path.join(__dirname, "BOTLER360_AGENT_SYSTEM_PROMPT.md")
    : path.join(__dirname, "..", "client", "src", "config", "BOTLER360_AGENT_SYSTEM_PROMPT.md");
  SYSTEM_PROMPT = fs.readFileSync(promptPath, "utf-8");
} catch {
  console.warn("[server] System prompt file not found — chat will work without it.");
}

const FUNCTION_DECLARATIONS = [
  {
    name: "write_to_crm",
    description:
      "Écrit les données du prospect qualifié dans le CRM Google Sheets de Botler 360. Appeler dès que le nom d'entreprise et l'email sont collectés.",
    parameters: {
      type: "OBJECT",
      properties: {
        company_name: { type: "STRING", description: "Nom de l'entreprise" },
        first_name: { type: "STRING", description: "Prénom du contact" },
        last_name: { type: "STRING", description: "Nom du contact" },
        email: { type: "STRING", description: "Email du contact" },
        phone: { type: "STRING", description: "Téléphone" },
        country: { type: "STRING", description: "Pays" },
        location: { type: "STRING", description: "Ville ou adresse" },
        website: { type: "STRING", description: "Site web actuel" },
        sector: { type: "STRING", description: "Secteur d'activité" },
        product_interest: { type: "STRING", description: "Pack recommandé" },
        pain_points: { type: "STRING", description: "Résumé des problèmes identifiés" },
        score: { type: "INTEGER", description: "Score de qualification 0-100" },
        stage: { type: "STRING", description: "Étape pipeline: new, qualified, ou demo_scheduled" },
        conversation_summary: { type: "STRING", description: "Résumé de la conversation en 3-5 phrases" },
        next_action: { type: "STRING", description: "Prochaine action recommandée" },
        revenue_potential: { type: "NUMBER", description: "Estimation revenue annuel en EUR" },
      },
      required: ["company_name", "email"],
    },
  },
];

const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

// ── POST /api/chat — Gemini proxy (secured) ──────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    return;
  }

  // Validate: only accept contents array from client
  const { contents } = req.body;
  if (!Array.isArray(contents) || contents.length === 0) {
    res.status(400).json({ error: "Invalid request: contents required" });
    return;
  }

  // Cap conversation length to prevent abuse
  if (contents.length > 50) {
    res.status(400).json({ error: "Conversation too long" });
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // Server injects system prompt, tools, and config — client cannot override
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        tools: [{ function_declarations: FUNCTION_DECLARATIONS }],
        generationConfig: GENERATION_CONFIG,
      }),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error("[server] Gemini proxy error:", err);
    res.status(502).json({ error: "Failed to reach Gemini API" });
  }
});

// ── POST /api/crm — CRM webhook proxy (validated) ───────
const CRM_ALLOWED_FIELDS = [
  "company_name", "first_name", "last_name", "email", "phone",
  "country", "location", "website", "sector", "product_interest",
  "pain_points", "score", "stage", "conversation_summary",
  "next_action", "revenue_potential",
] as const;

app.post("/api/crm", crmLimiter, async (req, res) => {
  if (!CRM_WEBHOOK_URL) {
    res.status(500).json({ error: "CRM not configured" });
    return;
  }

  // Whitelist fields
  const sanitized: Record<string, unknown> = {};
  for (const field of CRM_ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) {
      sanitized[field] = req.body[field];
    }
  }

  if (!sanitized.company_name || !sanitized.email) {
    res.status(400).json({ error: "company_name and email are required" });
    return;
  }

  try {
    const upstream = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...sanitized,
        source: "botler_chat",
        api_key: CRM_API_KEY,
      }),
    });

    const ok = upstream.ok;
    res.json({ status: ok ? "ok" : "error" });
  } catch (err) {
    console.error("[server] CRM proxy error:", err);
    res.status(502).json({ error: "Failed to reach CRM" });
  }
});

// ── POST /api/contact — Contact form proxy (new) ────────
const CONTACT_ALLOWED_FIELDS = [
  "firstName", "lastName", "email", "company",
  "sector", "projectType", "phone", "message",
] as const;

app.post("/api/contact", contactLimiter, async (req, res) => {
  if (!CONTACT_WEBHOOK_URL) {
    res.status(500).json({ error: "Contact endpoint not configured" });
    return;
  }

  // Whitelist fields
  const sanitized: Record<string, unknown> = {};
  for (const field of CONTACT_ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) {
      sanitized[field] = String(req.body[field]).slice(0, 2000);
    }
  }

  if (!sanitized.email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  try {
    const upstream = await fetch(CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    res.json({ status: upstream.ok ? "ok" : "error" });
  } catch (err) {
    console.error("[server] Contact proxy error:", err);
    res.status(502).json({ error: "Failed to submit contact form" });
  }
});

// ── Production: serve static frontend ────────────────────
if (isProd) {
  const publicDir = path.join(__dirname, "public");
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

const PORT = parseInt(process.env.PORT || "3005");
app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
});
