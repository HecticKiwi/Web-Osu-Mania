"use client";

import { Game } from "@/osuMania/game";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useContext, useRef } from "react";
import { settingsContext } from "../providers/settingsProvider";
import VolumeSlider from "../settings/volumeSlider";

function Volume({ game }: { game: Game }) {
  const { settings, resetSettings, updateSettings } =
    useContext(settingsContext);

  const ref = useRef<HTMLDivElement>(null!);

  useGSAP(
    (context, contextSafe) => {
      if (!contextSafe) {
        return;
      }

      const handleWheel = contextSafe((event: WheelEvent) => {
        // Scroll up
        if (event.deltaY < 0) {
          updateSettings({ volume: Math.min(settings.volume + 0.05, 1) });
        }

        // Scroll down
        if (event.deltaY > 0) {
          updateSettings({ volume: Math.max(settings.volume - 0.05, 0) });
        }
      });

      addEventListener("wheel", handleWheel);

      return () => {
        removeEventListener("wheel", handleWheel);
      };
    },
    {
      scope: ref,
      dependencies: [settings.volume, updateSettings],
    },
  );

  return (
    <>
      <div
        ref={ref}
        className="fixed bottom-[50px] right-[50px] flex h-[30px] w-[300px] rounded-lg border  bg-background px-3 py-5"
      >
        <VolumeSlider className="w-full" />
      </div>
    </>
  );
}

export default Volume;
