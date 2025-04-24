"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idb } from "@/lib/idb";
import { getLetterGrade } from "@/lib/utils";
import { ReplayData } from "@/osuMania/systems/replayRecorder";
import { format } from "date-fns";
import { inflate } from "pako";
import { toast } from "sonner";
import { useGameContext } from "../providers/gameProvider";
import { HighScore } from "../providers/highScoresProvider";

const HighScoreToolTip = ({ highScore }: { highScore: HighScore }) => {
  const { startReplay } = useGameContext();

  const score = highScore.results.score.toLocaleString();
  const accuracy = (highScore.results.accuracy * 100).toFixed(2);

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

    const arrayBuffer = await replay.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const decompressed = inflate(uint8);
    const json = new TextDecoder().decode(decompressed);
    const replayData: ReplayData = JSON.parse(json);

    await startReplay(replayData);
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger
        className="group relative overflow-hidden rounded-full border border-primary p-0 text-xs text-primary"
        onClick={(e) => {
          e.stopPropagation();
          watchReplay();
        }}
      >
        <div className="flex items-center transition-opacity group-hover:opacity-0 group-focus:opacity-0">
          <span className="px-2 pl-2.5">{score}</span>

          <span className="-skew-x-12 bg-primary px-2 pr-2.5 text-background">
            <div className="skew-x-12">{accuracy}%</div>
          </span>
        </div>

        {!highScore.replayId && (
          <div className="absolute inset-0 text-center opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
            No Replay
          </div>
        )}
        {highScore.replayId && (
          <div className="absolute inset-0 bg-primary text-center text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
            Watch Replay ➤
          </div>
        )}
      </TooltipTrigger>

      <TooltipContent className="text-xs">
        <p className="text-muted-foreground">
          Set on {format(highScore.timestamp, "d MMMM yyyy h:mm a")}
        </p>

        <div className="mx-auto my-2 w-fit rounded-full border-x px-2 py-1 text-base font-semibold">
          {getLetterGrade(highScore.results.accuracy)}
        </div>

        <div className="mb-2 flex justify-around text-base">
          <span className="text-primary">{score}</span>
          <span className="text-muted-foreground">{accuracy}%</span>
        </div>

        <div className=" flex gap-1">
          <div className="flex gap-1">
            <span className="text-judgement-perfect w-8 text-end">300g</span>{" "}
            <span className="w-9">{highScore.results[320]}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-judgement-great w-8 text-end">300</span>{" "}
            <span className="w-9">{highScore.results[300]}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-judgement-good w-8 text-end">200</span>{" "}
            <span className="w-9">{highScore.results[200]}</span>
          </div>
        </div>
        <div className="mt-1 flex gap-1">
          <div className="flex gap-1">
            <span className="text-judgement-ok w-8 text-end">100</span>{" "}
            <span className="w-9">{highScore.results[100]}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-judgement-meh w-8 text-end">50</span>{" "}
            <span className="w-9">{highScore.results[50]}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-judgement-miss w-8 text-end">x</span>{" "}
            <span className="w-9">{highScore.results[0]}</span>
          </div>
        </div>

        {highScore.mods.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 border-t pt-2">
            {highScore.mods.map((mod) => (
              <span
                key={mod}
                className="rounded-full bg-primary/25 px-2 py-0.5"
              >
                {mod}
              </span>
            ))}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default HighScoreToolTip;
