import type { BeatmapData } from "@/lib/beatmapParser";
import { cn } from "@/lib/utils";
import { Game } from "@/osuMania/game";
import type { ReplayData } from "@/osuMania/systems/replayRecorder";
import { useSettingsStore } from "@/stores/settingsStore";
import type { PlayResults } from "@/types";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import PauseButton from "./pauseButton";
import PauseScreen from "./pauseScreen";
import ReplayControls from "./replayControls";
import ResultsScreen from "./resultsScreen";
import RetryWidget from "./retryWidget";
import VolumeWidget from "./volumeWidget";

const GameScreens = ({
  beatmapData,
  replayData,
  retry,
  videoRef,
  showHud,
  setShowHud,
}: {
  beatmapData: BeatmapData;
  replayData: ReplayData | null;
  retry: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
  showHud: boolean;
  setShowHud: Dispatch<SetStateAction<boolean>>;
}) => {
  const backgroundDim = useSettingsStore.use.backgroundDim();
  const backgroundBlur = useSettingsStore.use.backgroundBlur();
  const lightenBackgroundDuringBreaks =
    useSettingsStore.use.lightenBackgroundDuringBreaks();
  const beatmapId = useGameStore.use.beatmapId();
  const keybinds = useSettingsStore.use.keybinds();
  const [game, setGame] = useState<Game | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<PlayResults | null>(null);
  const [hideCursor, setHideCursor] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const initialShowHudRef = useRef(showHud);

  const toggleHud = useCallback(() => {
    setShowHud((prev) => {
      const newValue = !prev;

      if (game) {
        game.setShowHud(newValue);
      }

      return newValue;
    });
  }, [game, setShowHud]);

  // Game creation
  useEffect(() => {
    if (!beatmapId) {
      // Don't create game when closing modal and beatmap ID is nulled
      return;
    }

    const videoEl = videoRef.current;

    const gameInstance = new Game(
      beatmapData,
      setResults,
      setIsPaused,
      replayData,
      retry,
      videoEl,
    );
    let cancelled = false;

    gameInstance
      .main(containerRef.current, initialShowHudRef.current)
      .then(() => {
        if (!cancelled) {
          setGame(gameInstance);
        }
      });

    return () => {
      cancelled = true;
      Howler.stop();

      gameInstance.dispose();

      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    };
  }, [beatmapData, replayData, retry, beatmapId, videoRef]);

  // Pause logic
  useEffect(() => {
    if (!game) {
      return;
    }

    if (isPaused) {
      game.pause();
    } else if (game.state === "PAUSE") {
      game.resume();
    }
  }, [isPaused, game]);

  // Event listeners
  useEffect(() => {
    // No need for listeners if on the results screen
    if (results) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.code !== "Escape") {
        setHideCursor(true);
      }

      if (event.code === keybinds.toggleHud) {
        toggleHud();
      }
    };

    const handleMouseMove = () => {
      setHideCursor(false);
    };

    const handleVisibilityChange = (event: Event) => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };

    addEventListener("keydown", handleKeyDown);
    addEventListener("mousemove", handleMouseMove);
    addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      removeEventListener("mousemove", handleMouseMove);
      removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [keybinds, results, toggleHud]);

  const initialBackgroundDim = lightenBackgroundDuringBreaks
    ? backgroundDim * 0.5
    : backgroundDim;

  return (
    <>
      {beatmapData.backgroundUrl && !beatmapData.videoUrl && (
        <img
          src={beatmapData.backgroundUrl}
          alt="Beatmap Background"
          className="h-full w-full object-cover select-none"
          style={{
            filter: game
              ? `blur(${backgroundBlur * 30}px)`
              : // The dim must be temporarily applied here before the PIXI app loads
                `brightness(${1 - initialBackgroundDim}) blur(${backgroundBlur * 30}px)`,
          }}
        />
      )}

      <div
        ref={containerRef}
        className={cn(
          "absolute h-full w-full",
          hideCursor && !results && "cursor-none",
        )}
      >
        {game && !results && <VolumeWidget game={game} />}
        {game && !results && <RetryWidget retry={retry} />}
        {game && !results && <PauseButton setIsPaused={setIsPaused} />}
        {game && !results && replayData && <ReplayControls game={game} />}

        {isPaused && game && (
          <PauseScreen
            beatmapData={beatmapData}
            setIsPaused={setIsPaused}
            retry={retry}
            showHud={showHud}
            toggleHud={toggleHud}
          />
        )}
        {results && (
          <ResultsScreen
            beatmapData={beatmapData}
            playResults={results}
            retry={retry}
          />
        )}
      </div>
    </>
  );
};

export default GameScreens;
