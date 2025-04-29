"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BeatmapSet } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useSavedBeatmapSetsStore } from "../../stores/savedBeatmapSetsStore";
import { Button } from "../ui/button";

const SaveBeatmapSetButton = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  const savedBeatmapSets = useSavedBeatmapSetsStore.use.savedBeatmapSets();
  const setSavedBeatmapSets =
    useSavedBeatmapSetsStore.use.setSavedBeatmapSets();

  const isSaved = savedBeatmapSets.some((set) => set.id === beatmapSet.id);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "h-8 w-8 opacity-0 transition group-hover:opacity-100 focus:opacity-100",
              isSaved && "opacity-100",
            )}
            onClick={() => {
              if (isSaved) {
                setSavedBeatmapSets((draft) => {
                  draft.splice(
                    draft.findIndex((set) => set.id === beatmapSet.id),
                    1,
                  );
                });
              } else {
                setSavedBeatmapSets((draft) => {
                  draft.push(beatmapSet);
                });
              }
            }}
          >
            <Bookmark
              className="size-5"
              fill={isSaved ? "white" : "transparent"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSaved ? "Unsave Beatmap" : "Save Beatmap"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SaveBeatmapSetButton;
