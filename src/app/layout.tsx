import Header from "@/components/header";
import BeatmapSetCacheProvider from "@/components/providers/beatmapSetCacheProvider";
import { GameProvider } from "@/components/providers/gameProvider";
import HighScoresProvider from "@/components/providers/highScoresProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import SavedBeatmapSetsProvider from "@/components/providers/savedBeatmapSetsProvider";
import SettingsProvider from "@/components/providers/settingsProvider";
import StoredBeatmapSetsProvider from "@/components/providers/storedBeatmapSetsProvider";
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
              <StoredBeatmapSetsProvider>
                <BeatmapSetCacheProvider>
                  <SavedBeatmapSetsProvider>
                    <HighScoresProvider>
                      <GameProvider>
                        <Header />
                        {children}
                        <Toaster />
                      </GameProvider>
                    </HighScoresProvider>
                  </SavedBeatmapSetsProvider>
                </BeatmapSetCacheProvider>
              </StoredBeatmapSetsProvider>
            </SettingsProvider>
          </ReactQueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
