import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Beatmap } from "@/lib/osuApi";
import {
  calculatePp,
  cn,
  getClassNamesForGrade,
  getLetterGrade,
} from "@/lib/utils";
import { format, formatDistanceToNowStrict } from "date-fns";
import type { HighScore } from "../../stores/highScoresStore";

const HighScoreBadge = ({
  highScore,
  beatmap,
}: {
  highScore: HighScore;
  beatmap: Beatmap;
}) => {
  const score = highScore.results.score.toLocaleString();
  const accuracy = (highScore.results.accuracy * 100).toFixed(2);

  const letterGrade = getLetterGrade(highScore.results);

  const mods = highScore.mods;
  const pp =
    !mods.includes("Half Time") &&
    !mods.includes("Double Time") &&
    !mods.some((mod) => mod.startsWith("Song Speed"))
      ? calculatePp(
          beatmap.difficulty_rating,
          highScore.results,
          beatmap.count_circles + beatmap.count_sliders,
          {
            // I should've made the HighScore mods typesafe...
            noFail: mods.includes("No Fail"),
            easy: mods.includes("Easy"),
          },
        )
      : null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger
          asChild
          className="group border-primary text-primary relative flex items-center overflow-hidden rounded-full border p-0 text-xs"
        >
          <div className="">
            <span className="px-2 pl-2.5">{score}</span>

            <span className="bg-primary text-background -skew-x-12 px-2 pr-2.5">
              <div className="skew-x-12">{accuracy}%</div>
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent className="px-2 text-xs">
          <div className="flex justify-between">
            <div>
              <p>{format(highScore.timestamp, "d MMMM yyyy h:mm a")}</p>
              <p className="text-muted-foreground">
                {formatDistanceToNowStrict(highScore.timestamp)} ago
              </p>
            </div>

            <span
              className="bg-background text-muted-foreground self-start rounded px-2 py-1 font-mono"
              title={
                pp === null
                  ? "PP cannot be calculated for scores with speed mods."
                  : undefined
              }
            >
              {pp ?? "-"}
              <span className="text-xs">pp</span>
            </span>
          </div>

          <div
            className={cn(
              "mx-auto my-2 w-fit rounded-full border-x px-2 py-1 text-base font-semibold",
              getClassNamesForGrade(letterGrade),
            )}
          >
            {letterGrade}
          </div>

          <div className="mb-2 flex justify-around text-base">
            <span className="text-primary">{score}</span>
            <span className="text-muted-foreground">{accuracy}%</span>
          </div>

          <div className="flex gap-1">
            <div className="flex gap-1">
              <span className="text-judgement-perfect w-8 text-end">300g</span>
              <span className="w-9">{highScore.results[320]}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-judgement-great w-8 text-end">300</span>
              <span className="w-9">{highScore.results[300]}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-judgement-good w-8 text-end">200</span>
              <span className="w-9">{highScore.results[200]}</span>
            </div>
          </div>
          <div className="mt-1 flex gap-1">
            <div className="flex gap-1">
              <span className="text-judgement-ok w-8 text-end">100</span>
              <span className="w-9">{highScore.results[100]}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-judgement-meh w-8 text-end">50</span>
              <span className="w-9">{highScore.results[50]}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-judgement-miss w-8 text-end">x</span>
              <span className="w-9">{highScore.results[0]}</span>
            </div>
          </div>

          {highScore.mods.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 border-t pt-2">
              {highScore.mods.map((mod) => (
                <span
                  key={mod}
                  className="bg-primary/25 rounded-full px-2 py-0.5"
                >
                  {mod}
                </span>
              ))}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HighScoreBadge;
