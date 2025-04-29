"use client";

import { cn } from "@/lib/utils";
import { Game } from "@/osuMania/game";
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
    game.settings.sfxVolume = sfxVolume;
  }, [game.settings, sfxVolume]);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed bottom-[50px] right-[50px] z-20 w-[300px] rounded-lg border bg-background p-4 opacity-0 transition",
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
