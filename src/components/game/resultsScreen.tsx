import { BeatmapData } from "@/lib/beatmapParser";
import { Results } from "@/types";
import { useGameContext } from "../providers/gameProvider";
import { useSettingsContext } from "../providers/settingsProvider";
import { Button } from "../ui/button";

const ResultsScreen = ({
  beatmapData,
  results,
  retry,
}: {
  beatmapData: BeatmapData;
  results: Results;
  retry: () => void;
}) => {
  const { closeGame } = useGameContext();
  const { settings } = useSettingsContext();

  const artist = settings.preferMetadataInOriginalLanguage
    ? beatmapData.metadata.artistUnicode
    : beatmapData.metadata.artist;

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

          <div className="mt-3 flex w-fit items-center gap-2 rounded border bg-card p-1.5">
            <p className="text-yellow-400">{1.24}★</p>
            <p className="line-clamp-1">{beatmapData.metadata.version}</p>
          </div>

          <div className="mt-8">
            <div className="grid gap-6 gap-y-12 rounded-xl border bg-card p-8 xl:grid-cols-2">
              <div className="grid gap-6">
                <div className="rounded-xl">
                  <h2 className="mb-4 text-3xl font-semibold text-primary">
                    Score
                  </h2>
                  <span className="text-5xl">{Math.round(results.score)}</span>
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
                    {results.accuracy === 1
                      ? "SS"
                      : results.accuracy > 0.95
                        ? "S"
                        : results.accuracy > 0.9
                          ? "A"
                          : results.accuracy > 0.8
                            ? "B"
                            : results.accuracy > 0.7
                              ? "C"
                              : "D"}
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResultsScreen;
