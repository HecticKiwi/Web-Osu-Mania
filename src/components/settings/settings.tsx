"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Settings2 } from "lucide-react";
import { useContext } from "react";
import { settingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import SliderInput from "./volumeSlider";
import BackgroundDimSlider from "./backgroundDimSlider";
import IntegerInput from "./integerInput";
import { cn } from "@/lib/utils";

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

        <SheetContent className="p-4">
          <div className="mb-6 flex items-center gap-5">
            <span className="grow border-t border-border"></span>
            <h2 className="text-2xl font-bold text-muted-foreground">
              Settings
            </h2>
            <span className="grow border-t border-border"></span>
          </div>

          <h3 className="text-lg font-semibold">General</h3>
          <div className="space-y-3">
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

          <h3 className="mt-4 text-lg font-semibold">Volume</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 items-center">
              <div className="text-sm font-semibold text-muted-foreground">
                Master
              </div>

              <SliderInput />
            </div>
          </div>

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
