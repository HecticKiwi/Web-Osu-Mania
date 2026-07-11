import SelectInput, { NULL_OPTION } from "@/components/inputs/selectInput";
import SliderInput from "@/components/inputs/sliderInput";
import SwitchInput from "@/components/inputs/switchInput";
import { SelectItem } from "@/components/ui/select";
import type {
  EarlyLateThreshold,
  JudgementCounterPosition,
  ProgressDisplay,
} from "@/stores/settingsStore";
import {
  earlyLateThresholdOptions,
  judgementCounterOptions,
  progressDisplayOptions,
  useSettingsStore,
} from "@/stores/settingsStore";
import FilterableList from "../filterableList";

const DisplaySettings = ({ searchQuery }: { searchQuery?: string }) => {
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <FilterableList
      title="Display"
      items={[
        {
          label: "Stage Position",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="stagePosition"
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
          ),
        },
        {
          label: "Stage Opacity",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="stageOpacity"
              tooltip={(stageOpacity) => {
                return `${Math.round(stageOpacity * 100)}%`;
              }}
              onValueChange={([stageOpacity]) =>
                setSettings((draft) => {
                  draft.stageOpacity = stageOpacity;
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          ),
        },
        {
          label: "Stage Sides Opacity",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="stageSidesOpacity"
              tooltip={(stageSidesOpacity) => {
                return `${Math.round(stageSidesOpacity * 100)}%`;
              }}
              onValueChange={([stageSidesOpacity]) =>
                setSettings((draft) => {
                  draft.stageSidesOpacity = stageSidesOpacity;
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          ),
        },
        {
          label: "Stage HUD Vertical Position",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="ui.stageHudYPosition"
              tooltip={(stageHudYPosition) =>
                `${Math.round(stageHudYPosition * 100)}%`
              }
              onValueChange={([stageHudYPosition]) =>
                setSettings((draft) => {
                  draft.ui.stageHudYPosition = stageHudYPosition;
                })
              }
              min={0.3}
              max={0.9}
              step={0.01}
              description="The Stage HUD includes the judgement indicator and combo counter."
            />
          ),
        },
        {
          label: "Hit Position",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="hitPositionOffset"
              tooltip={(hitPositionOffset) => `${hitPositionOffset}px`}
              onValueChange={([hitPositionOffset]) =>
                setSettings((draft) => {
                  draft.hitPositionOffset = hitPositionOffset;
                })
              }
              min={0}
              max={200}
              step={1}
              description="Affects the vertical position of the note receptors."
            />
          ),
        },
        {
          label: "Note Offset",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="noteOffset"
              tooltip={(noteOffset) => `${noteOffset}px`}
              onValueChange={([noteOffset]) =>
                setSettings((draft) => {
                  draft.noteOffset = noteOffset;
                })
              }
              min={-100}
              max={100}
              step={1}
              description="Affects when notes should visually be hit relative to the note receptors."
            />
          ),
        },
        {
          label: "Note Scale",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="noteScale"
              tooltip={(receptorScale) => `${Math.round(receptorScale * 100)}%`}
              onValueChange={([receptorScale]) =>
                setSettings((draft) => {
                  draft.noteScale = receptorScale;
                })
              }
              min={0.5}
              max={1}
              step={0.01}
              description="Note Scale is ignored when using the Bars Note Style."
            />
          ),
        },
        {
          label: "Lane Width Adjustment",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="laneWidthAdjustment"
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
          ),
        },
        {
          label: "Lane Spacing",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="laneSpacing"
              tooltip={(laneSpacing) => `${Math.round(laneSpacing)}px`}
              onValueChange={([laneSpacing]) =>
                setSettings((draft) => {
                  draft.laneSpacing = laneSpacing;
                })
              }
              min={0}
              max={50}
              step={1}
            />
          ),
        },
        {
          label: "Receptor Opacity",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="ui.receptorOpacity"
              tooltip={(receptorOpacity) =>
                `${Math.round(receptorOpacity * 100)}%`
              }
              onValueChange={([receptorOpacity]) =>
                setSettings((draft) => {
                  draft.ui.receptorOpacity = receptorOpacity;
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          ),
        },
        {
          label: "Receptor Lighting",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="ui.receptorLighting"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.ui.receptorLighting = checked;
                })
              }
            />
          ),
        },
        {
          label: "Upscroll (DDR Style)",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="upscroll"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.upscroll = checked;
                })
              }
            />
          ),
        },
        {
          label: "Show Score",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="ui.showScore"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.ui.showScore = checked;
                })
              }
            />
          ),
        },
        {
          label: "Show Combo",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="ui.showCombo"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.ui.showCombo = checked;
                })
              }
            />
          ),
        },
        {
          label: "Show Accuracy",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="ui.showAccuracy"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.ui.showAccuracy = checked;
                })
              }
            />
          ),
        },
        {
          label: "Show Judgement",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="ui.showJudgement"
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
          ),
        },
        {
          label: "Show 300g Judgement",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="show300g"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.show300g = checked;

                  if (checked) {
                    draft.ui.showJudgement = true;
                  }
                })
              }
            />
          ),
        },
        {
          label: "Early/Late Indicator",
          searchTags: earlyLateThresholdOptions.map((o) => o.label),
          render: ({ label }) => (
            <SelectInput
              label={label}
              settingPath="ui.earlyLateThreshold"
              onValueChange={(value: string) =>
                setSettings((draft) => {
                  draft.ui.earlyLateThreshold = Number(
                    value,
                  ) as EarlyLateThreshold;

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
          ),
        },
        {
          label: "Judgement Counter",
          searchTags: judgementCounterOptions.map((o) => o.label),
          render: ({ label }) => (
            <SelectInput
              label={label}
              settingPath="ui.judgementCounter"
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
          ),
        },
        {
          label: "Progress Display",
          searchTags: progressDisplayOptions.map((o) => o.label),
          render: ({ label }) => (
            <SelectInput
              label={label}
              settingPath="ui.progressDisplay"
              onValueChange={(value: ProgressDisplay | typeof NULL_OPTION) =>
                setSettings((draft) => {
                  if (value === NULL_OPTION) {
                    draft.ui.progressDisplay = null;
                  } else {
                    draft.ui.progressDisplay = value;
                  }
                })
              }
            >
              {progressDisplayOptions.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.id?.toString() ?? NULL_OPTION}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectInput>
          ),
        },
        {
          label: "Show Health Bar",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="ui.showHealthBar"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.ui.showHealthBar = checked;
                })
              }
            />
          ),
        },
        {
          label: "Show Error Bar",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="showErrorBar"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.showErrorBar = checked;
                })
              }
            />
          ),
        },
        {
          label: "Error Bar Scale",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="errorBarScale"
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
          ),
        },
        {
          label: "Show FPS Counter",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="showFpsCounter"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.showFpsCounter = checked;
                })
              }
            />
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default DisplaySettings;
