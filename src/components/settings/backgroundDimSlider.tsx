"use client";

import { Slider } from "@/components/ui/slider";
import { useIsClient } from "@uidotdev/usehooks";
import { PersonStanding } from "lucide-react";
import { useContext } from "react";
import { settingsContext } from "../providers/settingsProvider";

const BackgroundDimSlider = () => {
  const isClient = useIsClient();
  const { settings, updateSettings } = useContext(settingsContext);
  const { backgroundDim } = settings;

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full bg-primary"
            style={{ opacity: settings.backgroundDim }}
          ></div>
          <PersonStanding />
        </div>
        <Slider
          value={[backgroundDim]}
          max={1}
          step={0.01}
          onValueChange={([backgroundDim]) => updateSettings({ backgroundDim })}
          className="w-[150px]"
        />
      </div>
    </>
  );
};

export default BackgroundDimSlider;
