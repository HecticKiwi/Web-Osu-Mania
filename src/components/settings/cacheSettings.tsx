"use client";

import { Idb } from "@/lib/idb";
import { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { Loader2Icon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { settingsContext } from "../providers/settingsProvider";
import BeatmapSetCacheProvider, {
  BeatmapSetCacheContext,
} from "../providers/beatmapSetCacheProvider";

const CacheSettings = ({ className }: { className?: string }) => {
  const { settings, updateSettings } = useContext(settingsContext);
  const { idbUsage, clearIdbCache } = useContext(BeatmapSetCacheContext);

  return (
    <div>
      <div className="mt-4 grid grid-cols-2 items-center">
        <div className="text-sm font-semibold text-muted-foreground">
          Enable cache
        </div>

        <Switch
          checked={settings.storeDownloadedBeatmaps}
          onCheckedChange={async (checked) => {
            updateSettings({ storeDownloadedBeatmaps: checked });
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

export default CacheSettings;
