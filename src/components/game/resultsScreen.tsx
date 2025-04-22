import { BeatmapData } from "@/lib/beatmapParser";
import { idb } from "@/lib/idb";
import { downloadReplay } from "@/lib/replay";
import { getLetterGrade, getModStrings } from "@/lib/utils";
import { PlayResults } from "@/types";
import { MoveLeft, Play, Repeat, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameContext } from "../providers/gameProvider";
import { useHighScoresContext } from "../providers/highScoresProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";

const ResultsScreen = ({
  beatmapData,
  results,
  retry,
}: {
  beatmapData: BeatmapData;
  results: PlayResults;
  retry: () => void;
}) => {
  const { closeGame, beatmapSet, beatmapId, setReplayData } = useGameContext();
  const { settings } = useSettingsContext();
  const { highScores, setHighScores } = useHighScoresContext();
  const [newHighScore, setNewHighScore] = useState(false);

  // Check for new high score
  useEffect(() => {
    if (!beatmapId || !beatmapSet || settings.mods.autoplay || results.failed) {
      return;
    }

    const checkNewHighScore = async () => {
      const beatmapSetId = beatmapSet.id;

      const previousHighScore =
        highScores[beatmapSetId]?.[beatmapId]?.results.score ?? 0;

      if (results.score > previousHighScore) {
        await idb.saveReplay(results.replayData, beatmapId.toString());

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
  }, [beatmapId, beatmapSet, highScores, results, setHighScores, settings]);

  const beatmap = beatmapSet?.beatmaps.find(
    (beatmap) => beatmap.id === beatmapId,
  );

  const title = settings.preferMetadataInOriginalLanguage
    ? beatmapData.metadata.titleUnicode
    : beatmapData.metadata.title;

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
              {getModStrings(settings).map((mod) => (
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
                    {results.score.toLocaleString()}
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
                    <span className="text-5xl">{results.maxCombo}x</span>
                  </div>

                  <div className="rounded-xl">
                    <h3 className="mb-4 text-3xl font-semibold text-primary">
                      Accuracy
                    </h3>
                    <span className="text-5xl">
                      {(results.accuracy * 100).toFixed(2)}%
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
                    <span className="w-16 text-orange-300">300</span>
                    <span className="text-5xl">{results[300]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 bg-gradient-to-b from-blue-300 via-green-300 to-orange-300 bg-clip-text text-transparent">
                      300g
                    </span>
                    <span className="text-5xl">{results[320]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 bg-gradient-to-b text-green-300">
                      200
                    </span>
                    <span className="text-5xl">{results[200]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 bg-gradient-to-b text-sky-300">
                      100
                    </span>
                    <span className="text-5xl">{results[100]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 bg-gradient-to-b text-slate-300">
                      50
                    </span>
                    <span className="text-5xl">{results[50]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 bg-gradient-to-b text-rose-300">
                      miss!
                    </span>
                    <span className="text-5xl">{results[0]}x</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center">
              <div className="flex items-center text-center text-[100px] leading-none">
                <div className="h-[1px] grow bg-gradient-to-r from-transparent to-primary"></div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 text-center text-3xl font-semibold text-primary">
                    Grade
                  </h3>
                  <span>
                    {results.failed
                      ? "Failed"
                      : getLetterGrade(results.accuracy)}
                  </span>
                </div>

                <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
              </div>

              <div className="mt-16 flex items-center gap-4">
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  className="gap-2 text-xl"
                  onClick={() => closeGame()}
                >
                  <MoveLeft /> Back
                </Button>

                {!results.viewingReplay && (
                  <Button
                    variant={"default"}
                    size={"lg"}
                    className="gap-2 text-xl"
                    onClick={() => retry()}
                  >
                    <Repeat /> Retry
                  </Button>
                )}

                {results.replayData && (
                  <div className="ml-auto flex gap-4">
                    <Button
                      variant={"secondary"}
                      size={"lg"}
                      className="ml-4 gap-2 text-xl"
                      onClick={() => {
                        setReplayData(results.replayData);
                        retry();
                      }}
                    >
                      <Play /> Watch Replay
                    </Button>

                    <Button
                      variant={"secondary"}
                      size={"lg"}
                      className="gap-2 text-xl"
                      onClick={() =>
                        downloadReplay(results.replayData, beatmapData, results)
                      }
                    >
                      <Save /> Download Replay
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
