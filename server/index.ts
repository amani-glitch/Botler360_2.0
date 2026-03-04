import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const isProd = process.env.NODE_ENV === "production";

// ── Startup validation ──────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL;
const CRM_API_KEY = process.env.CRM_API_KEY;
const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;

if (isProd) {
  const required = ["GEMINI_API_KEY", "CRM_WEBHOOK_URL", "CRM_API_KEY"];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`[server] FATAL: Missing required env var: ${key}`);
      process.exit(1);
    }
  }
}

// ── Security middleware ──────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: isProd ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "wss://generativelanguage.googleapis.com", "https://www.google-analytics.com", "https://analytics.google.com"],
      mediaSrc: ["'self'", "blob:"],
      workerSrc: ["'self'", "blob:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  } : false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));

const ALLOWED_ORIGINS = isProd
  ? ["https://botler360.com", "https://www.botler360.com"]
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(cors({
  origin: (requestOrigin, callback) => {
    // Allow same-origin (no Origin header) or whitelisted origins
    if (!requestOrigin || ALLOWED_ORIGINS.includes(requestOrigin)) {
      callback(null, true);
      return;
    }
    // Allow Cloud Run self-referencing requests (exact URL only)
    const cloudRunUrl = process.env.CLOUD_RUN_URL;
    if (isProd && cloudRunUrl && requestOrigin === cloudRunUrl) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "X-Requested-With"],
}));

app.use(express.json({ limit: "500kb" }));

// ── CSRF protection: verify Origin on all POST requests ──
app.use((req, res, next) => {
  if (req.method !== "POST") return next();

  const origin = req.headers.origin;
  const xrw = req.headers["x-requested-with"];

  // In production, require valid Origin header (allow same-origin Cloud Run)
  if (isProd && origin) {
    const cloudRunUrl = process.env.CLOUD_RUN_URL;
    const allowed = ALLOWED_ORIGINS.includes(origin) || (cloudRunUrl && origin === cloudRunUrl);
    if (!allowed) {
      console.warn(`[security] Blocked request from origin: ${origin}`);
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  }

  // Require X-Requested-With header (blocks simple CSRF from forms)
  if (!xrw) {
    res.status(403).json({ error: "Missing X-Requested-With header" });
    return;
  }

  next();
});

// ── Request logging ─────────────────────────────────────
app.use((req, _res, next) => {
  if (req.method === "POST") {
    const ip = req.ip || req.socket.remoteAddress;
    console.log(`[api] ${req.method} ${req.path} from ${ip}`);
  }
  next();
});

// ── Rate limiting ────────────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 15,
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
  windowMs: 300_000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de soumissions, réessayez dans quelques minutes." },
});

// ── Email validation ────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function isValidEmail(email: unknown): boolean {
  return typeof email === "string" && EMAIL_RE.test(email) && email.length <= 254;
}

// ── Load system prompt server-side ───────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let SYSTEM_PROMPT = "";
try {
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
      "Écrit les données du prospect dans le CRM. Appeler DÈS qu'un email validé est obtenu. Peut être appelé plusieurs fois pour mettre à jour avec plus d'infos.",
    parameters: {
      type: "OBJECT",
      properties: {
        company_name: { type: "STRING", description: "Nom de l'entreprise (si connu)" },
        first_name: { type: "STRING", description: "Prénom du contact" },
        last_name: { type: "STRING", description: "Nom du contact" },
        email: { type: "STRING", description: "Email du contact — DOIT être confirmé avec le prospect avant envoi" },
        phone: { type: "STRING", description: "Téléphone" },
        country: { type: "STRING", description: "Pays" },
        location: { type: "STRING", description: "Ville ou adresse" },
        website: { type: "STRING", description: "Site web actuel" },
        sector: { type: "STRING", description: "Secteur d'activité" },
        product_interest: { type: "STRING", description: "Pack recommandé" },
        pain_points: { type: "STRING", description: "Résumé des problèmes identifiés" },
        score: { type: "INTEGER", description: "Score de qualification 0-100" },
        stage: { type: "STRING", description: "Étape pipeline: new, qualified, ou demo_scheduled" },
        conversation_summary: { type: "STRING", description: "RÉSUMÉ stratégique (3-5 phrases) suivi de --- HISTORIQUE --- avec les échanges clés de la conversation" },
        next_action: { type: "STRING", description: "Prochaine action recommandée pour l'équipe commerciale" },
        revenue_potential: { type: "NUMBER", description: "Estimation revenue annuel en EUR" },
        full_conversation_log: { type: "STRING", description: "Transcript complet de la conversation (PROSPECT: ... / BOTLER: ...)" },
      },
      required: ["email"],
    },
  },
  {
    name: "schedule_callback",
    description:
      "Planifie un rappel téléphonique avec un membre de l'équipe Botler 360. À utiliser quand le prospect demande un rendez-vous, une démo, ou veut être rappelé.",
    parameters: {
      type: "OBJECT",
      properties: {
        contact_name: { type: "STRING", description: "Nom complet du contact" },
        email: { type: "STRING", description: "Email du contact" },
        phone: { type: "STRING", description: "Numéro de téléphone" },
        company_name: { type: "STRING", description: "Nom de l'entreprise" },
        preferred_time: { type: "STRING", description: "Créneau préféré (ex: 'mardi matin', 'cette semaine', 'dès que possible')" },
        topic: { type: "STRING", description: "Sujet du rappel (ex: 'démo chatbot', 'devis site web', 'conseil UCP')" },
        urgency: { type: "STRING", description: "Niveau d'urgence: low, medium, high" },
      },
      required: ["email", "topic"],
    },
  },
  {
    name: "check_availability",
    description:
      "Vérifie la disponibilité d'un pack ou service Botler 360 pour le secteur du prospect. À utiliser pour donner une réponse personnalisée sur ce qui est possible.",
    parameters: {
      type: "OBJECT",
      properties: {
        sector: { type: "STRING", description: "Secteur d'activité du prospect" },
        service_type: { type: "STRING", description: "Type de service demandé: chatbot, website, ucp, mobile_app, custom" },
        requirements: { type: "STRING", description: "Besoins spécifiques mentionnés par le prospect" },
      },
      required: ["sector", "service_type"],
    },
  },
];

const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

// ── GET /api/voice-config — Serve voice config with restricted API key ──
// Uses a separate referrer-restricted key (GEMINI_LIVE_API_KEY) to limit exposure.
// Falls back to the main key in dev only.
const GEMINI_LIVE_API_KEY = process.env.GEMINI_LIVE_API_KEY || (isProd ? "" : GEMINI_API_KEY);

app.get("/api/voice-config", chatLimiter, (req, res) => {
  // In production, require X-Requested-With to prevent direct browser access
  if (isProd && !req.headers["x-requested-with"]) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (!GEMINI_LIVE_API_KEY) {
    res.status(500).json({ error: "Voice API key not configured" });
    return;
  }

  // Send a condensed voice-only system instruction (not the full sales prompt)
  const voiceInstruction = SYSTEM_PROMPT +
    "\n\nMODE VOCAL ACTIVÉ. Sois extra concis, chaleureux et naturel. Maximum 2-3 phrases par réponse. Parle comme dans une vraie conversation téléphonique.";

  res.json({
    systemInstruction: voiceInstruction,
    voiceName: "Puck",
    model: "gemini-2.5-flash-native-audio-preview-12-2025",
    liveApiKey: GEMINI_LIVE_API_KEY,
  });
});

// ── POST /api/chat — Gemini proxy (secured) ──────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    return;
  }

  const { contents } = req.body;
  if (!Array.isArray(contents) || contents.length === 0) {
    res.status(400).json({ error: "Invalid request: contents required" });
    return;
  }

  if (contents.length > 50) {
    res.status(400).json({ error: "Conversation too long" });
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      signal: AbortSignal.timeout(30_000),
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
    const status = (err as Error).name === "TimeoutError" ? 504 : 502;
    res.status(status).json({ error: "Failed to reach Gemini API" });
  }
});

// ── POST /api/schedule — Schedule callback ───────────────
app.post("/api/schedule", crmLimiter, async (req, res) => {
  if (!CRM_WEBHOOK_URL) {
    res.status(500).json({ error: "CRM not configured" });
    return;
  }

  const { contact_name, email, phone, company_name, preferred_time, topic, urgency } = req.body;
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (!topic || typeof topic !== "string") {
    res.status(400).json({ error: "topic is required" });
    return;
  }

  try {
    const upstream = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        company_name: company_name || "Non spécifié",
        first_name: contact_name?.split(" ")[0] || "",
        last_name: contact_name?.split(" ").slice(1).join(" ") || "",
        email,
        phone: phone || "",
        stage: "demo_scheduled",
        next_action: `Rappeler: ${topic} — Créneau: ${preferred_time || "à convenir"}`,
        pain_points: `Urgence: ${urgency || "medium"}`,
        source: "botler_chat_callback",
        api_key: CRM_API_KEY,
      }),
    });
    res.json({ status: upstream.ok ? "ok" : "error" });
  } catch {
    res.status(502).json({ error: "Failed to schedule callback" });
  }
});

// ── POST /api/availability — Check service availability ──
app.post("/api/availability", chatLimiter, async (req, res) => {
  const { sector, service_type, requirements } = req.body;

  const availability: Record<string, { available: boolean; packs: string[]; note: string }> = {
    chatbot: {
      available: true,
      packs: ["Pack Junior (9€/mois)", "Pack Expert (19€/mois)", "Pack Expert PME (49€/mois — recommandé)"],
      note: "Déploiement en 48-72h. Chatbot entraîné sur les données du client. 1% de commission sur ventes via Botler (Packs Expert).",
    },
    website: {
      available: true,
      packs: ["Site Web Vitrine Professionnel (249€ TTC, livré en 24h)"],
      note: "Prix unique, pas d'abonnement. Design responsive, hébergement + SSL inclus, SEO de base.",
    },
    ucp: {
      available: true,
      packs: ["Sur devis"],
      note: "Optimisation visibilité IA (Google AI, ChatGPT, Perplexity). Contactez l'équipe pour un audit.",
    },
    mobile_app: {
      available: true,
      packs: ["Application Mobile (249€)"],
      note: "App iOS & Android sur mesure. Prix unique.",
    },
    custom: {
      available: true,
      packs: ["Sur devis"],
      note: "Solutions personnalisées: dashboards, automatisations, outils métier avec IA.",
    },
  };

  const service = availability[service_type] || availability.custom;

  res.json({
    sector: sector || "Tous secteurs",
    service_type,
    ...service,
    requirements_noted: requirements || "",
    message: `Service disponible pour le secteur ${sector || "tous secteurs"}. ${service.note}`,
  });
});

// ── POST /api/crm — CRM webhook proxy (validated) ───────
const CRM_ALLOWED_FIELDS = [
  "company_name", "first_name", "last_name", "email", "phone",
  "country", "location", "website", "sector", "product_interest",
  "pain_points", "score", "stage", "conversation_summary",
  "next_action", "revenue_potential", "full_conversation_log",
] as const;

app.post("/api/crm", crmLimiter, async (req, res) => {
  if (!CRM_WEBHOOK_URL) {
    res.status(500).json({ error: "CRM not configured" });
    return;
  }

  const sanitized: Record<string, unknown> = {};
  for (const field of CRM_ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) {
      sanitized[field] = req.body[field];
    }
  }

  if (!isValidEmail(sanitized.email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (!sanitized.company_name) sanitized.company_name = "Non renseigné";

  try {
    const upstream = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        ...sanitized,
        source: "botler_chat",
        api_key: CRM_API_KEY,
      }),
    });

    res.json({ status: upstream.ok ? "ok" : "error" });
  } catch (err) {
    console.error("[server] CRM proxy error:", err);
    res.status(502).json({ error: "Failed to reach CRM" });
  }
});

// ── POST /api/contact — Contact form proxy ──────────────
const CONTACT_ALLOWED_FIELDS = [
  "firstName", "lastName", "email", "company",
  "sector", "projectType", "phone", "message",
] as const;

app.post("/api/contact", contactLimiter, async (req, res) => {
  if (!CONTACT_WEBHOOK_URL) {
    res.status(500).json({ error: "Contact endpoint not configured" });
    return;
  }

  const sanitized: Record<string, unknown> = {};
  for (const field of CONTACT_ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) {
      sanitized[field] = String(req.body[field]).slice(0, 2000);
    }
  }

  if (!isValidEmail(sanitized.email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  try {
    const upstream = await fetch(CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify(sanitized),
    });

    res.json({ status: upstream.ok ? "ok" : "error" });
  } catch (err) {
    console.error("[server] Contact proxy error:", err);
    res.status(502).json({ error: "Failed to submit contact form" });
  }
});

// ── POST /api/voice-summary — Analyze voice transcript + write to CRM ──
app.post("/api/voice-summary", crmLimiter, async (req, res) => {
  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    return;
  }

  const { transcript } = req.body;
  if (!transcript || typeof transcript !== "string" || transcript.length < 10) {
    res.status(400).json({ error: "transcript is required (min 10 chars)" });
    return;
  }

  const trimmed = transcript.slice(0, 20000);

  try {
    const extractionPrompt = `Tu es un assistant d'extraction de données CRM. Analyse cette transcription d'une conversation vocale entre Botler (agent commercial IA de Botler 360) et un prospect.

Extrais les informations suivantes au format JSON strict. Si une information n'est pas mentionnée, utilise null.

{
  "company_name": "nom de l'entreprise du prospect",
  "first_name": "prénom du contact",
  "last_name": "nom du contact",
  "email": "email",
  "phone": "téléphone",
  "country": "pays",
  "location": "ville",
  "website": "site web actuel",
  "sector": "secteur d'activité",
  "product_interest": "pack Botler 360 recommandé",
  "pain_points": "résumé des problèmes identifiés en 2-3 phrases",
  "score": 0,
  "stage": "new|qualified|demo_scheduled",
  "conversation_summary": "résumé de la conversation en 3-5 phrases",
  "next_action": "prochaine action recommandée",
  "revenue_potential": 0
}

Scoring (0-100) :
- Besoin identifié +25, site existant +10, pas de site +15, budget OK +15, volume clients +10, email donné +10, téléphone +5, urgence +10

Stage :
- new = peu d'infos, qualified = besoin + coordonnées, demo_scheduled = demande RDV explicite

TRANSCRIPTION :
${trimmed}

Réponds UNIQUEMENT avec le JSON, sans markdown, sans explication.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: extractionPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
      }),
    });

    if (!upstream.ok) {
      console.error("[server] Gemini extraction failed:", upstream.status);
      res.status(502).json({ error: "Failed to analyze transcript" });
      return;
    }

    const geminiData = await upstream.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonStr = rawText.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(jsonStr);
    } catch {
      console.error("[server] Failed to parse Gemini JSON:", jsonStr.slice(0, 200));
      extracted = {
        company_name: "Appel vocal — extraction échouée",
        conversation_summary: trimmed.slice(0, 2000),
        stage: "new",
        score: 0,
      };
    }

    extracted.conversation_summary =
      (extracted.conversation_summary || "") +
      "\n\n--- TRANSCRIPT COMPLET ---\n" +
      trimmed.slice(0, 5000);

    let crmStatus = "skipped";
    if (CRM_WEBHOOK_URL) {
      const crmData: Record<string, unknown> = {};
      for (const field of CRM_ALLOWED_FIELDS) {
        if (extracted[field] !== undefined && extracted[field] !== null) {
          crmData[field] = extracted[field];
        }
      }

      if (!crmData.company_name) crmData.company_name = "Appel vocal non qualifié";
      if (!crmData.email) crmData.email = "voice-call@pending.botler360.com";

      try {
        const crmRes = await fetch(CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(10_000),
          body: JSON.stringify({
            ...crmData,
            source: "botler_voice",
            api_key: CRM_API_KEY,
          }),
        });
        crmStatus = crmRes.ok ? "ok" : "error";
      } catch (err) {
        console.error("[server] CRM write failed:", err);
        crmStatus = "error";
      }
    }

    res.json({
      status: "ok",
      crm_status: crmStatus,
      summary: extracted.conversation_summary,
      score: extracted.score || 0,
      stage: extracted.stage || "new",
    });
  } catch (err) {
    console.error("[server] Voice summary error:", err);
    res.status(502).json({ error: "Failed to process voice transcript" });
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
  console.log(`[server] Running on port ${PORT} (${isProd ? "production" : "development"})`);
  console.log(`[server] System prompt: ${SYSTEM_PROMPT.length} chars`);
  console.log(`[server] CORS origins: ${ALLOWED_ORIGINS.join(", ")}`);
});
