import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idb } from "@/lib/idb";
import type { Beatmap, BeatmapSet } from "@/lib/osuApi";
import { getReplayFilename } from "@/lib/results";
import { cn, downloadBlob } from "@/lib/utils";
import type { ReplayData } from "@/osuMania/systems/replayRecorder";
import { decompressSync } from "fflate";
import { Play, Save } from "lucide-react";
import { toast } from "sonner";
import { useGameStore } from "../../stores/gameStore";
import type { HighScore } from "../../stores/highScoresStore";
import { Button } from "../ui/button";
import DeleteHighScoreButton from "./deleteHighScoreButton";
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
    <div className="ml-0 flex items-center justify-between py-2 pl-2">
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

      <HighScoreBadge highScore={highScore} beatmap={beatmap} />

      <div className="outline-border flex rounded-md outline-1 outline-solid">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild className="h-6 rounded-r-none">
              <Button
                variant={"ghost"}
                size={"icon"}
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
            <TooltipTrigger asChild className="h-6 rounded-l-none border-l">
              <Button
                variant={"ghost"}
                size={"icon"}
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

      <DeleteHighScoreButton
        highScore={highScore}
        position={position}
        beatmapSetId={beatmapSet.id}
        beatmapId={beatmap.id}
      />
    </div>
  );
};

export default HighScoreEntry;
