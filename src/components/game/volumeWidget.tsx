import { cn } from "@/lib/utils";
import type { Game } from "@/osuMania/game";
import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import VolumeSettings from "../settings/volumeSettings";

function VolumeWidget({ game }: { game: Game }) {
  const setSettings = useSettingsStore.use.setSettings();
  const musicVolume = useSettingsStore.use.musicVolume();
  const sfxVolume = useSettingsStore.use.sfxVolume();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showWidget = () => {
    setIsVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Scroll up
      if (event.deltaY < 0) {
        setSettings((draft) => {
          draft.volume = Math.min(draft.volume + 0.05, 1);
        });
      }

      // Scroll down
      if (event.deltaY > 0) {
        setSettings((draft) => {
          draft.volume = Math.max(draft.volume - 0.05, 0);
        });
      }

      showWidget();
    };

    addEventListener("wheel", handleWheel);

    return () => {
      removeEventListener("wheel", handleWheel);
    };
  }, [setSettings]);

  useEffect(() => {
    game.song.volume(musicVolume);
  }, [game.song, musicVolume]);

  useEffect(() => {
    game.setSfxVolume(sfxVolume);
  }, [game.settings, sfxVolume, game]);

  return (
    <>
      <div
        className={cn(
          "bg-background pointer-events-none fixed right-12.5 bottom-12.5 z-20 w-75 rounded-lg border p-4 opacity-0 transition",
          isVisible && "pointer-events-auto opacity-100",
        )}
        onMouseMoveCapture={() => {
          if (isVisible) {
            showWidget();
          }
        }}
      >
        <VolumeSettings inWidget />
      </div>
    </>
  );
}

export default VolumeWidget;
