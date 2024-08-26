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
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
                    <Analytics />
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
