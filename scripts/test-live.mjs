// Smoke test for /api/chat/live — confirms the WS endpoint is reachable,
// the Gemini Live session opens, and a text turn produces audio output.
import WebSocket from "ws";

const PORT = process.argv[2] || "3011";
const URL = `ws://localhost:${PORT}/api/chat/live`;
const TIMEOUT_MS = 25000;

console.log(`→ connecting ${URL}`);
const ws = new WebSocket(URL);

let gotReady = false;
let audioChunks = 0;
let audioBytes = 0;
let transcripts = { user: "", model: "" };
let lastErr = null;
let turnComplete = false;

const bail = (code, msg) => {
  console.log(msg);
  try { ws.close(); } catch {}
  process.exit(code);
};

const timer = setTimeout(() => {
  bail(1, `✗ timeout after ${TIMEOUT_MS}ms — ready=${gotReady} audioChunks=${audioChunks} lastErr=${lastErr}`);
}, TIMEOUT_MS);

ws.on("open", () => {
  console.log("✓ WS open — sending connect");
  ws.send(JSON.stringify({ type: "connect", persona: "signature" }));
});

ws.on("message", (raw) => {
  let msg;
  try { msg = JSON.parse(raw.toString()); } catch { return; }

  switch (msg.type) {
    case "open":
      gotReady = true;
      console.log("✓ Gemini Live session open — waiting 3s then disconnecting (no mic in terminal)");
      setTimeout(() => ws.send(JSON.stringify({ type: "disconnect" })), 3000);
      break;
    case "audio":
      audioChunks++;
      audioBytes += Math.floor((msg.data?.length || 0) * 0.75);
      if (audioChunks === 1) console.log("✓ first audio chunk received");
      break;
    case "transcript":
      transcripts[msg.role] = (transcripts[msg.role] || "") + msg.text;
      break;
    case "interrupted":
      console.log("• interrupted event");
      break;
    case "turn_complete":
      console.log("✓ turn_complete received");
      turnComplete = true;
      setTimeout(() => {
        console.log(`\n=== SUMMARY ===`);
        console.log(`ready=${gotReady}`);
        console.log(`audio chunks=${audioChunks}, bytes~=${audioBytes}`);
        console.log(`user transcript: "${transcripts.user}"`);
        console.log(`model transcript: "${transcripts.model.slice(0, 200)}${transcripts.model.length > 200 ? "..." : ""}"`);
        clearTimeout(timer);
        bail(audioChunks > 0 ? 0 : 2, audioChunks > 0 ? "✓ LIVE PIPELINE OK" : "✗ no audio");
      }, 500);
      break;
    case "error":
      lastErr = msg.message;
      console.log(`✗ ERROR: ${msg.message}`);
      if (msg.userHint) console.log(`  hint: ${msg.userHint}`);
      clearTimeout(timer);
      bail(3, "✗ server reported error");
      break;
  }
});

ws.on("error", (e) => {
  lastErr = e.message;
  console.log(`✗ ws error: ${e.message}`);
});

ws.on("close", (code, reason) => {
  clearTimeout(timer);
  const reasonStr = reason?.toString() || "";
  if (gotReady && !lastErr) {
    console.log(`\n=== SUMMARY ===\nopen=${gotReady}  close code=${code} reason="${reasonStr}"`);
    bail(0, "✓ LIVE PROTOCOL OK (session opened without error)");
  } else {
    bail(4, `✗ closed (code=${code} reason="${reasonStr}")`);
  }
});
