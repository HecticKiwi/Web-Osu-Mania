/// <reference types="vite/client" />
import ReactScan from "@/components/debug/reactScan";
import Header from "@/components/header";
import Html from "@/components/html";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { seo } from "@/lib/seo";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles/globals.css?url";

const title = "Web osu!mania";
const description = "Play osu!mania beatmaps in your web browser.";
const ogImageUrl = `https://webosumania.com/opengraph-image.png`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
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
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: appCss,
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

            <Outlet />

            <Toaster />
            <ReactScan />
          </ReactQueryProvider>
        </TooltipProvider>

        <Scripts />
      </body>
    </Html>
  );
}
