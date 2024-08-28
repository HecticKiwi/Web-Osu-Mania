"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  BEATMAP_API_PROVIDERS,
  BeatmapProvider,
  useSettingsContext,
} from "../providers/settingsProvider";
import { Switch } from "../ui/switch";

import { filesize } from "filesize";
import { Loader2Icon } from "lucide-react";
import { useBeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";

const BeatmapSettings = ({ className }: { className?: string }) => {
  const { settings, setSettings } = useSettingsContext();
  const { idbUsage, clearIdbCache } = useBeatmapSetCacheContext();

  // If the browser doesn't support IDB, don't show
  if (!("indexedDB" in window) || !navigator.storage) {
    return null;
  }

  return (
    <div>
      <h3 className="mt-4 text-lg font-semibold">Beatmap Management</h3>

      <div className="mt-2 space-y-4">
        <div className="grid grid-cols-2">
          <Label
            htmlFor="beatmapProvider"
            className="text-sm font-semibold text-muted-foreground"
          >
            Beatmap Provider
          </Label>

          <RadioGroup
            id="beatmapProvider"
            value={settings.beatmapProvider}
            onValueChange={(value: BeatmapProvider) =>
              setSettings((draft) => {
                draft.beatmapProvider = value;
              })
            }
            className="space-y-2"
          >
            {Object.entries(BEATMAP_API_PROVIDERS).map(([name, url]) => (
              <Label
                key={name}
                htmlFor={name}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem value={name} id={name} />
                <span>{name}</span>
              </Label>
            ))}
            <Label htmlFor="r3" className="flex items-center space-x-2">
              <RadioGroupItem value="Custom" id="Custom" className="shrink-0" />

              <Input
                onClick={() =>
                  setSettings((draft) => {
                    draft.beatmapProvider = "Custom";
                  })
                }
                placeholder="Custom URL"
                value={settings.customBeatmapProvider}
                onChange={(e) =>
                  setSettings((draft) => {
                    draft.customBeatmapProvider = e.target.value;
                  })
                }
              />
            </Label>
          </RadioGroup>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Custom provider URLs should replace the beatmap set ID route segment
          with $setId (e.g. NeriNyan uses "https://api.nerinyan.moe/d/$setId").
        </p>

        <div className="mt-4 grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Enable IndexedDB cache
          </div>

          <Switch
            checked={settings.storeDownloadedBeatmaps}
            onCheckedChange={async (checked) => {
              setSettings((draft) => {
                draft.storeDownloadedBeatmaps = checked;
              });

              if (!checked && idbUsage && idbUsage > 0) {
                await clearIdbCache();
              }
            }}
          />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          By default, downloaded beatmaps are discarded when you leave or
          refresh the page. If you enable caching via IndexedDB, downloaded
          beatmaps will be saved across visits.
        </p>
      </div>

      <Button
        className={cn("mt-8 w-full", className)}
        size={"sm"}
        onClick={() => clearIdbCache()}
        disabled={!idbUsage}
      >
        {idbUsage !== null ? (
          <>Clear Cache ({filesize(idbUsage)})</>
        ) : (
          <>
            <Loader2Icon className="animate-spin" />
          </>
        )}
      </Button>
    </div>
  );
};

export default BeatmapSettings;
