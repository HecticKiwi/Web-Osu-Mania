"use client";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import IntegerInput from "../settings/integerInput";

const ModsTab = () => {
  const { settings, setSettings, resetMods } = useSettingsContext();

  if (!settings) {
    return null;
  }

  return (
    <>
      <h3 className="mb-1 text-lg font-semibold">Difficulty Reduction</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Easy
          </div>
          <Switch
            checked={settings.mods.easy}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.mods.easy = checked;

                if (checked) {
                  draft.mods.hardRock = false;
                }
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Half Time
          </div>
          <Switch
            checked={settings.mods.playbackRate === 0.75}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                if (checked) {
                  draft.mods.playbackRate = 0.75;
                } else {
                  draft.mods.playbackRate = 1;
                }
              })
            }
          />
        </div>
      </div>

      <h3 className="mb-1 mt-4 text-lg font-semibold">Difficulty Increase</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Hard Rock
          </div>
          <Switch
            checked={settings.mods.hardRock}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.mods.hardRock = checked;

                if (checked) {
                  draft.mods.easy = false;
                }
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Double Time
          </div>
          <Switch
            checked={settings.mods.playbackRate === 1.5}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                if (checked) {
                  draft.mods.playbackRate = 1.5;
                } else {
                  draft.mods.playbackRate = 1;
                }
              })
            }
          />
        </div>
      </div>

      <h3 className="mb-1 mt-4 text-lg font-semibold">Special</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Autoplay
          </div>
          <Switch
            checked={settings.mods.autoplay}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.mods.autoplay = checked;
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Mirror
          </div>
          <Switch
            checked={settings.mods.mirror}
            onCheckedChange={(checked) =>
              setSettings((draft) => {
                draft.mods.mirror = checked;
              })
            }
          />
        </div>
      </div>

      <h3 className="mb-1 mt-4 text-lg font-semibold">Custom</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Song Speed
          </div>

          <div className={cn("flex items-center gap-4")}>
            <div className="group w-full">
              <Tooltip open>
                <TooltipTrigger asChild>
                  <Slider
                    value={[settings.mods.playbackRate]}
                    min={0.5}
                    max={2}
                    step={0.05}
                    onValueChange={([playbackRate]) =>
                      setSettings((draft) => {
                        draft.mods.playbackRate = playbackRate;
                      })
                    }
                  />
                </TooltipTrigger>
                <TooltipContent className="sr-only group-focus-within:not-sr-only group-focus-within:px-3 group-focus-within:py-1.5 group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                  {settings.mods.playbackRate}x
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant={"destructive"}
        className="mt-8 w-full"
        onClick={() => resetMods()}
      >
        Reset Mods
      </Button>
    </>
  );
};

export default ModsTab;
