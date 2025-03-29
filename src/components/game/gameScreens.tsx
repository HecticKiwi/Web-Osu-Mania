"use client";

import { BeatmapData } from "@/lib/beatmapParser";
import { Game } from "@/osuMania/game";
import { PlayResults } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useSettingsContext } from "../providers/settingsProvider";
import PauseButton from "./pauseButton";
import PauseScreen from "./pauseScreen";
import ResultsScreen from "./resultsScreen";
import RetryWidget from "./retryWidget";
import VolumeWidget from "./volumeWidget";
import { ReplayData } from "@/osuMania/systems/replay";

const GameScreens = ({
  beatmapData,
  retry,
}: {
  beatmapData: BeatmapData;
  retry: () => void;
}) => {
  const { settings } = useSettingsContext();
  const [game, setGame] = useState<Game | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<PlayResults | null>(null);
  const [replayData, setReplayData] = useState<ReplayData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  // Game creation
  useEffect(() => {
    const game = new Game(beatmapData, setResults, setIsPaused, setReplayData);
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

    const handleVisibilityChange = (event: Event) => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [results, settings.keybinds.pause]);

  return (
    <>
      <div ref={containerRef} className="h-full w-full">
        {game && !results && <VolumeWidget game={game} />}
        {game && !results && <RetryWidget retry={retry} />}
        {game && !results && <PauseButton setIsPaused={setIsPaused} />}

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
            replayData={replayData}
            retry={retry}
          />
        )}
      </div>
    </>
  );
};

export default GameScreens;
