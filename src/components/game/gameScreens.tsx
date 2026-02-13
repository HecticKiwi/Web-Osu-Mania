import { BeatmapData } from "@/lib/beatmapParser";
import { Game } from "@/osuMania/game";
import { useSettingsStore } from "@/stores/settingsStore";
import { PlayResults } from "@/types";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGameStore } from "../../stores/gameStore";
import PauseButton from "./pauseButton";
import PauseScreen from "./pauseScreen";
import ResultsScreen from "./resultsScreen";
import RetryWidget from "./retryWidget";
import VolumeWidget from "./volumeWidget";

const GameScreens = ({
  beatmapData,
  retry,
  videoRef,
  showHud,
  setShowHud,
}: {
  beatmapData: BeatmapData;
  retry: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
  showHud: boolean;
  setShowHud: Dispatch<SetStateAction<boolean>>;
}) => {
  const beatmapId = useGameStore.use.beatmapId();
  const keybinds = useSettingsStore.use.keybinds();
  const replayData = useGameStore.use.replayData();
  const [game, setGame] = useState<Game | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<PlayResults | null>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  const toggleHud = useCallback(() => {
    const newValue = !showHud;
    setShowHud(newValue);

    if (game) {
      game.setShowHud(newValue);
    }
  }, [game, showHud]);

  // Game creation
  useEffect(() => {
    if (!beatmapId) {
      // Don't create game when closing modal and beatmap ID is nulled
      return;
    }

    const game = new Game(
      beatmapData,
      setResults,
      setIsPaused,
      replayData,
      retry,
      videoRef.current,
    );
    setGame(game);
    game.main(containerRef.current, showHud);

    return () => {
      Howler.stop();

      game.dispose();

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [beatmapData, replayData, retry, beatmapId]);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === keybinds.toggleHud && !event.repeat) {
        toggleHud();
      }
    };

    const handleVisibilityChange = (event: Event) => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };

    addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [keybinds, results, toggleHud]);

  return (
    <>
      <div ref={containerRef} className="absolute h-full w-full">
        {game && !results && <VolumeWidget game={game} />}
        {game && !results && <RetryWidget retry={retry} />}
        {game && !results && <PauseButton setIsPaused={setIsPaused} />}

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
