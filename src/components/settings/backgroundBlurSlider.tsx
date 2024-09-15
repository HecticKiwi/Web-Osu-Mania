"use client";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PersonStanding } from "lucide-react";
import { useSettingsContext } from "../providers/settingsProvider";

const BackgroundBlurSlider = () => {
  const { settings, setSettings } = useSettingsContext();
  const { backgroundBlur } = settings;

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative">
          <PersonStanding
            style={{ filter: `blur(${settings.backgroundBlur * 4}px)` }}
          />
        </div>
        <div className="group w-full">
          <Tooltip open>
            <TooltipTrigger asChild>
              <Slider
                value={[backgroundBlur]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={([backgoundbackgroundBlur]) =>
                  setSettings((draft) => {
                    draft.backgroundBlur = backgoundbackgroundBlur;
                  })
                }
              />
            </TooltipTrigger>

            <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
              {(backgroundBlur * 100).toFixed(0)}%
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default BackgroundBlurSlider;
