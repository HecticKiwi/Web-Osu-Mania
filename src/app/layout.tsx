import ReactScan from "@/components/debug/reactScan";
import { GameOverlay } from "@/components/game/gameOverlay";
import Header from "@/components/header";
import Html from "@/components/html";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import UploadDialog from "@/components/settings/uploadDialog";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const varelaRound = Varela_Round({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: "Web osu!mania",
  description: "Play osu!mania beatmaps in your web browser.",
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "google-site-verification": "ewJX1E1zwNcx0NgBxQfHwOkQduww8reYJX3rIZZyb40",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Html>
      <Script
        defer
        src="https://umami-37qe.onrender.com/script.js"
        data-website-id="1f4308a9-454f-4529-8e28-1d3cb64f58e6"
      />
      <body className={`${varelaRound.className}`}>
        <TooltipProvider>
          <ReactQueryProvider>
            <Header />

            {children}

            <UploadDialog />
            <GameOverlay />
            <Toaster />
            <ReactScan />
          </ReactQueryProvider>
        </TooltipProvider>
      </body>
    </Html>
  );
}
