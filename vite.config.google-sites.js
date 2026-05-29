import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";

const root = process.cwd();
const input = process.env.GS_INPUT || "index.html";
const emptyOutDir = process.env.GS_EMPTY_OUT_DIR !== "false";

/** One HTML entry per build run; see scripts/build-google-sites.mjs */
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile({ removeViteModuleLoader: true })],
  define: {
    "import.meta.env.VITE_INLINE_DATA": JSON.stringify("true"),
    "import.meta.env.VITE_GOOGLE_SITES": JSON.stringify("true"),
  },
  build: {
    outDir: "dist-google-sites",
    emptyOutDir,
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(root, input),
    },
  },
});
