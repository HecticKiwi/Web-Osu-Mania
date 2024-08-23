import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import BeatmapSetProvider from "@/components/providers/beatmapSetProvider";
import { GameOverlayProvider } from "@/components/providers/gameOverlayProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import SettingsProvider from "@/components/providers/settingsProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";
import { AudioPreviewProvider } from "@/components/providers/audioPreviewProvider";
import BeatmapSetCacheProvider from "@/components/providers/beatmapSetCacheProvider";

export const varelaRound = Varela_Round({ subsets: ["latin"], weight: "400" });

gsap.registerPlugin(useGSAP);

export const metadata: Metadata = {
  title: "Web osu!mania",
  description: "Play osu!mania in your web browser.",
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
      <body className={`${varelaRound.className}`}>
        <ReactQueryProvider>
          <SettingsProvider>
            <BeatmapSetCacheProvider>
              <GameOverlayProvider>
                <AudioPreviewProvider>
                  <BeatmapSetProvider>
                    <TooltipProvider>
                      <Header />
                      {children}
                      <Toaster />
                    </TooltipProvider>
                  </BeatmapSetProvider>
                </AudioPreviewProvider>
              </GameOverlayProvider>
            </BeatmapSetCacheProvider>
          </SettingsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
