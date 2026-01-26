// vite.config.ts
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), "VITE_");

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        enabled: env.VITE_PRERENDER === "true",
        crawlLinks: false,
      },
    }),
    viteReact(),
  ],
});
