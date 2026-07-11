import SliderInput from "@/components/inputs/sliderInput";
import SwitchInput from "@/components/inputs/switchInput";
import { MAX_TIME_RANGE } from "@/osuMania/constants";
import { useSettingsStore } from "@/stores/settingsStore";
import { PersonStanding } from "lucide-react";
import FilterableList from "../filterableList";
import UnpauseDelayWarning from "./unpauseDelayWarning";

const GameplaySettings = ({ searchQuery }: { searchQuery?: string }) => {
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <FilterableList
      title="Gameplay"
      items={[
        {
          label: "Background Dim",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="backgroundDim"
              graphic={(backgroundDim) => (
                <div className="relative">
                  <div
                    className="bg-primary absolute inset-0 rounded-full"
                    style={{ opacity: backgroundDim }}
                  ></div>
                  <PersonStanding />
                </div>
              )}
              tooltip={(backgroundDim) =>
                `${(backgroundDim * 100).toFixed(0)}%`
              }
              onValueChange={([backgroundDim]) =>
                setSettings((draft) => {
                  draft.backgroundDim = backgroundDim;
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          ),
        },
        {
          label: "Background Blur",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="backgroundBlur"
              graphic={(backgroundBlur) => (
                <div>
                  <PersonStanding
                    style={{ filter: `blur(${backgroundBlur * 4}px)` }}
                  />
                </div>
              )}
              tooltip={(backgroundBlur) =>
                `${(backgroundBlur * 100).toFixed(0)}%`
              }
              onValueChange={([backgroundBlur]) =>
                setSettings((draft) => {
                  draft.backgroundBlur = backgroundBlur;
                })
              }
              min={0}
              max={1}
              step={0.01}
            />
          ),
        },
        {
          label: "Background Video",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="backgroundVideo.enabled"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.backgroundVideo.enabled = checked;
                })
              }
              description="Currently, only MP4 background videos are supported."
            />
          ),
        },
        {
          label: "Scroll Speed",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="scrollSpeed"
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
              step={0.1}
            />
          ),
        },
        {
          label: "Break Minimum Duration",
          render: ({ label }) => (
            <SliderInput
              label={label}
              settingPath="breakMinDuration"
              tooltip={(breakMinDuration) => `${breakMinDuration / 1000}s`}
              onValueChange={([breakMinDuration]) =>
                setSettings((draft) => {
                  draft.breakMinDuration = breakMinDuration;
                })
              }
              min={3000}
              max={10000}
              step={100}
            />
          ),
        },
        {
          label: "Unpause Delay",
          render: ({ label }) => (
            <>
              <SliderInput
                label={label}
                settingPath="unpauseDelay"
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
            </>
          ),
        },
        {
          label: "Retry on Fail",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="retryOnFail"
              onCheckedChange={(checked) =>
                setSettings((draft) => {
                  draft.retryOnFail = checked;
                })
              }
            />
          ),
        },
        {
          label: "Performance Mode",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="performanceMode"
              onCheckedChange={(checked) => {
                setSettings((draft) => {
                  draft.performanceMode = checked;
                });
              }}
              description="Enable performance mode if you are experiencing low FPS. This will disable animations and hitsounds."
            />
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default GameplaySettings;
