import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { tanstackSerwist } from "./plugins/tanstack-serwist.ts";

const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), "VITE_");

export default defineConfig({
  base: env.VITE_PRERENDER ? "/Web-Osu-Mania/" : "/",
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      prerender: {
        enabled: env.VITE_PRERENDER === "true",
        crawlLinks: false,
      },
    }),
    viteReact(),
    tailwindcss(),
    tanstackSerwist({
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,mp3}"],
      maximumFileSizeToCacheInBytes: 5000000,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  }
});
