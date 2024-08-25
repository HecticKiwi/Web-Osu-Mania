"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useSettingsContext } from "../providers/settingsProvider";

const VolumeSlider = ({ className }: { className?: string }) => {
  const { settings, setSettings } = useSettingsContext();
  const { volume } = settings;

  return (
    <>
      <div className={cn("flex items-center gap-4", className)}>
        {volume === 0 ? (
          <VolumeX className="shrink-0" />
        ) : volume < 0.33 ? (
          <Volume className="shrink-0" />
        ) : volume < 0.66 ? (
          <Volume1 className="shrink-0" />
        ) : (
          <Volume2 className="shrink-0" />
        )}

        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={([volume]) =>
            setSettings((draft) => {
              draft.volume = volume;
            })
          }
          className="w-full"
        />
      </div>
    </>
  );
};

export default VolumeSlider;
