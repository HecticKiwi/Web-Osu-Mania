import { InfoIcon } from "lucide-react";
import { useStoredBeatmapSetsStore } from "../../stores/storedBeatmapSetsStore";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import CustomBeatmapSets from "./customBeatmapSets";

const StoredBeatmapSets = ({ className }: { className?: string }) => {
  const storedBeatmapSets = useStoredBeatmapSetsStore.use.storedBeatmapSets();

  return (
    <>
      <Alert className="bg-card">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Showing Your Stored Beatmaps</AlertTitle>
        <AlertDescription>
          Beatmaps are automatically stored here when IndexedDB Cache is enabled
          in the settings. Filtering is done locally, so certain filters may
          work differently or may not be available.
        </AlertDescription>
      </Alert>

      <CustomBeatmapSets
        label="You Haven't Stored any Beatmaps!"
        helpText={
          <>
            Beatmaps will automatically appear here as you play while IndexedDB
            Cache is enabled in the settings.
          </>
        }
        beatmapSets={storedBeatmapSets}
        className={className}
      />
    </>
  );
};

export default StoredBeatmapSets;
