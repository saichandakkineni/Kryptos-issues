import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
        kryptosSupport: "kryptos/index.html",
        kryptosPrivacy: "kryptos/privacy.html",
      },
    },
  },
  server: {
    port: 5173,
    open: "/kryptos/",
  },
});
