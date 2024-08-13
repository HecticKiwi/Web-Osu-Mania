import { AudioProvider } from "@/components/providers/audioProvider";
import BeatmapSetProvider from "@/components/providers/beatmapSetProvider";
import { GameOverlayProvider } from "@/components/providers/gameOverlayProvider";
import ReactQueryProvider from "@/components/providers/reactQueryProvider";
import SettingsProvider from "@/components/providers/settingsProvider";
import { ReactNode } from "react";

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <SettingsProvider>
        <GameOverlayProvider>
          <AudioProvider>
            <BeatmapSetProvider>{children}</BeatmapSetProvider>
          </AudioProvider>
        </GameOverlayProvider>
      </SettingsProvider>
    </ReactQueryProvider>
  );
};

export default SiteLayout;
