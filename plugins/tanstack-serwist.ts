/**
 * Source: https://github.com/TanStack/router/discussions/4770#discussioncomment-15274878
 */

import { injectManifest } from "@serwist/build";
import path from "node:path";
import type { Plugin } from "vite";
import { build } from "vite";

interface PluginOptions {
  globPatterns: string[];
  additionalPrecacheEntries: { url: string; revision: string }[];
  maximumFileSizeToCacheInBytes: number;
}

/**
 * Custom Serwist plugin for TanStack Start
 * Builds service worker in both dev and production modes
 */
export function tanstackSerwist(opts: PluginOptions): Plugin {
  let rootDir: string;
  let isProduction: boolean;
  let hasRun = false; // Make sure it only runs once during the build process

  return {
    name: "tanstack-serwist",
    configResolved(config) {
      rootDir = config.root;
      isProduction = config.isProduction;
    },
    async buildStart() {
      if (!isProduction && !hasRun) {
        await buildServiceWorker(opts, rootDir, false);
        hasRun = true;
      }
    },
    async closeBundle() {
      if (isProduction && !hasRun) {
        await buildServiceWorker(opts, rootDir, true);
        hasRun = true;
      }
    },
  };
}

async function buildServiceWorker(
  opts: PluginOptions,
  rootDir: string,
  production: boolean,
) {
  const outName = "sw.js";
  const outDir = production
    ? path.resolve(rootDir, "dist", "client")
    : path.resolve(rootDir, "public");
  const swSrc = path.resolve(rootDir, "src", "sw.ts");
  const swDest = path.resolve(outDir, outName);
  const env = production ? "production" : "dev";

  console.log(`\n[SERWIST] Building service worker (${env}, ${swDest})...`);

  try {
    // Step 1: Bundle the service worker with Vite
    await build({
      root: rootDir,
      configFile: false,
      define: {
        "process.env.NODE_ENV": JSON.stringify(
          production ? "production" : "development",
        ),
      },
      build: {
        lib: {
          entry: swSrc,
          formats: ["es"],
          fileName: () => outName,
        },
        outDir,
        emptyOutDir: false,
        minify: production,
        rollupOptions: {
          output: {
            entryFileNames: outName,
          },
        },
      },
      logLevel: "error",
    });

    // Step 2: Inject the precache manifest (only in production)
    if (production) {
      const result = await injectManifest({
        swSrc: swDest,
        swDest,
        globDirectory: outDir,
        injectionPoint: "self.__SW_MANIFEST",
        ...opts,
      });

      const cacheSize = (result.size / 1024 / 1024).toFixed(2);

      console.log(
        `[SERWIST] Precached ${result.count} files (${cacheSize} MB)`,
      );
    } else {
      console.log("[SERWIST] Dev service worker built");
    }
  } catch (error) {
    console.error("[SERWIST] Failed to build service worker:", error);
    throw error;
  }
}
