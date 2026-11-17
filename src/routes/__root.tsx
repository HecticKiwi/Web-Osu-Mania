/// <reference types="vite/client" />
import ReactScan from "@/components/debug/reactScan";
import Header from "@/components/header";
import Html from "@/components/html";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { seo } from "@/lib/seo";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "../styles/globals.css?url";

const title = "Web osu!mania";
const description = "Play osu!mania beatmaps in your web browser.";
const ogImageUrl = `https://webosumania.com/opengraph-image.png`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "theme-color", content: "#070e16" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Web osu!mania",
      },
      {
        name: "google-site-verification",
        content: "ewJX1E1zwNcx0NgBxQfHwOkQduww8reYJX3rIZZyb40",
      },
      ...seo({ title, description, image: ogImageUrl }),
    ],
    scripts: [
      {
        defer: true,
        src: "https://umami-37qe.onrender.com/script.js",
        "data-website-id": "1f4308a9-454f-4529-8e28-1d3cb64f58e6",
        "data-exclude-search": "true",
        "data-domains": "webosumania.com",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <Html>
      <head>
        <HeadContent />
      </head>
      <body className="">
        <TooltipProvider>
          <ReactQueryProvider>
            <Header />

            <main className="[view-transition-name:main-content]">
              <Outlet />
            </main>

            <Toaster />
            <ReactScan />
          </ReactQueryProvider>
        </TooltipProvider>

        <Scripts />
      </body>
    </Html>
  );
}
