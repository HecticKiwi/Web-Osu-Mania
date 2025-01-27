"use client";

import { BeatmapSet } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useSavedBeatmapSetsContext } from "../providers/savedBeatmapSetsProvider";
import { Button } from "../ui/button";

const SaveBeatmapSetButton = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  const { savedBeatmapSets, setSavedBeatmapSets } =
    useSavedBeatmapSetsContext();

  const isSaved = savedBeatmapSets.some((set) => set.id === beatmapSet.id);

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className={cn(
        "h-8 w-8 opacity-0 transition group-hover:opacity-100",
        isSaved && "opacity-100",
      )}
      onClick={() => {
        if (isSaved) {
          setSavedBeatmapSets((draft) => {
            return draft.filter((set) => set.id !== beatmapSet.id);
          });
        } else {
          setSavedBeatmapSets((draft) => {
            draft.push(beatmapSet);
          });
        }
      }}
      title={isSaved ? "Unsave beatmap" : "Save beatmap"}
    >
      <Bookmark className="size-5" fill={isSaved ? "white" : "transparent"} />
    </Button>
  );
};

export default SaveBeatmapSetButton;
