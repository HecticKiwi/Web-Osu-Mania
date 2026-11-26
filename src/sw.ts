/*
 * See https://serwist.pages.dev/docs/vite/getting-started
 */

import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const externalStrategy = new StaleWhileRevalidate({
  cacheName: "external",
});

const externalStaticStrategy = new CacheFirst({
  cacheName: "external-static",
  plugins: [
    new ExpirationPlugin({
      maxEntries: 4,
      maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      maxAgeFrom: "last-used",
    }),
  ],
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === "document",
      handler: new NetworkOnly(), // falls back to /_shell.html below
    },
    {
      matcher:
        /^https:\/\/(?:fonts\.googleapis\.com|.*onrender.com|gist.githubusercontent.com)\/.*/i,
      handler: externalStrategy,
    },
    {
      matcher: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: externalStaticStrategy,
    },
  ],
  fallbacks: {
    entries: [
      {
        matcher: ({ request }) => request.destination === "document",
        url: "/_shell.html",
      },
    ],
  },
});

serwist.addEventListeners();
