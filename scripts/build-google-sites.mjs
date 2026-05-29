/**
 * Builds one self-contained HTML file per page (vite-plugin-singlefile supports a single entry per run).
 */
import { rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pages = [
  { id: "main", input: "index.html" },
  { id: "kryptosSupport", input: "kryptos/index.html" },
  { id: "kryptosPrivacy", input: "kryptos/privacy.html" },
];

rmSync(resolve(root, "dist-google-sites"), { recursive: true, force: true });

for (let i = 0; i < pages.length; i += 1) {
  const page = pages[i];
  process.env.GS_PAGE = page.id;
  process.env.GS_INPUT = page.input;
  process.env.GS_EMPTY_OUT_DIR = i === 0 ? "true" : "false";

  await build({
    configFile: resolve(root, "vite.config.google-sites.js"),
    root,
  });

  console.log(`Built ${page.input} → dist-google-sites/${page.input}`);
}

console.log("\nGoogle Sites embed build complete: dist-google-sites/");
