"use client";

import { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { Loader2Icon } from "lucide-react";
import { useBeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

const IdbCacheSettings = ({ className }: { className?: string }) => {
  const { settings, setSettings } = useSettingsContext();
  const { idbUsage, clearIdbCache } = useBeatmapSetCacheContext();

  // If the browser doesn't support IDB, don't show
  if (!("indexedDB" in window)) {
    return null;
  }

  return (
    <div>
      <h3 className="mt-4 text-lg font-semibold">IndexedDB Beatmap Cache</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        By default, downloaded beatmaps are discarded when you leave or refresh
        the page. If you enable caching via IndexedDB, downloaded beatmaps will
        be saved across visits.
      </p>

      <div className="mt-4 grid grid-cols-2 items-center">
        <div className="text-sm font-semibold text-muted-foreground">
          Enable cache
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

export default IdbCacheSettings;
