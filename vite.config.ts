// vite.config.ts
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
        onSuccess: ({ page }) => {
          console.log(`Rendered ${page.path}!`);
        },
      },
    }),
    viteReact(),
  ],
});
