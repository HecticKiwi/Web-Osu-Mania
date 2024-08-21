"use client";

import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useContext } from "react";
import { settingsContext } from "../providers/settingsProvider";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import BackgroundDimSlider from "./backgroundDimSlider";
import CacheButton from "./cacheButton";
import IntegerInput from "./integerInput";

const Settings = ({ className }: { className?: string }) => {
  const { settings, resetSettings, updateSettings } =
    useContext(settingsContext);

  if (!settings) {
    return null;
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size={"icon"} variant={"outline"} className={cn(className)}>
            <Settings2 />
          </Button>
        </SheetTrigger>

        <SheetContent
          className="overflow-y-auto p-6 scrollbar sm:max-w-lg"
          aria-describedby={undefined}
          side={"left"}
        >
          <div className="mb-6 flex items-center gap-5">
            <span className="grow border-t border-border"></span>
            <SheetTitle className="text-2xl font-bold text-muted-foreground">
              Settings
            </SheetTitle>
            <span className="grow border-t border-border"></span>
          </div>

          <h3 className="text-lg font-semibold">General</h3>
          <div className="mt-1 space-y-3">
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Background Dim
              </div>

              <BackgroundDimSlider />
            </div>

            <IntegerInput
              label="Scroll Speed"
              value={settings.scrollSpeed}
              setValue={(value) => updateSettings({ scrollSpeed: value })}
              min={1}
              max={40}
            />

            <IntegerInput
              label="Song Speed"
              value={settings.playbackRate}
              setValue={(value) => updateSettings({ playbackRate: value })}
              step={0.05}
              min={0.5}
              max={2}
            />
          </div>

          <h3 className="mt-4 text-lg font-semibold">Display</h3>
          <div className="mt-1 space-y-4">
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Show Error Bar
              </div>

              <Switch
                checked={settings.showErrorBar}
                onCheckedChange={(checked) =>
                  updateSettings({ showErrorBar: checked })
                }
              />
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Show FPS Counter
              </div>

              <Switch
                checked={settings.showFpsCounter}
                onCheckedChange={(checked) =>
                  updateSettings({ showFpsCounter: checked })
                }
              />
            </div>
          </div>

          <h3 className="mt-4 text-lg font-semibold">Volume</h3>
          <div className="mt-1 space-y-4">
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Master
              </div>

              <div className={cn("flex items-center gap-4")}>
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
                        onValueChange={([volume]) => updateSettings({ volume })}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                      {(settings.volume * 100).toFixed(0)}%
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Music
              </div>

              <div className={cn("flex items-center gap-4")}>
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
                        onValueChange={([musicVolume]) =>
                          updateSettings({ musicVolume })
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                      {(settings.musicVolume * 100).toFixed(0)}%
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                SFX
              </div>

              <div className={cn("flex items-center gap-4")}>
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
                        onValueChange={([sfxVolume]) =>
                          updateSettings({ sfxVolume })
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className="sr-only group-hover:not-sr-only group-hover:px-3 group-hover:py-1.5">
                      {(settings.sfxVolume * 100).toFixed(0)}%
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
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
                          updateSettings({ audioOffset })
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
              >
                latency tester
              </Link>{" "}
              to determine your offset.
            </p>
          </div>

          <h3 className="mt-4 text-lg font-semibold">Skin</h3>
          <div className="mt-1 space-y-4">
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Show 300g Judgement
              </div>

              <Switch
                checked={settings.show300g}
                onCheckedChange={(checked) =>
                  updateSettings({ show300g: checked })
                }
              />
            </div>
          </div>

          <h3 className="mt-4 text-lg font-semibold">Beatmap Cache</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            To improve loading times and reduce strain on the{" "}
            <Link
              href={"https://nerinyan.moe/"}
              className="text-primary hover:underline focus:underline"
              target="_blank"
            >
              NeriNyan beatmap API
            </Link>
            , beatmaps are cached in your browser.
          </p>

          <CacheButton />

          <Button
            className="mt-8 w-full"
            variant={"destructive"}
            size={"sm"}
            onClick={() => resetSettings()}
          >
            Reset to Defaults
          </Button>

          <div className="mb-6 mt-12 flex items-center gap-5">
            <span className="grow border-t border-border"></span>
            <h2 className="text-2xl font-bold text-muted-foreground">Mods</h2>
            <span className="grow border-t border-border"></span>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Autoplay
              </div>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) =>
                  updateSettings({ autoplay: checked })
                }
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Settings;
