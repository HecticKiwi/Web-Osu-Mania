"use client";

import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import { useGameStore } from "@/stores/gameStore";
import { InfoIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import BeatmapSetsInfiniteScroll from "./beatmapSets/beatmapSetsInfiniteScroll";
import SavedBeatmapSets from "./beatmapSets/savedBeatmapSets";
import StoredBeatmapSets from "./beatmapSets/storedBeatmapSets";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const Main = () => {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get("category"));
  const beatmapId = useGameStore.use.beatmapId();
  const scrollPosition = useGameStore.use.scrollPosition();

  useEffect(() => {
    if (!beatmapId && scrollPosition !== null) {
      window.scrollTo({ top: scrollPosition });
    }
  }, [beatmapId, scrollPosition]);

  if (category === "Saved") {
    return (
      <div hidden={!!beatmapId}>
        <Alert className="bg-card">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Currently Showing Your Saved Beatmaps</AlertTitle>
          <AlertDescription>
            Saved beatmaps are stored and filtering is done locally, so certain
            filters may work differently or may not be available.
          </AlertDescription>
        </Alert>

        <SavedBeatmapSets className="mt-4" />
      </div>
    );
  }

  if (category === "Stored") {
    return (
      <div hidden={!!beatmapId}>
        <Alert className="bg-card">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Currently Showing Your Stored Beatmaps</AlertTitle>
          <AlertDescription>
            Beatmaps are automatically stored here when IndexedDB Cache is
            enabled in the settings. Filtering is done locally, so certain
            filters may work differently or may not be available.
          </AlertDescription>
        </Alert>

        <StoredBeatmapSets className="mt-4" />
      </div>
    );
  }

  return (
    <div hidden={!!beatmapId}>
      <BeatmapSetsInfiniteScroll />
    </div>
  );
};

export default Main;
