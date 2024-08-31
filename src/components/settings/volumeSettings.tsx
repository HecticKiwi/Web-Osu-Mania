"use client";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useSettingsContext } from "../providers/settingsProvider";
import { Switch } from "../ui/switch";

const VolumeSettings = ({
  inWidget,
  showWidget,
  className,
}: {
  inWidget?: boolean;
  showWidget?: () => void;
  className?: string;
}) => {
  const { settings, setSettings } = useSettingsContext();

  if (!settings) {
    return null;
  }

  return (
    <>
      <div className={cn(className)}>
        <h3 className="mb-2 text-lg font-semibold">Volume</h3>
        <div className="space-y-4">
          <div
            className={cn(
              "grid grid-cols-2 items-center",
              inWidget && "grid-cols-3",
            )}
          >
            <div className="text-sm font-semibold text-muted-foreground">
              Master
            </div>

            <div className="col-start-2 -col-end-1 flex items-center gap-4">
              {settings.volume === 0 ? (
                <VolumeX className="shrink-0" />
              ) : settings.volume < 0.33 ? (
                <Volume className="shrink-0" />
              ) : settings.volume < 0.66 ? (
                <Volume1 className="shrink-0" />
              ) : (
                <Volume2 className="shrink-0" />
              )}

              <div className="group w-full">
                <Tooltip open>
                  <TooltipTrigger asChild>
                    <Slider
                      value={[settings.volume]}
                      max={1}
                      step={0.01}
                      onValueChange={([volume]) => {
                        setSettings((draft) => {
                          draft.volume = volume;
                        });

                        showWidget?.();
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                    {(settings.volume * 100).toFixed(0)}%
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "grid grid-cols-2 items-center",
              inWidget && "grid-cols-3",
            )}
          >
            <div className="text-sm font-semibold text-muted-foreground">
              Music
            </div>

            <div className="col-start-2 -col-end-1 flex items-center gap-4">
              {settings.musicVolume === 0 ? (
                <VolumeX className="shrink-0" />
              ) : settings.musicVolume < 0.33 ? (
                <Volume className="shrink-0" />
              ) : settings.musicVolume < 0.66 ? (
                <Volume1 className="shrink-0" />
              ) : (
                <Volume2 className="shrink-0" />
              )}

              <div className="group w-full">
                <Tooltip open>
                  <TooltipTrigger asChild>
                    <Slider
                      value={[settings.musicVolume]}
                      max={1}
                      step={0.01}
                      onValueChange={([musicVolume]) => {
                        setSettings((draft) => {
                          draft.musicVolume = musicVolume;
                        });

                        showWidget?.();
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                    {(settings.musicVolume * 100).toFixed(0)}%
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "grid grid-cols-2 items-center",
              inWidget && "grid-cols-3",
            )}
          >
            <div className="text-sm font-semibold text-muted-foreground">
              SFX
            </div>

            <div className="col-start-2 -col-end-1 flex items-center gap-4">
              {settings.sfxVolume === 0 ? (
                <VolumeX className="shrink-0" />
              ) : settings.sfxVolume < 0.33 ? (
                <Volume className="shrink-0" />
              ) : settings.sfxVolume < 0.66 ? (
                <Volume1 className="shrink-0" />
              ) : (
                <Volume2 className="shrink-0" />
              )}

              <div className="group w-full">
                <Tooltip open>
                  <TooltipTrigger asChild>
                    <Slider
                      value={[settings.sfxVolume]}
                      max={1}
                      step={0.01}
                      onValueChange={([sfxVolume]) => {
                        setSettings((draft) => {
                          draft.sfxVolume = sfxVolume;
                        });

                        showWidget?.();
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                    {(settings.sfxVolume * 100).toFixed(0)}%
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {!inWidget && (
            <>
              <div className="grid grid-cols-2 items-center">
                <div className="text-sm font-semibold text-muted-foreground">
                  Audio Offset
                </div>
                <div className={cn("flex items-center gap-4")}>
                  <div className="group w-full">
                    <Tooltip open>
                      <TooltipTrigger asChild>
                        <Slider
                          value={[settings.audioOffset]}
                          min={-300}
                          max={300}
                          step={1}
                          onValueChange={([audioOffset]) =>
                            setSettings((draft) => {
                              draft.audioOffset = audioOffset;
                            })
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent className="sr-only group-focus-within:not-sr-only group-focus-within:px-3 group-focus-within:py-1.5 group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                        {settings.audioOffset}ms
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

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

              <div className="grid grid-cols-2 items-center">
                <div className="text-sm font-semibold text-muted-foreground">
                  Ignore Beatmap Hitsounds
                </div>

                <Switch
                  checked={settings.ignoreBeatmapHitsounds}
                  onCheckedChange={(checked) =>
                    setSettings((draft) => {
                      draft.ignoreBeatmapHitsounds = checked;
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VolumeSettings;
