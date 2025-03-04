"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import BeatmapSetUpload from "../beatmapSetUpload";
import { useBeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";
import {
  BEATMAP_API_PROVIDERS,
  BeatmapProvider,
  useSettingsContext,
} from "../providers/settingsProvider";
import SwitchInput from "../switchInput";

const BeatmapSettings = ({ className }: { className?: string }) => {
  const { settings, setSettings } = useSettingsContext();
  const { idbUsage, clearIdbCache } = useBeatmapSetCacheContext();

  return (
    <div className={cn(className)}>
      <h3 className="mb-2 text-lg font-semibold">Beatmap Management</h3>

      <div className="space-y-4">
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

        {settings.beatmapProvider === "SayoBot" && (
          <p className="mt-1 text-sm text-orange-400">
            There may be parsing errors when downloading maps from SayoBot. If
            this happens, try switching to a different provider.
          </p>
        )}

        {settings.beatmapProvider === "Custom" && (
          <p className="mt-1 text-sm text-orange-400">
            Custom provider URLs should replace the beatmap set ID route segment
            with $setId (e.g. NeriNyan uses
            "https://api.nerinyan.moe/d/$setId").
          </p>
        )}

        <SwitchInput
          label="Proxy Downloads"
          checked={settings.proxyBeatmapDownloads}
          onCheckedChange={async (checked) => {
            setSettings((draft) => {
              draft.proxyBeatmapDownloads = checked;
            });

            if (!checked && idbUsage && idbUsage > 0) {
              await clearIdbCache();
            }
          }}
        />

        <p className="mt-4 text-sm text-muted-foreground">
          If the beatmap providers are blocked on your network, bypass it by
          proxying beatmap downloads through this website's server. ONLY ENABLE
          IF YOU HAVE TO; may result in delayed downloads or rate limiting.
        </p>

        <div className="mt-8 grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Upload Beatmap
          </div>

          <BeatmapSetUpload />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          If you have beatmap files (.osz format) downloaded already, you can
          load them directly. Click the dashed box or drag a beatmap file into
          it.
        </p>

        {"indexedDB" in window && navigator.storage && (
          <>
            <SwitchInput
              label="Enable IndexedDB Cache"
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

            <p className="mt-1 text-sm text-muted-foreground">
              By default, downloaded beatmaps are discarded when you leave or
              refresh the page. If you enable caching via IndexedDB, downloaded
              beatmaps will be saved in the browser across visits.
            </p>

            <Button
              className={cn("mt-8 w-full", className)}
              size={"sm"}
              onClick={() => {
                clearIdbCache();
                toast("Cache has been cleared.");
              }}
              disabled={!idbUsage}
              variant={"destructive"}
            >
              {idbUsage !== null ? (
                <>Clear Cache ({filesize(idbUsage)})</>
              ) : (
                <>
                  <Loader2Icon className="animate-spin" />
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BeatmapSettings;
