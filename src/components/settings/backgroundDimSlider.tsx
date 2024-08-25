"use client";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PersonStanding } from "lucide-react";
import { useSettingsContext } from "../providers/settingsProvider";

const BackgroundDimSlider = () => {
  const { settings, setSettings } = useSettingsContext();
  const { backgroundDim } = settings;

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
        <div className="group w-full">
          <Tooltip open>
            <TooltipTrigger asChild>
              <Slider
                value={[backgroundDim]}
                max={1}
                step={0.01}
                onValueChange={([backgroundDim]) =>
                  setSettings((draft) => {
                    draft.backgroundDim = backgroundDim;
                  })
                }
              />
            </TooltipTrigger>

            <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
              {(backgroundDim * 100).toFixed(0)}%
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default BackgroundDimSlider;
