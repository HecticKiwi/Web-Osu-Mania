import { BeatmapData } from "@/lib/beatmapParser";
import { mean, stdev } from "@/lib/math";
import { calculatePp, cn, getLetterGrade, getModStrings } from "@/lib/utils";
import { PlayResults } from "@/types";
import { format } from "date-fns";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapSetPageButton from "../beatmapSet/beatmapPageButton";
import SaveBeatmapSetButton from "../beatmapSet/saveBeatmapSetButton";
import LetterGradeCard from "./letterGradeCard";
import TimingDistributionChart from "./timingDistributionChart";

const Results = ({
  beatmapData,
  playResults,
  highScorePosition,
  responsive,
}: {
  beatmapData: BeatmapData;
  playResults: PlayResults;
  highScorePosition: number | null;
  responsive?: boolean;
}) => {
  const beatmapSet = useGameStore.use.beatmapSet();
  const beatmapId = useGameStore.use.beatmapId();
  const replayData = useGameStore.use.replayData();
  const mods = useSettingsStore.use.mods();
  const preferMetadataInOriginalLanguage =
    useSettingsStore.use.preferMetadataInOriginalLanguage();

  const beatmap = beatmapSet?.beatmaps.find(
    (beatmap) => beatmap.id === beatmapId,
  );

  const title = preferMetadataInOriginalLanguage
    ? beatmapData.metadata.titleUnicode
    : beatmapData.metadata.title;

  const errors = playResults.hitErrors.map((timingError) => timingError.error);
  const averageError = mean(errors);
  const unstableRate = stdev(errors) * 10; // https://osu.ppy.sh/wiki/en/Gameplay/Unstable_rate

  console.log(mods.playbackRate);

  const pp =
    beatmap && mods.playbackRate === 1
      ? calculatePp(
          beatmap.difficulty_rating,
          playResults,
          beatmap.count_circles + beatmap.count_sliders,
          {
            noFail: mods.noFail,
            easy: mods.easy,
          },
        )
      : null;

  return (
    <div
      className={cn(
        "w-screen-xl mx-auto flex min-h-screen flex-col justify-center",
        responsive && "max-w-(--breakpoint-xl)",
      )}
    >
      <div
        style={{
          background: `url(${beatmapData.backgroundUrl}) center/cover no-repeat`,
        }}
      >
        <div
          style={{
            background: `
              linear-gradient(to top, hsl(var(--background)), hsl(var(--background) / 0.45) 25%),
              linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background) / 0.45) 25%),
              linear-gradient(to left, hsl(var(--background)), hsl(var(--background) / 0.45) 25%),
              linear-gradient(to right, hsl(var(--background)), hsl(var(--background) / 0.45) 25%)
            `,
          }}
          className="p-8"
        >
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
            <div>
              <h1
                className={cn(
                  "text-5xl font-semibold",
                  responsive && "text-3xl md:text-5xl",
                )}
              >
                {title}
              </h1>

              <div className="text-muted-foreground text-xl">
                Beatmap by {beatmapData.metadata.creator}
              </div>
            </div>

            {beatmapSet && (
              <div className="flex gap-2" data-exclude>
                <SaveBeatmapSetButton beatmapSet={beatmapSet} alwaysShow />

                <BeatmapSetPageButton beatmapSetId={beatmapSet.id} />
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="bg-card flex w-fit items-center gap-2 rounded border p-1.5">
              <p className="text-yellow-400">
                {beatmap?.difficulty_rating.toFixed(2)}★
              </p>
              <p className="line-clamp-1">{beatmapData.metadata.version}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {getModStrings(mods, replayData?.mods).map((mod) => (
                <span
                  key={mod}
                  className="bg-primary/25 rounded-full px-3 py-0.5"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {playResults.replayData?.timestamp && (
            <p className="text-muted-foreground mt-1">
              Set on{" "}
              {format(playResults.replayData.timestamp, "d MMMM yyyy h:mm a")}
            </p>
          )}

          <div className="mt-8 flex items-center text-center text-[100px] leading-none">
            <div className="to-primary h-px grow bg-linear-to-r from-transparent"></div>
            <LetterGradeCard
              grade={
                playResults.failed ? "Failed" : getLetterGrade(playResults)
              }
            />

            <div className="to-primary h-px grow bg-linear-to-l from-transparent"></div>
          </div>
        </div>
      </div>

      <div className="p-8 pt-0">
        <div
          className={cn(
            "bg-card grid grid-cols-2 gap-6 gap-y-12 rounded-xl border p-8",
            responsive && "grid-cols-1 xl:grid-cols-2",
          )}
        >
          <div className="grid gap-6">
            <div
              className={cn(
                "grid grid-cols-2 gap-6",
                responsive && "grid-cols-1 sm:grid-cols-2",
              )}
            >
              <div className="rounded-xl">
                <h2 className="text-primary mb-4 text-3xl font-semibold">
                  Score
                </h2>
                <div>
                  <span className="text-5xl">
                    {playResults.score.toLocaleString()}
                  </span>

                  {highScorePosition !== null && (
                    <div className="mt-2 block w-fit rounded-full bg-yellow-900 px-3 py-1 text-sm text-yellow-400">
                      New #{highScorePosition} high score!
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl">
                <h3 className="text-primary mb-4 text-3xl font-semibold">
                  Accuracy
                </h3>
                <span className="text-5xl">
                  {(playResults.accuracy * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            <div
              className={cn(
                "grid grid-cols-2 gap-6",
                responsive && "grid-cols-1 sm:grid-cols-2",
              )}
            >
              <div className="rounded-xl">
                <h3 className="text-primary mb-4 text-3xl font-semibold">
                  Max Combo
                </h3>
                <span className="text-5xl">{playResults.maxCombo}x</span>
              </div>

              <div
                className="rounded-xl"
                title={
                  pp == null
                    ? "PP cannot be calculated for scores with speed mods."
                    : undefined
                }
              >
                <h3 className="text-primary mb-4 text-3xl font-semibold">PP</h3>
                <span className="text-5xl">{pp ?? "-"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl">
            <h2 className="text-primary mb-4 text-3xl font-semibold">
              Breakdown
            </h2>

            <div
              className={cn(
                "grid grid-cols-2 gap-4 text-2xl",
                responsive && "grid-cols-1 sm:grid-cols-2",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-judgement-great w-16">300</span>
                <span className="text-5xl">{playResults[300]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-judgement-perfect w-16">300g</span>
                <span className="text-5xl">{playResults[320]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-judgement-good w-16">200</span>
                <span className="text-5xl">{playResults[200]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-judgement-ok w-16">100</span>
                <span className="text-5xl">{playResults[100]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-judgement-meh w-16">50</span>
                <span className="text-5xl">{playResults[50]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-judgement-miss w-16">miss!</span>
                <span className="text-5xl">{playResults[0]}x</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card mt-8 w-full rounded-xl border p-6">
          <h2 className="text-primary mb-4 text-3xl font-semibold">
            Timing Distribution
          </h2>

          <TimingDistributionChart hitErrors={playResults.hitErrors} />

          <div
            className={cn(
              "mt-6 grid grid-cols-2 gap-6",
              responsive && "grid-cols-1 sm:grid-cols-2",
            )}
          >
            <div className="rounded-xl">
              <h3 className="text-muted-foreground mb-3 text-2xl font-medium">
                Average Hit Error
              </h3>
              <span className="text-3xl">
                {Math.abs(averageError).toFixed(2)} ms{" "}
                {averageError < 0 && "late"}
                {averageError > 0 && "early"}
              </span>
            </div>

            <div className="rounded-xl">
              <h3 className="text-muted-foreground mb-3 text-2xl font-medium">
                Unstable Rate
              </h3>
              <span className="text-3xl">{unstableRate.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
