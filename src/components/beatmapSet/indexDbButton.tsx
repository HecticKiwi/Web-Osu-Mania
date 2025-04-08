"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Idb } from "@/lib/idb";
import { BeatmapSet } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { HardDrive } from "lucide-react";
import { useStoredBeatmapSetsContext } from "../providers/storedBeatmapSetsProvider";
import { Button } from "../ui/button";

const IndexDbButton = ({ beatmapSet }: { beatmapSet: BeatmapSet }) => {
  const { setStoredBeatmapSets } = useStoredBeatmapSetsContext();

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
                const idb = new Idb();
                await idb.deleteBeatmap(beatmapSet.id);
                setStoredBeatmapSets((draft) => {
                  return draft.filter((set) => set.id !== beatmapSet.id);
                });
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

export default IndexDbButton;
