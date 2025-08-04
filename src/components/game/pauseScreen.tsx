"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import { getModStrings } from "@/lib/utils";
import { Fullscreen } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapSetPageButton from "../beatmapSet/beatmapPageButton";
import SaveBeatmapSetButton from "../beatmapSet/saveBeatmapSetButton";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const PauseScreen = ({
  beatmapData,
  setIsPaused,
  retry,
}: {
  beatmapData: BeatmapData;
  setIsPaused: (newValue: boolean) => void;
  retry: () => void;
}) => {
  const closeGame = useGameStore.use.closeGame();
  const beatmapSet = useGameStore.use.beatmapSet();
  const beatmapId = useGameStore.use.beatmapId();
  const replayData = useGameStore.use.replayData();
  const preferMetadataInOriginalLanguage =
    useSettingsStore.use.preferMetadataInOriginalLanguage();
  const mods = useSettingsStore.use.mods();

  const beatmap = beatmapSet?.beatmaps.find(
    (beatmap) => beatmap.id === beatmapId,
  );

  const title = preferMetadataInOriginalLanguage
    ? beatmapData.metadata.titleUnicode
    : beatmapData.metadata.title;

  function handleFullscreen() {
    const gameDiv = document.getElementById("game");

    if (!document.fullscreenElement && gameDiv) {
      gameDiv.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen Error",
          description: `Failed to enable fullscreen mode: ${err.message}`,
        });
      });
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <>
      {/* Inset of -1px since it wasn't covering the top for some reason */}
      <div className="fixed -inset-y-[1px] left-0 h-[calc(100dvh+2px)] w-dvw overflow-auto bg-background/90 duration-300 animate-in fade-in scrollbar">
        <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-center p-8">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
            <div>
              <h1 className="text-3xl font-semibold md:text-5xl">{title}</h1>

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

          <Button
            className="mt-16 max-w-fit gap-2 text-xl"
            onClick={handleFullscreen}
            variant={"outline"}
          >
            <Fullscreen />
            Fullscreen
          </Button>

          <div className="mt-8 flex flex-col gap-12">
            <Button
              className="h-20 text-2xl font-semibold lg:h-28"
              onClick={() => setIsPaused(false)}
            >
              Continue
            </Button>
            <Button
              className="h-20 text-2xl font-semibold lg:h-28"
              variant={"secondary"}
              onClick={() => retry()}
            >
              Retry
            </Button>
            <Button
              className="h-20 text-2xl font-semibold lg:h-28"
              variant={"destructive"}
              onClick={() => closeGame()}
            >
              Quit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PauseScreen;
