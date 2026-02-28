import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { HardDrive, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useBeatmapSetCacheStore } from "../../stores/beatmapSetCacheStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useStoredBeatmapSetsStore } from "../../stores/storedBeatmapSetsStore";
import SwitchInput from "../inputs/switchInput";
import BeatmapSetUpload from "./beatmapSetUpload";

const BeatmapSettings = ({ className }: { className?: string }) => {
  const setSettings = useSettingsStore.use.setSettings();
  const idbUsage = useBeatmapSetCacheStore.use.idbUsage();
  const clearIdbCache = useBeatmapSetCacheStore.use.clearIdbCache();
  const storedBeatmapSets = useStoredBeatmapSetsStore.use.storedBeatmapSets();
  const resetStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.resetStoredBeatmapSets();

  return (
    <div className={cn(className)}>
      <h3 className="mb-2 text-lg font-semibold">Beatmap Management</h3>

      <div className="space-y-4">
        <div className="mt-8 grid grid-cols-2 items-center">
          <div className="text-muted-foreground text-sm font-semibold">
            Upload Beatmap
          </div>

          <BeatmapSetUpload />
        </div>

        <p className="text-muted-foreground mt-4 text-sm">
          If you have beatmap files (.osz format) downloaded already, you can
          load them directly. Click the dashed box or drag a beatmap file into
          it.
        </p>

        <SwitchInput
          label="Enable IndexedDB Cache"
          selector={(state) => state.storeDownloadedBeatmaps}
          onCheckedChange={async (checked) => {
            setSettings((draft) => {
              draft.storeDownloadedBeatmaps = checked;
            });

            if (!checked && idbUsage && idbUsage > 0) {
              await clearIdbCache();
            }
          }}
        />

        <p className="text-muted-foreground mt-1 text-sm">
          By default, downloaded beatmaps are discarded when you leave or
          refresh the page. If you enable caching via IndexedDB, downloaded
          beatmaps will be stored in the browser across visits. View stored
          beatmaps by selecting the <HardDrive className="inline size-5" />{" "}
          Stored category.
        </p>

        <Button
          className={cn("mt-8 w-full", className)}
          size={"sm"}
          onClick={() => {
            clearIdbCache();
            resetStoredBeatmapSets();
            toast("Cache has been cleared.");
          }}
          disabled={!idbUsage}
          variant={"destructive"}
        >
          {idbUsage !== null ? (
            <>
              Clear Cache ({storedBeatmapSets.length} stored,{" "}
              {filesize(idbUsage)})
            </>
          ) : (
            <>
              <Loader2Icon className="animate-spin" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BeatmapSettings;
