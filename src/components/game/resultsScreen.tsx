import { BeatmapData } from "@/lib/beatmapParser";
import { getLetterGrade, getModStrings } from "@/lib/utils";
import { PlayResults } from "@/types";
import { useEffect, useState } from "react";
import { useGameContext } from "../providers/gameProvider";
import { useHighScoresContext } from "../providers/highScoresProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";
import { ReplayData } from "@/osuMania/systems/replay";
import { toast } from "sonner";

const ResultsScreen = ({
  beatmapData,
  results,
  replayData,
  retry, 
}: {
  beatmapData: BeatmapData;
  results: PlayResults;
  replayData: ReplayData | null;
  retry: () => void;
}) => {
  const { closeGame, beatmapSet, beatmapId } = useGameContext();
  const { settings } = useSettingsContext();
  const { highScores, setHighScores } = useHighScoresContext();
  const [newHighScore, setNewHighScore] = useState(false);

  // Check for new high score
  useEffect(() => {
    if (!beatmapId || settings.mods.autoplay || results.failed || results.replay) {
      return;
    }

    const beatmapSetId = beatmapSet!.id;

    const previousHighScore =
      highScores[beatmapSet!.id]?.[beatmapId!]?.results.score ?? 0;

    if (results.score > previousHighScore) {
      setHighScores((draft) => {
        draft[beatmapSetId] ??= {};

        draft[beatmapSetId][beatmapId] = {
          timestamp: Date.now(),
          mods: getModStrings(settings),
          results,
        };
      });

      setNewHighScore(true);
    }
  }, [beatmapId, beatmapSet, highScores, results, setHighScores, settings]);

  const beatmap = beatmapSet?.beatmaps.find(
    (beatmap) => beatmap.id === beatmapId,
  );

  const title = settings.preferMetadataInOriginalLanguage
    ? beatmapData.metadata.titleUnicode
    : beatmapData.metadata.title;


  const getgrade = () => { 
    if (results.failed) {
      return "Failed";
    }
    if (results.replay) {
      return "Replay";
    }
    return getLetterGrade(results.accuracy);
  }

  async function downloadReplay(replaydata: ReplayData | null) {
    if (!replaydata) {
      toast.message("Error saving replay", {
        description: "No replay data available",
      });
      return;
    }
  
    try {
      // Convert replay data to a JSON string
      const replayJson = JSON.stringify(replaydata, null, 2);
  
      // Create a Blob from the JSON string
      const blob = new Blob([replayJson], { type: "application/octet-stream" });
  
      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `replay_${timestamp}_${randomString}.womr`;
  
      // Create a link element for downloading
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.click();
  
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
  
      toast.message("Replay saved successfully", {
        description: "The replay has been downloaded.",
      });
    } catch (error) {
      toast.message("An unknown error occurred", {
        description: "Check Console",
      });
      console.error(error);
    }
  }  
  
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
                    {
                      results.replay
                        ? "Replay"
                        : results.failed
                          ? "Failed"
                          : getgrade()
                    }
                  </span>
                </div>

                <div className="h-[1px] grow bg-gradient-to-l from-transparent to-primary"></div>
              </div>

              <div className="mt-16 grid grid-cols-2">
                <Button size={"lg"} onClick={() => closeGame()}>
                  Back
                </Button>
                <Button
                  variant={"secondary"}
                  size={"lg"}
                  className="ml-4"
                  onClick={() => retry()}
                >
                  Retry
                </Button>
                <Button
                  variant={"secondary"}
                  size={"lg"}
                  className="ml-4"
                  disabled={!replayData}
                  onClick={() => downloadReplay(replayData)}
                >
                  Save Replay
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResultsScreen;
