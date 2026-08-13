/**
 * server/index.ts — production Botler360 server: the API AND the static
 * frontend, served together as one Cloud Run service.
 *
 * Hosts:
 *   GET   /*                 → static frontend (dist/public), SPA fallback to index.html
 *   POST  /api/chat          → JSON, single-shot Gemini reply
 *   POST  /api/chat/stream   → NDJSON, streamed Gemini reply
 *   WS    /api/chat/live     → Gemini Live (realtime audio bidi)
 *   POST  /api/contact       → emails a Contact page form submission
 *   GET   /healthz           → simple liveness probe for Cloud Run
 *
 * Configuration (env vars):
 *   GEMINI_API_KEY        (required)
 *   GEMINI_MODEL          (default gemini-2.5-flash)
 *   GEMINI_LIVE_MODEL     (default gemini-2.5-flash-native-audio-preview-12-2025)
 *   GEMINI_LIVE_VOICE     (optional override; otherwise per-persona)
 *   SMTP_HOST/PORT/SECURE/USER/PASS  (required for /api/contact)
 *   MAIL_FROM             (default: SMTP_USER)
 *   MAIL_TO               (default: contact@botler360.com)
 *   PORT                  (Cloud Run injects 8080)
 *   FRONTEND_ORIGIN       (CORS allow-origin, default "*" — same-origin here anyway)
 */
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { WebSocketServer } from "ws";
import { handleChat, handleChatStream } from "./chat.js";
import { handleLiveConnection } from "./live.js";
import { sendContactSubmission } from "./mail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Built by the Dockerfile's client-builder stage into dist/public, copied
// alongside dist/server so both live under the same /app/dist directory.
const PUBLIC_DIR = path.join(__dirname, "../public");

const app = express();
app.use(express.json({ limit: "1mb" }));

// ---- CORS ----
const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// ---- Health probe ----
app.get("/healthz", (_req, res) => {
  res.type("text/plain").send("ok");
});

// ---- Static frontend ----
// Serves the built SPA (dist/public). Falls through to the API routes below
// for anything that isn't a real file on disk.
app.use(express.static(PUBLIC_DIR));

// ---- /api/chat (single-shot) ----
app.post("/api/chat", async (req, res) => {
  try {
    const result = await handleChat(req.body);
    res.json(result);
  } catch (err) {
    const e = err as { status?: number; message?: string; userHint?: string };
    const status = Number.isFinite(e.status) ? (e.status as number) : 500;
    res.status(status).json({
      error: e.message || String(err),
      userHint: e.userHint,
    });
  }
});

// ---- /api/chat/stream (NDJSON) ----
app.post("/api/chat/stream", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/x-ndjson",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
    "Access-Control-Allow-Origin": allowedOrigin,
  });
  try {
    for await (const chunk of handleChatStream(req.body)) {
      res.write(JSON.stringify({ chunk }) + "\n");
    }
    res.write(JSON.stringify({ done: true }) + "\n");
  } catch (err) {
    const e = err as { status?: number; message?: string; userHint?: string };
    res.write(
      JSON.stringify({
        error: e.message || String(err),
        userHint: e.userHint,
        status: e.status || 500,
      }) + "\n",
    );
  }
  res.end();
});

// ---- /api/contact → emails the Contact page's form submissions ----
app.post("/api/contact", async (req, res) => {
  try {
    await sendContactSubmission(req.body);
    res.json({ ok: true });
  } catch (err) {
    const e = err as { status?: number; message?: string; userHint?: string };
    const status = Number.isFinite(e.status) ? (e.status as number) : 500;
    res.status(status).json({
      error: e.message || String(err),
      userHint: e.userHint,
    });
  }
});

// ---- SPA fallback ----
// Any other GET that isn't a real static file and isn't under /api goes to
// index.html, so client-side routes (wouter) resolve on direct load/refresh.
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// ---- WebSocket /api/chat/live ----
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const url = req.url || "";
  if (!url.startsWith("/api/chat/live")) {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    handleLiveConnection(ws);
  });
});

// ---- Boot ----
const PORT = parseInt(process.env.PORT || "8080", 10);
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[botler] api listening on :${PORT}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`[botler] received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
