"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import { getModStrings } from "@/lib/utils";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/button";

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

  return (
    <>
      {/* Inset of -1px since it wasn't covering the top for some reason */}
      <div className="fixed -top-[1px] left-0 h-[calc(100dvh+1px)] w-dvw overflow-auto bg-background/90 duration-300 animate-in fade-in scrollbar">
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
              {getModStrings(mods, replayData?.mods).map((mod) => (
                <span
                  key={mod}
                  className="rounded-full bg-primary/25 px-2 py-0.5"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-12">
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
        </main>
      </div>
    </>
  );
};

export default PauseScreen;
