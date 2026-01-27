import { Bookmark } from "lucide-react";
import { useSavedBeatmapSetsStore } from "../../stores/savedBeatmapSetsStore";
import CustomBeatmapSets from "./customBeatmapSets";

const SavedBeatmapSets = ({ className }: { className?: string }) => {
  const savedBeatmapSets = useSavedBeatmapSetsStore.use.savedBeatmapSets();

  return (
    <CustomBeatmapSets
      label="Saved"
      helpText={
        <>
          Save beatmaps by clicking the <Bookmark className="inline" /> icon.
        </>
      }
      beatmapSets={savedBeatmapSets}
      className={className}
    />
  );
};

export default SavedBeatmapSets;
