"use client";

import { cn } from "@/lib/utils";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useSettingsStore } from "../../stores/settingsStore";
import SliderInput from "../inputs/sliderInput";
import SwitchInput from "../inputs/switchInput";

const VolumeSettings = ({
  inWidget,
  className,
}: {
  inWidget?: boolean;
  className?: string;
}) => {
  const setSettings = useSettingsStore.use.setSettings();

  return (
    <>
      <div className={cn(className)}>
        <h3 className="mb-2 text-lg font-semibold">Volume</h3>
        <div className="space-y-4">
          <SliderInput
            label="Master"
            selector={(state) => state.volume}
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
          />

          <SliderInput
            label="Music"
            selector={(state) => state.musicVolume}
            graphic={(musicVolume) =>
              musicVolume === 0 ? (
                <VolumeX className="shrink-0" />
              ) : musicVolume < 0.33 ? (
                <Volume className="shrink-0" />
              ) : musicVolume < 0.66 ? (
                <Volume1 className="shrink-0" />
              ) : (
                <Volume2 className="shrink-0" />
              )
            }
            tooltip={(musicVolume) => `${(musicVolume * 100).toFixed(0)}%`}
            onValueChange={([musicVolume]) =>
              setSettings((draft) => {
                draft.musicVolume = musicVolume;
              })
            }
            min={0}
            max={1}
            step={0.01}
            inWidget={inWidget}
          />

          <SliderInput
            label="SFX"
            selector={(state) => state.sfxVolume}
            graphic={(sfxVolume) =>
              sfxVolume === 0 ? (
                <VolumeX className="shrink-0" />
              ) : sfxVolume < 0.33 ? (
                <Volume className="shrink-0" />
              ) : sfxVolume < 0.66 ? (
                <Volume1 className="shrink-0" />
              ) : (
                <Volume2 className="shrink-0" />
              )
            }
            tooltip={(sfxVolume) => `${(sfxVolume * 100).toFixed(0)}%`}
            onValueChange={([sfxVolume]) =>
              setSettings((draft) => {
                draft.sfxVolume = sfxVolume;
              })
            }
            min={0}
            max={1}
            step={0.01}
            inWidget={inWidget}
          />

          {!inWidget && (
            <>
              <SliderInput
                label="Audio Offset"
                selector={(state) => state.audioOffset}
                tooltip={(audioOffset) => `${audioOffset}ms`}
                onValueChange={([audioOffset]) =>
                  setSettings((draft) => {
                    draft.audioOffset = audioOffset;
                  })
                }
                min={-300}
                max={300}
                step={1}
              />

              <p className="text-sm text-muted-foreground">
                If using an audio offset, it is highly recommended that you mute
                the SFX. Use a{" "}
                <Link
                  href={"https://nullvoxpopuli.github.io/latency-tester/"}
                  className="text-primary hover:underline focus:underline"
                  target="_blank"
                  prefetch={false}
                >
                  latency tester
                </Link>{" "}
                to determine your offset.
              </p>

              <SwitchInput
                label="Ignore Beatmap Hitsounds"
                selector={(state) => state.ignoreBeatmapHitsounds}
                onCheckedChange={(checked) =>
                  setSettings((draft) => {
                    draft.ignoreBeatmapHitsounds = checked;
                  })
                }
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VolumeSettings;
