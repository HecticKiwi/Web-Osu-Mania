import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLetterGrade } from "@/lib/utils";
import { format } from "date-fns";
import { HighScore } from "../providers/highScoresProvider";

const HighScoreToolTip = ({ highScore }: { highScore: HighScore }) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger
        asChild
        className="flex items-center overflow-hidden rounded-full border border-primary p-0 text-xs text-primary"
      >
        <div tabIndex={0}>
          <span className="px-2 pl-2.5">
            {highScore.results.score.toLocaleString()}
          </span>

          <span className="-skew-x-12 bg-primary px-2 pr-2.5 text-background">
            <div className="skew-x-12">
              {(highScore.results.accuracy * 100).toFixed(2)}%
            </div>
          </span>
        </div>
      </TooltipTrigger>

      <TooltipContent className="text-xs">
        <p className="text-muted-foreground">
          Set on {format(highScore.timestamp, "d MMMM yyyy h:mm a")}
        </p>

        <div className="mx-auto my-2 w-fit rounded-full border-x px-2 py-1 text-base font-semibold">
          {getLetterGrade(highScore.results.accuracy)}
        </div>

        <div className=" flex gap-1">
          <div className="flex gap-1">
            <span className="w-8 bg-gradient-to-b from-blue-300 via-green-300 to-orange-300 bg-clip-text text-end text-transparent">
              300g
            </span>{" "}
            <span className="w-9">{highScore.results[320]}</span>
          </div>
          <div className="flex gap-1">
            <span className="w-8 text-end text-orange-300">300</span>{" "}
            <span className="w-9">{highScore.results[300]}</span>
          </div>
          <div className="flex gap-1">
            <span className="w-8 text-end text-green-300">200</span>{" "}
            <span className="w-9">{highScore.results[200]}</span>
          </div>
        </div>
        <div className="mt-1 flex gap-1">
          <div className="flex gap-1">
            <span className="w-8 text-end text-sky-300">100</span>{" "}
            <span className="w-9">{highScore.results[100]}</span>
          </div>
          <div className="flex gap-1">
            <span className="w-8 text-end text-slate-300">50</span>{" "}
            <span className="w-9">{highScore.results[50]}</span>
          </div>
          <div className="flex gap-1">
            <span className="w-8 text-end text-rose-300">x</span>{" "}
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
