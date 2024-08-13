"use client";

import { Slider } from "@/components/ui/slider";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useContext, useRef } from "react";
import { settingsContext } from "../providers/settingsProvider";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";

const VolumeSlider = ({ className }: { className?: string }) => {
  const { settings, updateSettings } = useContext(settingsContext);
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
          onValueChange={([volume]) => updateSettings({ volume })}
          className="w-full"
        />
      </div>
    </>
  );
};

export default VolumeSlider;
