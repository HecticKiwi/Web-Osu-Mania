"use client";

import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import { InfoIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import BeatmapSetsInfiniteScroll from "./beatmapSetsInfiniteScroll";
import SavedBeatmapSets from "./savedBeatmapSets";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const Main = () => {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get("category"));
  const viewingSavedBeatmapSets = category === "Saved";

  return (
    <div>
      {viewingSavedBeatmapSets && (
        <>
          <Alert className="bg-card">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Currently Showing Your Saved Beatmaps</AlertTitle>
            <AlertDescription>
              Saved beatmaps are stored and filtering is done locally, so
              certain filters may work differently or may not be available.
            </AlertDescription>
          </Alert>
          <SavedBeatmapSets className="mt-4" />
        </>
      )}
      {!viewingSavedBeatmapSets && <BeatmapSetsInfiniteScroll />}
    </div>
  );
};

export default Main;
