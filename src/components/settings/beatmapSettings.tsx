import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { HardDrive, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useBeatmapSetCacheStore } from "../../stores/beatmapSetCacheStore";
import type { BeatmapProvider } from "../../stores/settingsStore";
import {
  BEATMAP_API_PROVIDERS,
  useSettingsStore,
} from "../../stores/settingsStore";
import { useStoredBeatmapSetsStore } from "../../stores/storedBeatmapSetsStore";
import RadioGroupInput from "../inputs/radioGroupInput";
import SwitchInput from "../inputs/switchInput";
import BeatmapSetUpload from "./beatmapSetUpload";

const BeatmapSettings = ({ className }: { className?: string }) => {
  const beatmapProvider = useSettingsStore.use.beatmapProvider();
  const customBeatmapProvider = useSettingsStore.use.customBeatmapProvider();
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
        <RadioGroupInput
          label="Beatmap Provider"
          selector={(state) => state.beatmapProvider}
          onValueChange={(newBeatmapProvider) =>
            setSettings((draft) => {
              draft.beatmapProvider = newBeatmapProvider as BeatmapProvider;
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
              value={customBeatmapProvider}
              onChange={(e) =>
                setSettings((draft) => {
                  draft.customBeatmapProvider = e.target.value;
                })
              }
            />
          </Label>
        </RadioGroupInput>

        {beatmapProvider === "SayoBot" && (
          <p className="mt-1 text-sm text-orange-400">
            There may be parsing errors when downloading maps from SayoBot. If
            this happens, try switching to a different provider.
          </p>
        )}

        {beatmapProvider === "Custom" && (
          <p className="mt-1 text-sm text-orange-400">
            Custom provider URLs should replace the beatmap set ID route segment
            with $setId (e.g. NeriNyan uses
            "https://api.nerinyan.moe/d/$setId").
          </p>
        )}

        <SwitchInput
          label="Proxy Downloads"
          selector={(state) => state.proxyBeatmapDownloads}
          onCheckedChange={async (checked) => {
            setSettings((draft) => {
              draft.proxyBeatmapDownloads = checked;
            });

            if (!checked && idbUsage && idbUsage > 0) {
              await clearIdbCache();
            }
          }}
        />

        <p className="text-muted-foreground mt-4 text-sm">
          If the beatmap providers are blocked on your network, bypass it by
          proxying beatmap downloads through this website's server. ONLY ENABLE
          IF YOU HAVE TO; may result in delayed downloads or rate limiting.
        </p>

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
