import { cn, formatTime } from "@/lib/utils";
import type { Game } from "@/osuMania/game";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
  RotateCcw,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ReplayControls = ({ game }: { game: Game }) => {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRateMult, setPlaybackRateMult] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    game.song.on("play", () => {
      setIsPlaying(true);
    });
    game.song.on("pause", () => {
      setIsPlaying(false);
    });
  }, [game]);

  useEffect(() => {
    if (isDragging) {
      return;
    }

    let animationFrame: number;

    const updateProgress = () => {
      const percentage = Math.min(
        (game.timeElapsed - game.startTime) / (game.endTime - game.startTime),
        1,
      );
      setProgress(percentage);

      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [game, isDragging]);

  // Close if clicking outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const openPanel = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const scheduleClose = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const currentTime = formatTime(progress * (game.endTime - game.startTime));
  const timeRemaining = formatTime(
    (1 - progress) * (game.endTime - game.startTime),
  );

  return (
    <div
      ref={containerRef}
      className="fixed bottom-7.5 left-7.5"
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
    >
      {/* Panel trigger */}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        variant={"outline"}
        className={cn(
          `bg-card/50 size-12 rounded-full p-0`,
          isOpen && "pointer-events-none opacity-0",
        )}
      >
        <Video className="size-6" />
      </Button>

      {/* Expanded panel */}
      <div
        className={cn(
          "bg-background fixed right-7.5 bottom-7.5 left-7.5 max-w-fit origin-bottom-left scale-0 rounded-lg border p-2 pb-4 opacity-0 transition-all",
          isOpen && "scale-100 opacity-100",
        )}
      >
        <div className="bg-card rounded-md p-2">
          {/* Time display */}
          <div className="text-muted-foreground grid grid-cols-3">
            <span className="font-mono text-sm">{currentTime}</span>
            <span className="text-primary text-center text-base font-bold">
              {Math.round(Math.max(progress, 0) * 100)}%
            </span>
            <span className="text-end font-mono text-sm">{timeRemaining}</span>
          </div>

          {/* Progress slider */}
          <Slider
            className="my-3"
            onValueChange={([value]) => {
              setIsDragging(true);
              setProgress(value);
            }}
            onValueCommit={(value) => {
              const timeMs =
                value[0] * (game.endTime - game.startTime) + game.startTime;
              game.seek(timeMs / 1000);
              setIsDragging(false);
            }}
            value={[progress]}
            min={0}
            max={1}
            step={0.001}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {/* Play/pause and seek buttons */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-8 p-0"
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      game.seek(game.song.seek() - 10);
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                  >
                    <ChevronsLeft />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Seek backward 10 seconds</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-8 p-0"
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      game.seek(game.song.seek() - 1);
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                  >
                    <ChevronLeft />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Seek backward 1 second</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="mx-1 size-12 rounded-full p-0"
                    onClick={() => {
                      if (isPlaying) {
                        game.pause();
                      } else {
                        game.resume();
                      }
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                  >
                    {isPlaying ? (
                      <Pause fill="currentColor" />
                    ) : (
                      <Play fill="currentColor" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? "Pause" : "Play"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-8 p-0"
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      game.seek(game.song.seek() + 1);
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                  >
                    <ChevronRight />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Seek forward 1 second</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className="size-8 p-0"
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      game.seek(game.song.seek() + 10);
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                  >
                    <ChevronsRight />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Seek forward 10 seconds</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-1.5">
            <span className="w-8 text-right font-mono text-[10px] text-zinc-400 tabular-nums">
              {playbackRateMult.toFixed(2)}x
            </span>
            <Slider
              className="w-20"
              onValueChange={([value]) => {
                setPlaybackRateMult(value);

                const playbackRate = game.mods.playbackRate * value;
                game.song.rate(playbackRate);
                if (game.videoEl) {
                  // eslint-disable-next-line react-hooks/immutability
                  game.videoEl.playbackRate = playbackRate;
                }
              }}
              value={[playbackRateMult]}
              min={0.05}
              max={2}
              step={0.05}
            />

            <Button
              variant={"ghost"}
              className="text-primary size-6 p-0"
              onClick={() => {
                setPlaybackRateMult(1);
                game.song.rate(game.mods.playbackRate);
                if (game.videoEl) {
                  // eslint-disable-next-line react-hooks/immutability
                  game.videoEl.playbackRate = 1;
                }
              }}
              disabled={playbackRateMult === 1}
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayControls;
