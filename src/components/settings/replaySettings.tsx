"use client";

import { cn } from "@/lib/utils";
import ReplayUpload from "../replayUpload";
import { useBeatmapSetCacheContext } from "../providers/beatmapSetCacheProvider";
import {
  BEATMAP_API_PROVIDERS,
  BeatmapProvider,
  useSettingsContext,
} from "../providers/settingsProvider";
import SwitchInput from "../switchInput";

const BeatmapSettings = ({ className }: { className?: string }) => {
  const { settings, setSettings } = useSettingsContext();

  return (
    <div className={cn(className)}>
      <h3 className="mb-2 text-lg font-semibold">Beatmap Management</h3>

      <div className="space-y-4">
        <SwitchInput
          label="Record Replays"
          checked={settings.replays}
          onCheckedChange={(checked) =>
            setSettings((draft) => {
              draft.replays = checked;
            })
          }
        />

        <div className="mt-8 grid grid-cols-2 items-center">
          <div className="text-sm font-semibold text-muted-foreground">
            Upload Replay
          </div>

          <ReplayUpload />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          If you have replay files (.womr format) downloaded already, you can
          view them here. Click the dashed box or drag a replay file into
          it.
        </p>
      </div>
    </div>
  );
};

export default BeatmapSettings;
