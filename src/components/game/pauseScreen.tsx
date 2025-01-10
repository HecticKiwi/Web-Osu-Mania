"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import { useGameContext } from "../providers/gameProvider";
import { useSettingsContext } from "../providers/settingsProvider";
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
      {/* Inset of -1px since it wasn't covering the top for some reason */}
      <div className="fixed -top-[1px] left-0 h-[calc(100dvh+1px)] w-dvw overflow-auto bg-background/90 duration-300 animate-in fade-in scrollbar">
        <main className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-center p-8">
          <h1 className="text-3xl font-semibold md:text-5xl">
            {artist} - {title} [{beatmapData.metadata.version}]
          </h1>
          <div className="mt-1 text-2xl text-muted-foreground">
            Beatmap by {beatmapData.metadata.creator}
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
