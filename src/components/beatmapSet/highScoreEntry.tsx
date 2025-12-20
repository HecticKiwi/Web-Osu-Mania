"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idb } from "@/lib/idb";
import { Beatmap, BeatmapSet } from "@/lib/osuApi";
import { getReplayFilename } from "@/lib/results";
import { cn, downloadBlob } from "@/lib/utils";
import { ReplayData } from "@/osuMania/systems/replayRecorder";
import { decompressSync } from "fflate";
import { Play, Save } from "lucide-react";
import { toast } from "sonner";
import { useGameStore } from "../../stores/gameStore";
import { HighScore } from "../../stores/highScoresStore";
import { Button } from "../ui/button";
import HighScoreBadge from "./highScoreBadge";

const HighScoreEntry = ({
  highScore,
  position,
  beatmapSet,
  beatmap,
}: {
  highScore: HighScore;
  position: number;
  beatmapSet: BeatmapSet;
  beatmap: Beatmap;
}) => {
  const startReplay = useGameStore.use.startReplay();

  const watchReplay = async () => {
    if (!highScore.replayId) {
      return;
    }

    const replay = await idb.getReplay(highScore.replayId);

    if (!replay) {
      toast("Replay Error", {
        description: "Replay could not be found",
      });

      return;
    }

    const arrayBuffer = await replay.file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const decompressed = decompressSync(uint8);
    const json = new TextDecoder().decode(decompressed);
    const replayData: ReplayData = JSON.parse(json);

    // Timestamp property was recently added, if it doesn't exist then set it from IDB file
    if (!replayData.timestamp) {
      replayData.timestamp = replay.dateAdded;
    }

    await startReplay(replayData);
  };

  const downloadReplay = async () => {
    if (!highScore.replayId) {
      return;
    }

    const replay = await idb.getReplay(highScore.replayId);
    if (!replay) {
      toast("Download Error", {
        description: "Replay could not be found.",
      });

      return;
    }

    const filename = `${getReplayFilename(beatmapSet.id, beatmapSet.title, beatmap.version, highScore.results)}.womr`;
    downloadBlob(replay.file, filename);
  };

  return (
    <div className="ml-2 flex items-center justify-between  px-2 py-2">
      <span
        className={cn(
          "text-muted-foreground",
          position === 1 && "text-yellow-300",
          position === 2 && "text-gray-300",
          position === 3 && "text-orange-300",
        )}
      >
        #{position}
      </span>

      <HighScoreBadge highScore={highScore} />

      <div className="flex rounded-md outline outline-1 outline-border">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-6 rounded-r-none"
                onClick={() => watchReplay()}
                disabled={!highScore.replayId}
              >
                <Play className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Watch Replay</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="h-6 rounded-l-none border-l"
                onClick={() => downloadReplay()}
                disabled={!highScore.replayId}
              >
                <Save className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Replay</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default HighScoreEntry;
