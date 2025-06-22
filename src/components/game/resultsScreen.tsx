import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BeatmapData } from "@/lib/beatmapParser";
import { idb } from "@/lib/idb";
import { downloadReplay } from "@/lib/replay";
import { downloadResults, getReplayFilename } from "@/lib/results";
import { getModStrings } from "@/lib/utils";
import { PlayResults } from "@/types";
import { Camera, MoveLeft, Play, Repeat, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { useHighScoresStore } from "../../stores/highScoresStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/button";
import Results from "./results";

const ResultsScreen = ({
  beatmapData,
  playResults,
  retry,
}: {
  beatmapData: BeatmapData;
  playResults: PlayResults;
  retry: () => void;
}) => {
  const closeGame = useGameStore.use.closeGame();
  const beatmapSet = useGameStore.use.beatmapSet();
  const beatmapId = useGameStore.use.beatmapId();
  const setReplayData = useGameStore.use.setReplayData();
  const mods = useSettingsStore.use.mods();
  const highScores = useHighScoresStore.use.highScores();
  const setHighScores = useHighScoresStore.use.setHighScores();
  const [newHighScore, setNewHighScore] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);

  // Check for new high score
  useEffect(() => {
    if (!beatmapId || !beatmapSet || mods.autoplay || playResults.failed) {
      return;
    }

    const checkNewHighScore = async () => {
      const beatmapSetId = beatmapSet.id;

      const previousHighScore =
        highScores[beatmapSetId]?.[beatmapId]?.results.score ?? 0;

      if (playResults.score > previousHighScore && playResults.replayData) {
        await idb.saveReplay(playResults.replayData, beatmapId.toString());

        // Trim out properties that don't need to be saved
        const { failed, viewingReplay, replayData, hitErrors, ...results } =
          playResults;

        setHighScores((draft) => {
          draft[beatmapSetId] ??= {};

          draft[beatmapSetId][beatmapId] = {
            timestamp: replayData.timestamp!,
            mods: getModStrings(mods),
            results,
            replayId: beatmapId.toString(),
          };
        });

        setNewHighScore(true);
      }
    };

    checkNewHighScore();
  }, [beatmapId, beatmapSet, highScores, playResults, setHighScores, mods]);

  return (
    <>
      {/* Top of -1px since it wasn't covering the top for some reason */}
      <div className="fixed inset-0 -inset-y-[1px] overflow-auto bg-background duration-1000 animate-in fade-in scrollbar">
        {/* Hidden results at a fixed width for getting screenshots */}
        <div className="max-h-[0px] overflow-hidden" aria-hidden tabIndex={-1}>
          <div ref={hiddenRef} className="w-[1280px]">
            <Results
              beatmapData={beatmapData}
              playResults={playResults}
              newHighScore={newHighScore}
            />
          </div>
        </div>

        <Results
          beatmapData={beatmapData}
          playResults={playResults}
          newHighScore={newHighScore}
          responsive
        />

        {/* Footer actions */}
        <div className="mx-auto mt-8 flex max-w-screen-xl flex-col justify-center p-8 pt-0">
          <div className="flex flex-wrap items-center justify-between gap-8">
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

            <div className="flex gap-4">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="text-xl"
                      onClick={() => {
                        if (!hiddenRef.current) {
                          return;
                        }

                        const filename = `${getReplayFilename(beatmapData, playResults)}.png`;
                        downloadResults(hiddenRef.current, filename);
                      }}
                    >
                      <Camera />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Results</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {playResults.replayData && (
                <div className="rounded-md outline outline-1 outline-border">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="rounded-r-none text-xl"
                          onClick={() => {
                            setReplayData(playResults.replayData!);
                            retry();
                          }}
                        >
                          <Play />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Watch Replay</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className="rounded-l-none border-l text-xl"
                          onClick={() =>
                            downloadReplay(
                              playResults.replayData!,
                              beatmapData,
                              playResults,
                            )
                          }
                        >
                          <Save />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download Replay</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsScreen;
