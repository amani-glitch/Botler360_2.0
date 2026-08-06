import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

/**
 * Vite plugin: POST /api/chat → Gemini-powered chat replies.
 * Loads GEMINI_API_KEY from .env.local into process.env, dispatches to
 * server/chat.ts which resolves the proper system prompt by theme.
 */
function vitePluginBotlerChatAPI(): Plugin {
  const projectRoot = import.meta.dirname;
  const chatModuleAbs = path.resolve(projectRoot, "server/chat.ts");
  const liveModuleAbs = path.resolve(projectRoot, "server/live.ts");

  return {
    name: "botler-chat-api",
    config() {
      // Load .env* into process.env so SSR-loaded modules can read it.
      const env = loadEnv("", projectRoot, "");
      for (const key of ["GEMINI_API_KEY", "GEMINI_MODEL", "GEMINI_LIVE_MODEL", "GEMINI_LIVE_VOICE"]) {
        if (env[key] && !process.env[key]) process.env[key] = env[key];
      }
    },
    configureServer(server: ViteDevServer) {
      const readBody = (req: import("http").IncomingMessage) =>
        new Promise<string>((resolve, reject) => {
          let body = "";
          req.on("data", (chunk) => (body += chunk.toString()));
          req.on("end", () => resolve(body));
          req.on("error", reject);
        });

      // Streaming endpoint (registered FIRST — more specific route)
      // Newline-delimited JSON: {"chunk":"..."} | {"done":true} | {"error":"...","userHint":"..."}
      server.middlewares.use("/api/chat/stream", async (req, res, next) => {
        if (req.method !== "POST") return next();

        try {
          const raw = await readBody(req);
          const payload = raw ? JSON.parse(raw) : {};
          const mod = await server.ssrLoadModule(chatModuleAbs);
          const handleChatStream = (mod as {
            handleChatStream: (r: unknown) => AsyncGenerator<string>;
          }).handleChatStream;

          res.writeHead(200, {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
          });

          try {
            for await (const chunk of handleChatStream(payload)) {
              res.write(JSON.stringify({ chunk }) + "\n");
            }
            res.write(JSON.stringify({ done: true }) + "\n");
          } catch (err) {
            const e = err as { status?: number; message?: string; userHint?: string };
            res.write(JSON.stringify({
              error: e.message || String(err),
              userHint: e.userHint,
              status: e.status || 500,
            }) + "\n");
          }
          res.end();
        } catch (err) {
          const e = err as { message?: string };
          server.config.logger.error(`[chat stream] ${e.message || err}`);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: e.message || String(err) }));
        }
      });

      // ---- WebSocket upgrade for /api/chat/live (Gemini Live realtime audio) ----
      const httpServer = server.httpServer;
      if (httpServer) {
        let wssInstance: import("ws").WebSocketServer | null = null;
        const setupLiveServer = async () => {
          if (wssInstance) return wssInstance;
          const { WebSocketServer } = await import("ws");
          wssInstance = new WebSocketServer({ noServer: true });
          return wssInstance;
        };

        httpServer.on("upgrade", async (req, socket, head) => {
          if (!req.url || !req.url.startsWith("/api/chat/live")) return;
          try {
            // Load live module BEFORE handshake so the message listener is attached
            // synchronously inside handleUpgrade — no race with early client frames.
            const [wss, mod] = await Promise.all([
              setupLiveServer(),
              server.ssrLoadModule(liveModuleAbs),
            ]);
            const handleLiveConnection = (mod as {
              handleLiveConnection: (ws: import("ws").WebSocket) => void;
            }).handleLiveConnection;

            wss.handleUpgrade(req, socket, head, (ws) => {
              try {
                handleLiveConnection(ws);
              } catch (err) {
                server.config.logger.error(`[live upgrade] ${(err as Error).message}`);
                try {
                  ws.send(JSON.stringify({ type: "error", message: (err as Error).message }));
                  ws.close(1011);
                } catch { /* ignore */ }
              }
            });
          } catch (err) {
            server.config.logger.error(`[live ws] ${(err as Error).message}`);
            socket.destroy();
          }
        });
      }

      // Non-streaming endpoint (fallback, kept for simple use-cases)
      server.middlewares.use("/api/chat", async (req, res, next) => {
        if (req.method !== "POST") return next();
        // The streaming handler above is mounted on /api/chat/stream;
        // connect strips the matched prefix so req.url here would be "/stream"
        // if the request was actually for the stream endpoint.
        if (req.url && req.url.startsWith("/stream")) return next();

        try {
          const raw = await readBody(req);
          const payload = raw ? JSON.parse(raw) : {};
          const mod = await server.ssrLoadModule(chatModuleAbs);
          const handleChat = (mod as { handleChat: (r: unknown) => Promise<{ reply: string }> }).handleChat;
          const result = await handleChat(payload);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (err) {
          const e = err as { status?: number; message?: string; userHint?: string };
          const message = e.message || String(err);
          const code = e.status && Number.isFinite(e.status) ? e.status : 500;
          const userHint = e.userHint;
          server.config.logger.error(`[chat api ${code}] ${message}`);
          res.writeHead(code, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: message, userHint }));
        }
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginBotlerChatAPI()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
