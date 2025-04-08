"use client";

import { useStoredBeatmapSetsContext } from "../providers/storedBeatmapSetsProvider";
import CustomBeatmapSets from "./customBeatmapSets";

const StoredBeatmapSets = ({ className }: { className?: string }) => {
  const { storedBeatmapSets } = useStoredBeatmapSetsContext();

  return (
    <CustomBeatmapSets
      label="Stored"
      helpText={
        <>
          Beatmaps will automatically appear here as you play while IndexedDB
          Cache is enabled in the settings.
        </>
      }
      beatmapSets={storedBeatmapSets}
      className={className}
    />
  );
};

export default StoredBeatmapSets;
