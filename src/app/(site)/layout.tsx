import Header from "@/components/header";
import ManiaIcon from "@/components/maniaIcon";
import { AudioProvider } from "@/components/providers/audioProvider";
import BeatmapSetProvider from "@/components/providers/beatmapSetProvider";
import { GameOverlayProvider } from "@/components/providers/gameOverlayProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import SettingsProvider from "@/components/providers/settingsProvider";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <SettingsProvider>
        <GameOverlayProvider>
          <AudioProvider>
            <BeatmapSetProvider>
              <TooltipProvider>
                <Header />
                {children}
              </TooltipProvider>
            </BeatmapSetProvider>
          </AudioProvider>
        </GameOverlayProvider>
      </SettingsProvider>
    </ReactQueryProvider>
  );
};

export default SiteLayout;
