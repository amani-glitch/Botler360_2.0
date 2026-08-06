/**
 * Bundles server/index.ts → dist/server/index.mjs (single file, ESM).
 * External: @google/genai, ws, express (kept as runtime deps in node_modules).
 * Copies server/prompts/*.md → dist/server/prompts/ so loadPrompt() finds them.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "dist", "server");
const SRC = path.join(ROOT, "server", "index.ts");
const PROMPTS_SRC = path.join(ROOT, "server", "prompts");
const PROMPTS_DST = path.join(OUT_DIR, "prompts");

async function clean() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
}

async function copyPrompts() {
  await fs.mkdir(PROMPTS_DST, { recursive: true });
  const entries = await fs.readdir(PROMPTS_SRC);
  for (const f of entries) {
    if (!f.endsWith(".md")) continue;
    await fs.copyFile(path.join(PROMPTS_SRC, f), path.join(PROMPTS_DST, f));
  }
  console.log(`✓ copied ${entries.filter((f) => f.endsWith(".md")).length} prompt(s)`);
}

async function bundle() {
  await build({
    entryPoints: [SRC],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    outfile: path.join(OUT_DIR, "index.mjs"),
    // Keep node_modules deps external — they ship via node_modules in the image.
    packages: "external",
    // Native ESM under Node needs a banner with createRequire so any CJS deps
    // pulled by transitives still load.
    banner: {
      js: [
        `import { createRequire } from "module";`,
        `const require = createRequire(import.meta.url);`,
      ].join("\n"),
    },
    minify: true,
    sourcemap: false,
    logLevel: "info",
  });
  console.log("✓ bundled dist/server/index.mjs");
}

await clean();
await bundle();
await copyPrompts();

console.log("\nBuild OK. Next:");
console.log("  docker build -t botler-api .");
console.log("  gcloud run deploy botler-api --source . --region europe-west1");
