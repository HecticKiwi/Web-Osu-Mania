"use client";

import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import { InfoIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import BeatmapSetsInfiniteScroll from "./beatmapSetsInfiniteScroll";
import SavedBeatmapSets from "./savedBeatmapSets";
import StoredBeatmapSets from "./storedBeatmapSets";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const Main = () => {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get("category"));

  if (category === "Saved") {
    return (
      <div>
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
      <div>
        <Alert className="bg-card">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Currently Showing Your Stored Beatmaps</AlertTitle>
          <AlertDescription>
            Beatmaps are automatically stored here when "IndexedDB Cache" is
            enabled in the settings. Filtering is done locally, so certain
            filters may work differently or may not be available.
          </AlertDescription>
        </Alert>

        <StoredBeatmapSets className="mt-4" />
      </div>
    );
  }

  return (
    <div>
      <BeatmapSetsInfiniteScroll />
    </div>
  );
};

export default Main;
