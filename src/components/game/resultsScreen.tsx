import { BeatmapData } from "@/lib/beatmapParser";
import { Results } from "@/types";
import { useContext } from "react";
import { GameOverlayContext } from "../providers/gameOverlayProvider";
import { Button } from "../ui/button";

const ResultsScreen = ({
  mapData,
  results,
  retry,
}: {
  mapData: BeatmapData;
  results: Results;
  retry: () => void;
}) => {
  const { closeGame } = useContext(GameOverlayContext);

  return (
    <>
      <div className="fixed left-0 top-0 flex min-h-[100dvh] w-full items-center bg-background duration-1000 animate-in fade-in">
        <main className="mx-auto max-w-screen-xl p-8">
          <h1 className="text-5xl font-semibold">
            {mapData.metadata.artist} - {mapData.metadata.title}
          </h1>
          <div className="mt-1 text-2xl text-muted-foreground">
            Beatmap by {mapData.metadata.creator}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="grid gap-6">
              <div className="rounded-xl border p-8">
                <h2 className="mb-4 text-3xl font-semibold text-primary">
                  Score
                </h2>
                <span className="text-5xl">{Math.round(results.score)}</span>
              </div>

              <div className="rounded-xl border p-8">
                <h2 className="mb-4 text-3xl font-semibold text-primary">
                  Breakdown
                </h2>

                <div className="grid grid-cols-2 gap-4 text-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-orange-300">300</span>
                    <span className="text-5xl">{results[300]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-b from-blue-300 via-green-300 to-orange-300 bg-clip-text text-transparent">
                      300
                    </span>
                    <span className="text-5xl">{results[320]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-b text-green-300">200</span>
                    <span className="text-5xl">{results[200]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-b text-sky-300">100</span>
                    <span className="text-5xl">{results[100]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-b text-slate-300">50</span>
                    <span className="text-5xl">{results[50]}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-b text-rose-300">
                      miss!
                    </span>
                    <span className="text-5xl">{results[200]}x</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl border p-8">
                  <div>
                    <h3 className="mb-4 text-3xl font-semibold text-primary">
                      Max Combo
                    </h3>
                    <span className="text-5xl">{results.maxCombo}x</span>
                  </div>
                </div>
                <div className="rounded-xl border p-8">
                  <div>
                    <h3 className="mb-4 text-3xl font-semibold text-primary">
                      Accuracy
                    </h3>
                    <span className="text-5xl">
                      {(results.accuracy * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-8">
              <h3 className="mb-4 text-3xl font-semibold text-primary">
                Grade
              </h3>
              <div className="text-center text-[200px]">
                {results.accuracy === 1 ? (
                  <span>SS</span>
                ) : results.accuracy > 0.95 ? (
                  <span>S</span>
                ) : results.accuracy > 0.9 ? (
                  <span>A</span>
                ) : results.accuracy > 0.8 ? (
                  <span>B</span>
                ) : results.accuracy > 0.7 ? (
                  <span>C</span>
                ) : (
                  <span>D</span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant={"secondary"}
            size={"lg"}
            className="mt-8"
            onClick={() => closeGame()}
          >
            Back
          </Button>
          <Button
            variant={"default"}
            size={"lg"}
            className="ml-4 mt-8"
            onClick={() => retry()}
          >
            Retry
          </Button>
        </main>
      </div>
    </>
  );
};

export default ResultsScreen;
