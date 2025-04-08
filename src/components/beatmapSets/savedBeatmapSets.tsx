"use client";

import { Bookmark } from "lucide-react";
import { useSavedBeatmapSetsContext } from "../providers/savedBeatmapSetsProvider";
import CustomBeatmapSets from "./customBeatmapSets";

const SavedBeatmapSets = ({ className }: { className?: string }) => {
  const { savedBeatmapSets } = useSavedBeatmapSetsContext();

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
