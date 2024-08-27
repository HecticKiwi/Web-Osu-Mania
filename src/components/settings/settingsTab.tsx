"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Keybinds from "../keybinds";
import { useSettingsContext } from "../providers/settingsProvider";
import { Switch } from "../ui/switch";
import BackgroundDimSlider from "./backgroundDimSlider";
import BeatmapSettings from "./beatmapSettings";
import VolumeSettings from "./volumeSettings";

const SettingsTab = () => {
  const { settings, resetSettings, setSettings } = useSettingsContext();

  if (!settings) {
    return null;
  }

  return (
    <>
      <h3 className="text-lg font-semibold">General</h3>
      <div className="mt-1 space-y-3">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Background Dim
          </div>

          <BackgroundDimSlider />
        </div>

        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Scroll Speed
          </div>

          <div className={cn("flex items-center gap-4")}>
            <div className="group w-full">
              <Tooltip open>
                <TooltipTrigger asChild>
                  <Slider
                    value={[settings.scrollSpeed]}
                    min={1}
                    max={40}
                    step={1}
                    onValueChange={([scrollSpeed]) =>
                      setSettings((draft) => {
                        draft.scrollSpeed = scrollSpeed;
                      })
                    }
                  />
                </TooltipTrigger>
                <TooltipContent className="sr-only group-focus-within:not-sr-only group-focus-within:px-3 group-focus-within:py-1.5 group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                  {settings.scrollSpeed}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold">Display</h3>
      <div className="mt-1 space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Upscroll (DDR Style)
          </div>

          <Switch
            checked={settings.upscroll}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.upscroll = checked;
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Show 300g Judgement
          </div>

          <Switch
            checked={settings.show300g}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.show300g = checked;
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Show Error Bar
          </div>

          <Switch
            checked={settings.showErrorBar}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.showErrorBar = checked;
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Show FPS Counter
          </div>

          <Switch
            checked={settings.showFpsCounter}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.showFpsCounter = checked;
              })
            }
          />
        </div>
      </div>

      <VolumeSettings className="mt-4" />

      <BeatmapSettings />

      <Button
        className="mt-8 w-full"
        variant={"destructive"}
        size={"sm"}
        onClick={() => resetSettings()}
      >
        Reset Settings
      </Button>

      <Separator className="my-6" />

      <h3 className="text-lg font-semibold">Keybinds</h3>
      <div className="mt-1">
        <Keybinds />
      </div>
    </>
  );
};

export default SettingsTab;
