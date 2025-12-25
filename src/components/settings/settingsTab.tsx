"use client";

import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";
import { MAX_TIME_RANGE } from "@/osuMania/constants";
import { PersonStanding } from "lucide-react";
import { toast } from "sonner";
import {
  EarlyLateThreshold,
  earlyLateThresholdOptions,
  judgementCounterOptions,
  JudgementCounterPosition,
  TouchMode,
  touchModes,
  useSettingsStore,
} from "../../stores/settingsStore";
import RadioGroupInput from "../inputs/radioGroupInput";
import SelectInput, { NULL_OPTION } from "../inputs/selectInput";
import SliderInput from "../inputs/sliderInput";
import SwitchInput from "../inputs/switchInput";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";
import { SelectItem } from "../ui/select";
import { Separator } from "../ui/separator";
import BackupSettings from "./backupSettings";
import BeatmapSettings from "./beatmapSettings";
import ClearHighScoresButton from "./clearHighScoresButton";
import HideBeatmapSetCoverWarning from "./hideBeatmapSetCoverWarning";
import ReplaySettings from "./replaySettings";
import SkinSettings from "./skinSettings";
import UnpauseDelayWarning from "./unpauseDelayWarning";
import VolumeSettings from "./volumeSettings";

const SettingsTab = () => {
  const setSettings = useSettingsStore.use.setSettings();
  const resetSettings = useSettingsStore.use.resetSettings();

  return (
    <>
      <h3 className="text-lg font-semibold">General</h3>
      <div className="mt-2 space-y-3">
        <SliderInput
          label="Website Color"
          selector={(state) => state.hue}
          graphic={(hue) => (
            <div
              className="size-6 shrink-0 rounded-full"
              style={{ backgroundColor: `hsl(${hue}, 80%, 69%)` }}
            ></div>
          )}
          tooltip={(hue) => hue}
          onValueChange={([hue]) =>
            setSettings((draft) => {
              draft.hue = hue;
            })
          }
          min={0}
          max={360}
          step={1}
        />

        <SwitchInput
          label="Prefer Metadata in Original Language"
          selector={(state) => state.preferMetadataInOriginalLanguage}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.preferMetadataInOriginalLanguage = checked;
            })
          }
        />

        <SwitchInput
          label="Hide Beatmap Set Covers"
          selector={(state) => state.hideBeatmapSetCovers}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.hideBeatmapSetCovers = checked;
            })
          }
        />

        <HideBeatmapSetCoverWarning />
      </div>

      <h3 className="mt-6 text-lg font-semibold">Gameplay</h3>
      <div className="mt-2 space-y-3">
        <SliderInput
          label="Background Dim"
          selector={(state) => state.backgroundDim}
          graphic={(backgroundDim) => (
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full bg-primary"
                style={{ opacity: backgroundDim }}
              ></div>
              <PersonStanding />
            </div>
          )}
          tooltip={(backgroundDim) => `${(backgroundDim * 100).toFixed(0)}%`}
          onValueChange={([backgroundDim]) =>
            setSettings((draft) => {
              draft.backgroundDim = backgroundDim;
            })
          }
          min={0}
          max={1}
          step={0.01}
        />

        <SliderInput
          label="Background Blur"
          selector={(state) => state.backgroundBlur}
          graphic={(backgroundBlur) => (
            <div>
              <PersonStanding
                style={{ filter: `blur(${backgroundBlur * 4}px)` }}
              />
            </div>
          )}
          tooltip={(backgroundBlur) => `${(backgroundBlur * 100).toFixed(0)}%`}
          onValueChange={([backgroundBlur]) =>
            setSettings((draft) => {
              draft.backgroundBlur = backgroundBlur;
            })
          }
          min={0}
          max={1}
          step={0.01}
        />

        <SliderInput
          label="Scroll Speed"
          selector={(state) => state.scrollSpeed}
          tooltip={(scrollSpeed) =>
            `${Math.round(MAX_TIME_RANGE / scrollSpeed)}ms (speed ${scrollSpeed})`
          }
          onValueChange={([scrollSpeed]) =>
            setSettings((draft) => {
              draft.scrollSpeed = scrollSpeed;
            })
          }
          min={1}
          max={40}
          step={1}
        />

        <SliderInput
          label="Unpause Delay"
          selector={(state) => state.unpauseDelay}
          tooltip={(unpauseDelay) =>
            unpauseDelay === 0
              ? "No Delay"
              : `${unpauseDelay}ms (${unpauseDelay / 1000}s)`
          }
          onValueChange={([unpauseDelay]) =>
            setSettings((draft) => {
              draft.unpauseDelay = unpauseDelay;
            })
          }
          min={0}
          max={3000}
          step={100}
        />

        <UnpauseDelayWarning />

        <SwitchInput
          label="Retry on Fail"
          selector={(state) => state.retryOnFail}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.retryOnFail = checked;
            })
          }
        />

        <SwitchInput
          label="Performance Mode"
          selector={(state) => state.performanceMode}
          onCheckedChange={(checked) => {
            setSettings((draft) => {
              draft.performanceMode = checked;
            });
          }}
        />

        <p className="text-sm text-muted-foreground">
          Enable performance mode if you are experiencing low FPS. This will
          disable animations and hitsounds.
        </p>
      </div>

      <h3 className="mt-6 text-lg font-semibold">Touch Controls</h3>
      <div className="mt-2 space-y-3">
        <RadioGroupInput
          label="Mode"
          selector={(state) => state.touch.mode}
          onValueChange={(value: TouchMode) =>
            setSettings((draft) => {
              draft.touch.mode = value;
            })
          }
          className="space-y-2"
        >
          {touchModes.map((touchMode) => (
            <Label
              key={touchMode}
              htmlFor={touchMode}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem value={touchMode} id={touchMode} />
              <span className="flex gap-2">
                {capitalizeFirstLetter(touchMode)}
              </span>
            </Label>
          ))}
        </RadioGroupInput>
        <SliderInput
          label="Border Opacity"
          selector={(state) => state.touch.borderOpacity}
          tooltip={(borderOpacity) => {
            return `${Math.round(borderOpacity * 100)}%`;
          }}
          onValueChange={([borderOpacity]) =>
            setSettings((draft) => {
              draft.touch.borderOpacity = borderOpacity;
            })
          }
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      <SkinSettings />

      <h3 className="mb-2 mt-6 text-lg font-semibold">Display</h3>
      <div className="space-y-4">
        <SliderInput
          label="Stage Position"
          selector={(state) => state.stagePosition}
          tooltip={(stagePosition) => {
            if (stagePosition === 0) {
              return "Centered";
            }

            return `${Math.abs(Math.round(stagePosition * 100))}% ${stagePosition < 0 ? "Left" : "Right"}`;
          }}
          onValueChange={([stagePosition]) =>
            setSettings((draft) => {
              draft.stagePosition = stagePosition;
            })
          }
          min={-1}
          max={1}
          step={0.01}
        />
        <SliderInput
          label="Hit Position"
          selector={(state) => state.hitPositionOffset}
          tooltip={(hitPositionOffset) => `${hitPositionOffset}px`}
          onValueChange={([hitPositionOffset]) =>
            setSettings((draft) => {
              draft.hitPositionOffset = hitPositionOffset;
            })
          }
          min={0}
          max={200}
          step={1}
        />

        <p className="text-sm text-muted-foreground">
          Affects the vertical position of the note receptors.
        </p>

        <SliderInput
          label="Note Offset"
          selector={(state) => state.noteOffset}
          tooltip={(noteOffset) => `${noteOffset}px`}
          onValueChange={([noteOffset]) =>
            setSettings((draft) => {
              draft.noteOffset = noteOffset;
            })
          }
          min={-100}
          max={100}
          step={1}
        />

        <p className="text-sm text-muted-foreground">
          Affects when notes should visually be hit relative to the note
          receptors.
        </p>

        <SliderInput
          label="Lane Width Adjustment"
          selector={(state) => state.laneWidthAdjustment}
          tooltip={(laneWidthAdjustment) =>
            `${Math.round(laneWidthAdjustment)}px`
          }
          onValueChange={([laneWidthAdjustment]) =>
            setSettings((draft) => {
              draft.laneWidthAdjustment = laneWidthAdjustment;
            })
          }
          min={-20}
          max={80}
          step={1}
        />
        <SliderInput
          label="Receptor Opacity"
          selector={(state) => state.ui.receptorOpacity}
          tooltip={(receptorOpacity) => `${Math.round(receptorOpacity * 100)}%`}
          onValueChange={([receptorOpacity]) =>
            setSettings((draft) => {
              draft.ui.receptorOpacity = receptorOpacity;
            })
          }
          min={0}
          max={1}
          step={0.01}
        />
        <SwitchInput
          label="Upscroll (DDR Style)"
          selector={(state) => state.upscroll}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.upscroll = checked;
            })
          }
        />
        <SwitchInput
          label="Show Score"
          selector={(state) => state.ui.showScore}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showScore = checked;
            })
          }
        />
        <SwitchInput
          label="Show Combo"
          selector={(state) => state.ui.showCombo}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showCombo = checked;
            })
          }
        />
        <SwitchInput
          label="Show Accuracy"
          selector={(state) => state.ui.showAccuracy}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showAccuracy = checked;
            })
          }
        />
        <SwitchInput
          label="Show Judgement"
          selector={(state) => state.ui.showJudgement}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showJudgement = checked;

              if (!checked) {
                draft.show300g = false;
                draft.ui.earlyLateThreshold = -1;
              }
            })
          }
        />
        <SwitchInput
          label="Show 300g Judgement"
          selector={(state) => state.show300g}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.show300g = checked;

              if (checked) {
                draft.ui.showJudgement = true;
              }
            })
          }
        />

        <SelectInput
          label="Early/Late Indicator"
          selector={(settings) => settings.ui.earlyLateThreshold.toString()}
          onValueChange={(value: string) =>
            setSettings((draft) => {
              draft.ui.earlyLateThreshold = Number(value) as EarlyLateThreshold;

              if (value !== "none") {
                draft.ui.showJudgement = true;
              }
            })
          }
        >
          {earlyLateThresholdOptions.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectInput>

        <SelectInput
          label="Judgement Counter"
          selector={(state) =>
            state.ui.judgementCounter?.toString() ?? NULL_OPTION
          }
          onValueChange={(
            value: JudgementCounterPosition | typeof NULL_OPTION,
          ) =>
            setSettings((draft) => {
              if (value === NULL_OPTION) {
                draft.ui.judgementCounter = null;
              } else {
                draft.ui.judgementCounter = value;
              }
            })
          }
        >
          {judgementCounterOptions.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id?.toString() ?? NULL_OPTION}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectInput>

        <SwitchInput
          label="Show Progress Bar"
          selector={(state) => state.ui.showProgressBar}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showProgressBar = checked;
            })
          }
        />
        <SwitchInput
          label="Show Health Bar"
          selector={(state) => state.ui.showHealthBar}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.ui.showHealthBar = checked;
            })
          }
        />
        <SwitchInput
          label="Show Error Bar"
          selector={(state) => state.showErrorBar}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.showErrorBar = checked;
            })
          }
        />
        <SliderInput
          label="Error Bar Scale"
          selector={(state) => state.errorBarScale}
          tooltip={(errorBarScale) => `${errorBarScale}x`}
          onValueChange={([errorBarScale]) =>
            setSettings((draft) => {
              draft.errorBarScale = errorBarScale;
            })
          }
          min={0.5}
          max={2}
          step={0.1}
        />
        <SwitchInput
          label="Show FPS Counter"
          selector={(state) => state.showFpsCounter}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.showFpsCounter = checked;
            })
          }
        />
      </div>

      <VolumeSettings className="mt-6" />

      <ReplaySettings className="mt-6" />

      <BeatmapSettings className="mt-6" />

      <BackupSettings className="mt-6" />

      <Separator className="my-8" />

      <ClearHighScoresButton />

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
