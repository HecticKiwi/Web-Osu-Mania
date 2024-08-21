"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import PauseScreen from "./pauseScreen";
import ResultsScreen from "./resultsScreen";
import { useEffect, useRef, useState } from "react";
import { Game } from "@/osuMania/game";
import { Results } from "@/types";
import Volume from "./volume";

const GameScreens = ({
  mapData,
  retry,
}: {
  mapData: BeatmapData;
  retry: () => void;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const [game, setGame] = useState<Game | null>(null);
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    const game = new Game(mapData, setResults);
    setGame(game);
    game.main(containerRef.current);

    return () => {
      Howler.stop();

      game.dispose();
    };
  }, [mapData]);

  useEffect(() => {
    if (isPaused) {
      game?.pause();
    } else if (game?.state === "PAUSE") {
      if (game.song.seek() === 0) {
        game.state = "WAIT";
      } else {
        game?.play();
      }
    }
  }, [isPaused, game]);

  useEffect(() => {
    const handlePause = (event: KeyboardEvent) => {
      if (!results && event.key === "Escape" && !event.repeat) {
        setIsPaused((prev) => !prev);
      }
    };

    const handleVisibilityChange = (event: Event) => {
      if (!results && document.hidden) {
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
      <div ref={containerRef} className="h-full w-full select-none ">
        {game && <Volume game={game} />}
        {isPaused && (
          <PauseScreen
            mapData={mapData}
            setIsPaused={setIsPaused}
            retry={retry}
          />
        )}
        {results && (
          <ResultsScreen mapData={mapData} results={results} retry={retry} />
        )}
      </div>
    </>
  );
};

export default GameScreens;
