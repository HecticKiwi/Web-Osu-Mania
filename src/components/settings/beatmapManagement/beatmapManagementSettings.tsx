import SwitchInput from "@/components/inputs/switchInput";
import { useBeatmapSetCacheStore } from "@/stores/beatmapSetCacheStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { HardDrive } from "lucide-react";
import FilterableList from "../filterableList";
import BeatmapSetUpload from "./beatmapSetUpload";
import ClearCacheButton from "./clearCacheButton";

const BeatmapManagementSettings = ({
  className,
  searchQuery,
}: {
  className?: string;
  searchQuery?: string;
}) => {
  const setSettings = useSettingsStore.use.setSettings();
  const idbUsage = useBeatmapSetCacheStore.use.idbUsage();
  const clearIdbCache = useBeatmapSetCacheStore.use.clearIdbCache();

  return (
    <FilterableList
      className={className}
      title="Beatmap Management"
      items={[
        {
          label: "Upload Beatmap",
          render: () => (
            <>
              <div className="grid grid-cols-2 items-center">
                <div className="text-muted-foreground text-sm font-semibold">
                  Upload Beatmap
                </div>

                <BeatmapSetUpload />
              </div>

              <p className="text-muted-foreground mt-4 text-sm">
                If you have beatmap files (.osz format) downloaded already, you
                can load them directly. Click the dashed box or drag a beatmap
                file into it.
              </p>
            </>
          ),
        },
        {
          label: "Enable IndexedDB Cache",
          render: ({ label }) => (
            <SwitchInput
              label={label}
              settingPath="storeDownloadedBeatmaps"
              onCheckedChange={async (checked) => {
                setSettings((draft) => {
                  draft.storeDownloadedBeatmaps = checked;
                });

                if (!checked && idbUsage && idbUsage > 0) {
                  await clearIdbCache();
                }
              }}
              description={
                <span>
                  By default, downloaded beatmaps are discarded when you leave
                  or refresh the page. If you enable caching via IndexedDB,
                  downloaded beatmaps will be stored in the browser across
                  visits. View stored beatmaps by selecting the{" "}
                  <HardDrive className="inline size-5" /> Stored category.
                </span>
              }
            />
          ),
        },
        {
          label: "Clear Cache",
          render: ({ label }) => (
            <ClearCacheButton searchQuery={searchQuery} className="mt-4 w-full">
              {label}
            </ClearCacheButton>
          ),
        },
      ]}
      searchQuery={searchQuery}
    />
  );
};

export default BeatmapManagementSettings;
