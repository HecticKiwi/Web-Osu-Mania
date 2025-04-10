"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalizeFirstLetter } from "@/lib/utils";
import { MAX_TIME_RANGE } from "@/osuMania/constants";
import { toast } from "sonner";
import { useHighScoresContext } from "../providers/highScoresProvider";
import {
  SKIN_STYLE_ICONS,
  SKIN_STYLES,
  SkinStyle,
  useSettingsContext,
} from "../providers/settingsProvider";
import SwitchInput from "../switchInput";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import BackgroundBlurSlider from "./backgroundBlurSlider";
import BackgroundDimSlider from "./backgroundDimSlider";
import BeatmapSettings from "./beatmapSettings";
import VolumeSettings from "./volumeSettings";

const SettingsTab = () => {
  const { settings, resetSettings, setSettings } = useSettingsContext();
  const { setHighScores } = useHighScoresContext();

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
            Background Blur
          </div>

          <BackgroundBlurSlider />
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
                {Math.round(MAX_TIME_RANGE / settings.scrollSpeed)}ms (speed{" "}
                {settings.scrollSpeed})
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Unpause Delay
          </div>

          <div className="group w-full">
            <Tooltip open>
              <TooltipTrigger asChild>
                <Slider
                  value={[settings.unpauseDelay]}
                  min={0}
                  max={3000}
                  step={100}
                  onValueChange={([unpauseDelay]) =>
                    setSettings((draft) => {
                      draft.unpauseDelay = unpauseDelay;
                    })
                  }
                />
              </TooltipTrigger>
              <TooltipContent className="sr-only group-focus-within:not-sr-only group-focus-within:px-3 group-focus-within:py-1.5 group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                {settings.unpauseDelay === 0 && "No Delay"}
                {settings.unpauseDelay > 0 &&
                  `${settings.unpauseDelay}ms (${settings.unpauseDelay / 1000}s)`}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {settings.unpauseDelay > 0 && settings.unpauseDelay < 500 && (
          <p className="mt-2 text-sm text-orange-400">
            The unpause countdown will not be shown when the delay is under
            500ms.
          </p>
        )}

        <SwitchInput
          label="Retry on Fail"
          checked={settings.retryOnFail}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.retryOnFail = checked;
            })
          }
        />

        <SwitchInput
          label="Show Unranked Modes (11K-18K)"
          checked={settings.showUnrankedModes}
          onCheckedChange={(checked) => {
            setSettings((draft) => {
              draft.showUnrankedModes = checked;
            });
          }}
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold">Language</h3>
      <div className="mt-2 space-y-3">
        <SwitchInput
          label="Prefer Metadata in Original Language"
          checked={settings.preferMetadataInOriginalLanguage}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.preferMetadataInOriginalLanguage = checked;
            })
          }
        />
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
                <span className="flex gap-2">
                  <span className="w-4 text-center">
                    {SKIN_STYLE_ICONS[style]}
                  </span>
                  {capitalizeFirstLetter(style)}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <SwitchInput
          label="Darker Hold Notes"
          checked={settings.darkerHoldNotes}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.darkerHoldNotes = checked;
            })
          }
        />
        <SwitchInput
          label="Upscroll (DDR Style)"
          checked={settings.upscroll}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.upscroll = checked;
            })
          }
        />
        <div className="grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Hit Position
          </div>

          <div className="group w-full">
            <Tooltip open>
              <TooltipTrigger asChild>
                <Slider
                  value={[settings.hitPositionOffset]}
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={([hitPositionOffset]) =>
                    setSettings((draft) => {
                      draft.hitPositionOffset = hitPositionOffset;
                    })
                  }
                />
              </TooltipTrigger>
              <TooltipContent className="sr-only group-focus-within:not-sr-only group-focus-within:px-3 group-focus-within:py-1.5 group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                {settings.hitPositionOffset}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <SwitchInput
          label="Show Score"
          checked={settings.ui.showScore}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showScore = checked;
            })
          }
        />
        <SwitchInput
          label="Show Combo"
          checked={settings.ui.showCombo}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showCombo = checked;
            })
          }
        />
        <SwitchInput
          label="Show Accuracy"
          checked={settings.ui.showAccuracy}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showAccuracy = checked;
            })
          }
        />
        <SwitchInput
          label="Show Judgement"
          checked={settings.ui.showJudgement}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showJudgement = checked;

              if (!checked) {
                draft.show300g = false;
              }
            })
          }
        />
        <SwitchInput
          label="Show 300g Judgement"
          checked={settings.show300g}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.show300g = checked;

              if (checked) {
                draft.ui.showJudgement = true;
              }
            })
          }
        />
        <SwitchInput
          label="Show Progress Bar"
          checked={settings.ui.showProgressBar}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showProgressBar = checked;
            })
          }
        />
        <SwitchInput
          label="Show Health Bar"
          checked={settings.ui.showHealthBar}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showHealthBar = checked;
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
        className="mt-4 w-full"
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          setHighScores({});
          toast("High scores have been reset.");
        }}
      >
        Clear High Scores
      </Button>
      <Button
        className="mt-4 w-full"
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          resetSettings();
          toast("Settings have been reset.");
        }}
      >
        Reset Settings
      </Button>
    </>
  );
};

export default SettingsTab;
