"use client";

import { Button } from "@/components/ui/button";
import { MAX_TIME_RANGE } from "@/osuMania/constants";
import { PersonStanding } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore } from "../../stores/settingsStore";
import SliderInput from "../inputs/sliderInput";
import SwitchInput from "../inputs/switchInput";
import BeatmapSettings from "./beatmapSettings";
import ClearHighScoresButton from "./clearHighScoresButton";
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
            setSettings((draft: { hue: number; }) => {
              draft.hue = hue;
            })
          }
          min={0}
          max={360}
          step={1}
        />
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
            setSettings((draft: { backgroundDim: number; }) => {
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
            setSettings((draft: { backgroundBlur: number; }) => {
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
            setSettings((draft: { scrollSpeed: number; }) => {
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
            setSettings((draft: { unpauseDelay: number; }) => {
              draft.unpauseDelay = unpauseDelay;
            })
          }
          min={0}
          max={3000}
          step={100}
        />

        <UnpauseDelayWarning />

        <SliderInput
          label="Lane Width"
          selector={(state) => state.lanewidth}
          tooltip={(lanewidth) =>
            `${Math.round(lanewidth)}px`
          }
          onValueChange={([lanewidth]) =>
            setSettings((draft: { lanewidth: number; }) => {
              draft.lanewidth = lanewidth;
            })
          }
          min={-20}
          max={80}
          step={1}
        />

        <SwitchInput
          label="Retry on Fail"
          selector={(state) => state.retryOnFail}
          onCheckedChange={(checked) =>
            setSettings((draft: { retryOnFail: boolean; }) => {
              draft.retryOnFail = checked;
            })
          }
        />

        <SwitchInput
          label="Performance Mode"
          selector={(state) => state.performanceMode}
          onCheckedChange={(checked) => {
            setSettings((draft: { performanceMode: boolean; }) => {
              draft.performanceMode = checked;
            });
          }}
        />

        <p className="text-sm text-muted-foreground">
          Enable performance mode if you are experiencing low FPS. This will
          disable animations and hitsounds.
        </p>
      </div>

      <h3 className="mt-6 text-lg font-semibold">Language</h3>
      <div className="mt-2 space-y-3">
        <SwitchInput
          label="Prefer Metadata in Original Language"
          selector={(state) => state.preferMetadataInOriginalLanguage}
          onCheckedChange={(checked) =>
            setSettings((draft: { preferMetadataInOriginalLanguage: boolean; }) => {
              draft.preferMetadataInOriginalLanguage = checked;
            })
          }
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

            return `${Math.round(stagePosition * 100)}% ${stagePosition < 0 ? "Left" : "Right"}`;
          }}
          onValueChange={([stagePosition]) =>
            setSettings((draft: { stagePosition: number; }) => {
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
          tooltip={(hitPositionOffset) => hitPositionOffset}
          onValueChange={([hitPositionOffset]) =>
            setSettings((draft: { hitPositionOffset: number; }) => {
              draft.hitPositionOffset = hitPositionOffset;
            })
          }
          min={0}
          max={200}
          step={1}
        />
        <SwitchInput
          label="Upscroll (DDR Style)"
          selector={(state) => state.upscroll}
          onCheckedChange={(checked) =>
            setSettings((draft: { upscroll: boolean; }) => {
              draft.upscroll = checked;
            })
          }
        />
        <SwitchInput
          label="Show Score"
          selector={(state) => state.ui.showScore}
          onCheckedChange={(checked) =>
            setSettings((draft: { ui: { showScore: boolean; }; }) => {
              draft.ui.showScore = checked;
            })
          }
        />
        <SwitchInput
          label="Show Combo"
          selector={(state) => state.ui.showCombo}
          onCheckedChange={(checked) =>
            setSettings((draft: { ui: { showCombo: boolean; }; }) => {
              draft.ui.showCombo = checked;
            })
          }
        />
        <SwitchInput
          label="Show Accuracy"
          selector={(state) => state.ui.showAccuracy}
          onCheckedChange={(checked) =>
            setSettings((draft: { ui: { showAccuracy: boolean; }; }) => {
              draft.ui.showAccuracy = checked;
            })
          }
        />
        <SwitchInput
          label="Show Judgement"
          selector={(state) => state.ui.showJudgement}
          onCheckedChange={(checked) =>
            setSettings((draft: { ui: { showJudgement: boolean; }; show300g: boolean; }) => {
              draft.ui.showJudgement = checked;

              if (!checked) {
                draft.show300g = false;
              }
            })
          }
        />
        <SwitchInput
          label="Show 300g Judgement"
          selector={(state) => state.show300g}
          onCheckedChange={(checked) =>
            setSettings((draft: { show300g: boolean; ui: { showJudgement: boolean; }; }) => {
              draft.show300g = checked;

              if (checked) {
                draft.ui.showJudgement = true;
              }
            })
          }
        />
        <SwitchInput
          label="Show Progress Bar"
          selector={(state) => state.ui.showProgressBar}
          onCheckedChange={(checked) =>
            setSettings((draft: { ui: { showProgressBar: boolean; }; }) => {
              draft.ui.showProgressBar = checked;
            })
          }
        />
        <SwitchInput
          label="Show Health Bar"
          selector={(state) => state.ui.showHealthBar}
          onCheckedChange={(checked) =>
            setSettings((draft: { ui: { showHealthBar: boolean; }; }) => {
              draft.ui.showHealthBar = checked;
            })
          }
        />
        <SwitchInput
          label="Show Error Bar"
          selector={(state) => state.showErrorBar}
          onCheckedChange={(checked) =>
            setSettings((draft: { showErrorBar: boolean; }) => {
              draft.showErrorBar = checked;
            })
          }
        />
        <SliderInput
          label="Error Bar Scale"
          selector={(state) => state.errorBarScale}
          tooltip={(errorBarScale) => `${errorBarScale}x`}
          onValueChange={([errorBarScale]) =>
            setSettings((draft: { errorBarScale: number; }) => {
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
            setSettings((draft: { showFpsCounter: boolean; }) => {
              draft.showFpsCounter = checked;
            })
          }
        />
      </div>

      <VolumeSettings className="mt-6" />

      <ReplaySettings className="mt-6" />

      <BeatmapSettings className="mt-6" />

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
