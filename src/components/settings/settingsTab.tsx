"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalizeFirstLetter } from "@/lib/utils";
import Keybinds from "../keybinds";
import {
  SKIN_STYLES,
  SkinStyle,
  useSettingsContext,
} from "../providers/settingsProvider";
import SwitchInput from "../switchInput";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
      <div className="mt-2 space-y-3">
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

      <h3 className="mb-2 mt-6 text-lg font-semibold">Display</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2">
          <Label
            htmlFor="beatmapProvider"
            className="text-sm font-semibold text-muted-foreground"
          >
            Style
          </Label>

          <RadioGroup
            id="style"
            value={settings.style}
            onValueChange={(value: SkinStyle) =>
              setSettings((draft) => {
                draft.style = value;
              })
            }
            className="space-y-2"
          >
            {SKIN_STYLES.map((style) => (
              <Label
                key={style}
                htmlFor={style}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem value={style} id={style} />
                <span>{capitalizeFirstLetter(style)}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <SwitchInput
          label="Upscroll (DDR Style)"
          checked={settings.upscroll}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.upscroll = checked;
            })
          }
        />
        <SwitchInput
          label="Show 300g Judgement"
          checked={settings.show300g}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.show300g = checked;
            })
          }
        />
        <SwitchInput
          label="Show Error Bar"
          checked={settings.showErrorBar}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.showErrorBar = checked;
            })
          }
        />
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Error Bar Scale
          </div>

          <div className="group w-full">
            <Tooltip open>
              <TooltipTrigger asChild>
                <Slider
                  value={[settings.errorBarScale]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={([errorBarScale]) =>
                    setSettings((draft) => {
                      draft.errorBarScale = errorBarScale;
                    })
                  }
                />
              </TooltipTrigger>
              <TooltipContent className="sr-only group-focus-within:not-sr-only group-focus-within:px-3 group-focus-within:py-1.5 group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                {settings.errorBarScale}x
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <SwitchInput
          label="Show FPS Counter"
          checked={settings.showFpsCounter}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.showFpsCounter = checked;
            })
          }
        />
      </div>

      <VolumeSettings className="mt-6" />

      <BeatmapSettings className="mt-6" />

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
      <div className="mt-2">
        <Keybinds />
      </div>
    </>
  );
};

export default SettingsTab;
