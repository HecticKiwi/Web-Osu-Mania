"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import PauseScreen from "./pauseScreen";
import ResultsScreen from "./resultsScreen";
import { useEffect, useRef, useState } from "react";
import { Game } from "@/osuMania/game";
import { Results } from "@/types";
import VolumeWidget from "./volumeWidget";

const GameScreens = ({
  beatmapData,
  retry,
}: {
  beatmapData: BeatmapData;
  retry: () => void;
}) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  // Game creation
  useEffect(() => {
    const game = new Game(beatmapData, setResults);
    setGame(game);
    game.main(containerRef.current);

    return () => {
      Howler.stop();

      game.dispose();
    };
  }, [beatmapData]);

  // Pause logic
  useEffect(() => {
    if (isPaused) {
      game?.pause();
    } else if (game?.state === "PAUSE") {
      if (game.song.seek() === 0) {
        game.state = "WAIT";
      } else {
        game.play();
      }
    }
  }, [isPaused, game]);

  // Event listeners
  useEffect(() => {
    // No need for listeners if on the results screen
    if (results) {
      return;
    }

    const handlePause = (event: KeyboardEvent) => {
      if (event.code === "Escape" && !event.repeat) {
        setIsPaused((prev) => !prev);
      }
    };

    const handleVisibilityChange = (event: Event) => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };

    document.addEventListener("keydown", handlePause);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handlePause);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [results]);

  return (
    <>
      <div ref={containerRef} className="h-full w-full">
        {game && !results && <VolumeWidget game={game} />}
        {isPaused && (
          <PauseScreen
            beatmapData={beatmapData}
            setIsPaused={setIsPaused}
            retry={retry}
          />
        )}
        {results && (
          <ResultsScreen
            beatmapData={beatmapData}
            results={results}
            retry={retry}
          />
        )}
      </div>
    </>
  );
};

export default GameScreens;
