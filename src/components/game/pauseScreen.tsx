"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import { useGameContext } from "../providers/gameOverlayProvider";
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

  return (
    <>
      {/* Inset of -1px since it wasn't covering the top for some reason */}
      <div className="fixed inset-0 -top-[1px] overflow-auto bg-background/90 duration-300 animate-in fade-in scrollbar">
        <main className="mx-auto flex min-h-screen max-w-screen-xl flex-col justify-center p-8">
          <h1 className="text-5xl font-semibold">
            {beatmapData.metadata.artist} - {beatmapData.metadata.title}
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
