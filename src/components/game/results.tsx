import { BeatmapData } from "@/lib/beatmapParser";
import { mean, stdev } from "@/lib/math";
import { cn, getLetterGrade, getModStrings } from "@/lib/utils";
import { PlayResults } from "@/types";
import { format } from "date-fns";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapSetPageButton from "../beatmapSet/beatmapPageButton";
import SaveBeatmapSetButton from "../beatmapSet/saveBeatmapSetButton";
import TimingDistributionChart from "./timingDistributionChart";

const Results = ({
  beatmapData,
  playResults,
  newHighScore,
  responsive,
}: {
  beatmapData: BeatmapData;
  playResults: PlayResults;
  newHighScore?: boolean;
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

  return (
    <div
      className={cn(
        "w-screen-xl mx-auto flex min-h-screen flex-col justify-center",
        responsive && "max-w-screen-xl",
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
          // Fixes a bug with a sliver of the BG peeking out below the gradients when downloading screenshot
          className="-m-[1px] p-[calc(2rem+1px)]"
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

              <div className="text-xl text-muted-foreground">
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
            <div className="flex w-fit items-center gap-2 rounded border bg-card p-1.5">
              <p className="text-yellow-400">{beatmap?.difficulty_rating}★</p>
              <p className="line-clamp-1">{beatmapData.metadata.version}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {getModStrings(mods, replayData?.mods).map((mod) => (
                <span
                  key={mod}
                  className="rounded-full bg-primary/25 px-3 py-0.5"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {playResults.replayData.timestamp && (
            <p className="mt-1 text-muted-foreground">
              Set on{" "}
              {format(playResults.replayData.timestamp, "d MMMM yyyy h:mm a")}
            </p>
          )}

          <div className="mt-8 flex items-center text-center text-[100px] leading-none">
            <div className="h-[1px] grow bg-gradient-to-r from-transparent to-primary"></div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-4 text-center text-3xl font-semibold text-primary">
                Grade
              </h3>
              <span>
                {playResults.failed ? "Failed" : getLetterGrade(playResults)}
              </span>
            </div>

            <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
          </div>
        </div>
      </div>

      <div className="p-8 pt-0">
        <div
          className={cn(
            "grid grid-cols-2 gap-6 gap-y-12 rounded-xl border bg-card p-8 ",
            responsive && "grid-cols-1 xl:grid-cols-2",
          )}
        >
          <div className="grid gap-6">
            <div className="rounded-xl">
              <h2 className="mb-4 text-3xl font-semibold text-primary">
                Score
              </h2>
              <span className="text-5xl">
                {playResults.score.toLocaleString()}
              </span>

              {newHighScore && (
                <div className="mt-2 block w-fit rounded-full bg-yellow-900 px-3 py-1 text-sm text-yellow-400">
                  New high score!
                </div>
              )}
            </div>

            <div
              className={cn(
                "grid grid-cols-2 gap-6",
                responsive && "grid-cols-1 sm:grid-cols-2",
              )}
            >
              <div className="rounded-xl">
                <h3 className="mb-4 text-3xl font-semibold text-primary">
                  Max Combo
                </h3>
                <span className="text-5xl">{playResults.maxCombo}x</span>
              </div>

              <div className="rounded-xl">
                <h3 className="mb-4 text-3xl font-semibold text-primary">
                  Accuracy
                </h3>
                <span className="text-5xl">
                  {(playResults.accuracy * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl">
            <h2 className="mb-4 text-3xl font-semibold text-primary">
              Breakdown
            </h2>

            <div
              className={cn(
                "grid grid-cols-2 gap-4 text-2xl",
                responsive && "grid-cols-1 sm:grid-cols-2",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="w-16 text-judgement-great">300</span>
                <span className="text-5xl">{playResults[300]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-judgement-perfect">300g</span>
                <span className="text-5xl">{playResults[320]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-judgement-good">200</span>
                <span className="text-5xl">{playResults[200]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-judgement-ok">100</span>
                <span className="text-5xl">{playResults[100]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-judgement-meh">50</span>
                <span className="text-5xl">{playResults[50]}x</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 text-judgement-miss">miss!</span>
                <span className="text-5xl">{playResults[0]}x</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-3xl font-semibold text-primary">
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
              <h3 className="mb-3 text-2xl font-medium text-muted-foreground">
                Average Hit Error
              </h3>
              <span className="text-3xl">
                {Math.abs(averageError).toFixed(2)} ms{" "}
                {averageError < 0 && "late"}
                {averageError > 0 && "early"}
              </span>
            </div>

            <div className="rounded-xl">
              <h3 className="mb-3 text-2xl font-medium text-muted-foreground">
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
