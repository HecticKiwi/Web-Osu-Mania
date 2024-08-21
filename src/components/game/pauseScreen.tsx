"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import { useContext } from "react";
import { GameOverlayContext } from "../providers/gameOverlayProvider";
import { Button } from "../ui/button";

const PauseScreen = ({
  mapData,
  setIsPaused,
  retry,
}: {
  mapData: BeatmapData;
  setIsPaused: (newValue: boolean) => void;
  retry: () => void;
}) => {
  const { closeGame } = useContext(GameOverlayContext);

  return (
    <>
      <div className="fixed inset-0 bg-background/90 duration-300 animate-in fade-in">
        <main className="mx-auto mt-16 max-w-screen-xl p-8">
          <h1 className="text-5xl font-semibold">
            {mapData.metadata.artist} - {mapData.metadata.title}
          </h1>
          <div className="mt-1 text-2xl text-muted-foreground">
            Beatmap by {mapData.metadata.creator}
          </div>

          <div className="mt-16 space-y-12">
            <Button
              className="h-28 w-full text-2xl font-semibold"
              onClick={() => setIsPaused(false)}
            >
              Continue
            </Button>
            <Button
              className="h-28 w-full text-2xl font-semibold"
              variant={"secondary"}
              onClick={() => retry()}
            >
              Retry
            </Button>
            <Button
              className="h-28 w-full text-2xl font-semibold"
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
