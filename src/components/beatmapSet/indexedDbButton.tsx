"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idb } from "@/lib/idb";
import { BeatmapSet } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { HardDrive } from "lucide-react";
import { toast } from "sonner";
import { useStoredBeatmapSetsStore } from "../../stores/storedBeatmapSetsStore";
import { Button } from "../ui/button";

const IndexedDbButton = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  const storedBeatmapSets = useStoredBeatmapSetsStore.use.storedBeatmapSets();
  const setStoredBeatmapSets =
    useStoredBeatmapSetsStore.use.setStoredBeatmapSets();

  if (
    !storedBeatmapSets.some(
      (storedBeatmapSet) => storedBeatmapSet.id === beatmapSet.id,
    )
  ) {
    return null;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className={cn("h-8 w-8 ")}
              onClick={async () => {
                await idb.deleteBeatmap(beatmapSet.id);
                setStoredBeatmapSets((draft) => {
                  draft.splice(
                    draft.findIndex((set) => set.id === beatmapSet.id),
                    1,
                  );
                });

                toast("Beatmap deleted from IndexedDB.");
              }}
            >
              <HardDrive className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stored in IndexedDB (click to delete)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default IndexedDbButton;
