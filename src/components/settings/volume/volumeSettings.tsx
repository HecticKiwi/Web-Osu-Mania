import SliderInput from "@/components/inputs/sliderInput";
import SwitchInput from "@/components/inputs/switchInput";
import TextLink from "@/components/textLink";
import { useSettingsStore } from "@/stores/settingsStore";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import FilterableList from "../filterableList";

type VolumeSettingConfig = {
  label: string;
  settingPath: "volume" | "musicVolume" | "sfxVolume";
};

const VOLUME_SETTING_CONFIGS: VolumeSettingConfig[] = [
  { label: "Volume", settingPath: "volume" },
  { label: "Music", settingPath: "musicVolume" },
  { label: "SFX", settingPath: "sfxVolume" },
] as const;

const VolumeSettings = ({
  inWidget,
  className,
  searchQuery,
}: {
  inWidget?: boolean;
  className?: string;
  searchQuery?: string;
}) => {
  const setSettings = useSettingsStore.use.setSettings();

  const outputLatency = Howler.ctx.outputLatency ?? null;

  return (
    <FilterableList
      className={className}
      title="Volume"
      items={[
        ...VOLUME_SETTING_CONFIGS.map((config) => ({
          label: config.label,
          render: ({ label }: { label: string }) => (
            <SliderInput
              label={label}
              settingPath={config.settingPath}
              graphic={(volume) =>
                volume === 0 ? (
                  <VolumeX className="shrink-0" />
                ) : volume < 0.33 ? (
                  <Volume className="shrink-0" />
                ) : volume < 0.66 ? (
                  <Volume1 className="shrink-0" />
                ) : (
                  <Volume2 className="shrink-0" />
                )
              }
              tooltip={(volume) => `${(volume * 100).toFixed(0)}%`}
              onValueChange={([volume]) =>
                setSettings((draft) => {
                  draft.volume = volume;
                })
              }
              min={0}
              max={1}
              step={0.01}
              inWidget={inWidget}
              hideReset={inWidget}
            />
          ),
        })),
        {
          label: "Audio Offset",
          render: ({ label }) => {
            if (inWidget) {
              return null;
            }

            return (
              <SliderInput
                label={label}
                settingPath="audioOffset"
                tooltip={(audioOffset) => `${audioOffset}ms`}
                onValueChange={([audioOffset]) =>
                  setSettings((draft) => {
                    draft.audioOffset = audioOffset;
                  })
                }
                min={-300}
                max={300}
                step={1}
                description={
                  <span>
                    {outputLatency != null &&
                      `Note that the site already adjusts for your browser's reported system audio latency of ${outputLatency * 1000}ms. `}
                    If using an audio offset, it is highly recommended that you
                    mute the SFX. Use a{" "}
                    <TextLink
                      to={"https://nullvoxpopuli.github.io/latency-tester/"}
                      target="_blank"
                    >
                      latency tester
                    </TextLink>{" "}
                    to determine your offset.
                  </span>
                }
              />
            );
          },
        },
        {
          label: "Ignore Beatmap Hitsounds",
          render: ({ label }) => {
            if (inWidget) {
              return null;
            }

            return (
              <SwitchInput
                label={label}
                settingPath="ignoreBeatmapHitsounds"
                onCheckedChange={(checked) =>
                  setSettings((draft) => {
                    draft.ignoreBeatmapHitsounds = checked;
                  })
                }
              />
            );
          },
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default VolumeSettings;
