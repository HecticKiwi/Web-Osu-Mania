import { BeatmapData } from "@/lib/beatmapParser";
import { idb } from "@/lib/idb";
import { downloadReplay } from "@/lib/replay";
import { getLetterGrade, getModStrings, mean, stdev } from "@/lib/utils";
import { PlayResults } from "@/types";
import { MoveLeft, Play, Repeat, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameContext } from "../providers/gameProvider";
import { useHighScoresContext } from "../providers/highScoresProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";
import TimingDistributionChart from "./timingDistributionChart";

const ResultsScreen = ({
  beatmapData,
  playResults,
  retry,
}: {
  beatmapData: BeatmapData;
  playResults: PlayResults;
  retry: () => void;
}) => {
  const { closeGame, beatmapSet, beatmapId, replayData, setReplayData } =
    useGameContext();
  const { settings } = useSettingsContext();
  const { highScores, setHighScores } = useHighScoresContext();
  const [newHighScore, setNewHighScore] = useState(false);

  // Check for new high score
  useEffect(() => {
    if (
      !beatmapId ||
      !beatmapSet ||
      settings.mods.autoplay ||
      playResults.failed
    ) {
      return;
    }

    const checkNewHighScore = async () => {
      const beatmapSetId = beatmapSet.id;

      const previousHighScore =
        highScores[beatmapSetId]?.[beatmapId]?.results.score ?? 0;

      if (playResults.score > previousHighScore) {
        await idb.saveReplay(playResults.replayData, beatmapId.toString());

        // Trim out properties that don't need to be saved
        const { failed, viewingReplay, replayData, hitErrors, ...results } =
          playResults;

        setHighScores((draft) => {
          draft[beatmapSetId] ??= {};

          draft[beatmapSetId][beatmapId] = {
            timestamp: Date.now(),
            mods: getModStrings(settings),
            results,
            replayId: beatmapId.toString(),
          };
        });

        setNewHighScore(true);
      }
    };

    checkNewHighScore();
  }, [beatmapId, beatmapSet, highScores, playResults, setHighScores, settings]);

  const beatmap = beatmapSet?.beatmaps.find(
    (beatmap) => beatmap.id === beatmapId,
  );

  const title = settings.preferMetadataInOriginalLanguage
    ? beatmapData.metadata.titleUnicode
    : beatmapData.metadata.title;

  const errors = playResults.hitErrors.map((timingError) => timingError.error);
  const averageError = mean(errors);
  const unstableRate = stdev(errors) * 10; // https://osu.ppy.sh/wiki/en/Gameplay/Unstable_rate

  return (
    <>
      {/* Top of -1px since it wasn't covering the top for some reason */}
      <div className="fixed inset-0 -top-[1px] overflow-auto bg-background duration-1000 animate-in fade-in scrollbar">
        <main className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-center p-8">
          <h1 className="text-3xl font-semibold md:text-5xl">{title}</h1>

          <div className="text-xl text-muted-foreground">
            Beatmap by {beatmapData.metadata.creator}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="flex w-fit items-center gap-2 rounded border bg-card p-1.5">
              <p className="text-yellow-400">{beatmap?.difficulty_rating}★</p>
              <p className="line-clamp-1">{beatmapData.metadata.version}</p>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {getModStrings(settings, replayData?.mods).map((mod) => (
                <span
                  key={mod}
                  className="rounded-full bg-primary/25 px-2 py-0.5"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="grid gap-6 gap-y-12 rounded-xl border bg-card p-8 xl:grid-cols-2">
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

                <div className="grid gap-6 sm:grid-cols-2">
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

                <div className="grid gap-4 text-2xl sm:grid-cols-2">
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

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
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

            <div className="mt-8 flex items-center text-center text-[100px] leading-none">
              <div className="h-[1px] grow bg-gradient-to-r from-transparent to-primary"></div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="mb-4 text-center text-3xl font-semibold text-primary">
                  Grade
                </h3>
                <span>
                  {playResults.failed
                    ? "Failed"
                    : getLetterGrade(playResults.accuracy)}
                </span>
              </div>

              <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
            </div>

            <div className="mt-8 flex flex-col justify-center">
              <div className="mt-16 flex flex-wrap items-center justify-between gap-8">
                <div className="flex gap-4">
                  <Button
                    variant={"ghost"}
                    className="gap-2 text-xl"
                    onClick={() => closeGame()}
                  >
                    <MoveLeft /> Back
                  </Button>

                  {!playResults.viewingReplay && (
                    <Button
                      variant={"default"}
                      className="gap-2 text-xl"
                      onClick={() => retry()}
                    >
                      <Repeat /> Retry
                    </Button>
                  )}
                </div>

                {playResults.replayData && (
                  <div className="flex gap-4">
                    <Button
                      variant={"secondary"}
                      className="gap-2 text-xl"
                      onClick={() => {
                        setReplayData(playResults.replayData);
                        retry();
                      }}
                    >
                      <Play /> Watch{" "}
                      <span className="hidden lg:inline">Replay</span>
                    </Button>

                    <Button
                      variant={"secondary"}
                      className="gap-2 text-xl"
                      onClick={() =>
                        downloadReplay(
                          playResults.replayData,
                          beatmapData,
                          playResults,
                        )
                      }
                    >
                      <Save /> Download{" "}
                      <span className="hidden lg:inline">Replay</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResultsScreen;
