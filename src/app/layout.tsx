import Header from "@/components/header";
import { AudioPreviewProvider } from "@/components/providers/audioPreviewProvider";
import BeatmapSetCacheProvider from "@/components/providers/beatmapSetCacheProvider";
import { GameProvider } from "@/components/providers/gameOverlayProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import SettingsProvider from "@/components/providers/settingsProvider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import Script from "next/script";
import "./globals.css";

export const runtime = "edge";

export const varelaRound = Varela_Round({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: "Web osu!mania",
  description: "Play osu!mania beatmaps in your web browser.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scrollbar scrollbar-track-background scrollbar-thumb-primary"
    >
      <Script
        defer
        src="https://umami-37qe.onrender.com/script.js"
        data-website-id="1f4308a9-454f-4529-8e28-1d3cb64f58e6"
      />
      <body className={`${varelaRound.className}`}>
        <TooltipProvider>
          <ReactQueryProvider>
            <SettingsProvider>
              <BeatmapSetCacheProvider>
                <GameProvider>
                  <AudioPreviewProvider>
                    <Header />
                    {children}
                    <Toaster />
                  </AudioPreviewProvider>
                </GameProvider>
              </BeatmapSetCacheProvider>
            </SettingsProvider>
          </ReactQueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
