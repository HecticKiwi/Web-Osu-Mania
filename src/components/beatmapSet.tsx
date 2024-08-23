"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { secondsToMMSS } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { DEFAULT_STARS, getStarsParam } from "./filters/difficultyFilter";
import { DEFAULT_MODE, getKeysParam } from "./filters/keysFilter";
import ManiaIcon from "./maniaIcon";
import { AudioContext } from "./providers/audioPreviewProvider";
import { BeatmapSetContext } from "./providers/beatmapSetProvider";
import { GameOverlayContext } from "./providers/gameOverlayProvider";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const BeatmapSet = ({ beatmapSet }: { beatmapSet: BeatmapSetData }) => {
  const { setBeatmapSet } = useContext(BeatmapSetContext);
  const { play, stop } = useContext(AudioContext);
  const { startGame } = useContext(GameOverlayContext);
  const searchParams = useSearchParams();

  const stars = getStarsParam(searchParams);
  const [min, max] = stars.split("-").map((value) => Number(value));

  const mode = getKeysParam(searchParams);
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      play(beatmapSet.id.toString());
    } else {
      stop();
    }
  };

  const onSelectBeatmap = (beatmapId: number) => {
    if (!("indexedDB" in window)) {
      toast({
        title: "Error",
        description:
          "The browser you are using does not support IndexedDB. Please try again in another browser.",
      });

      return;
    }

    startGame(beatmapSet.id, beatmapId);
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="group relative flex h-[150px] flex-col overflow-hidden rounded-xl border p-4 text-start transition-colors focus-within:border-primary hover:border-primary"
          onClick={() => setBeatmapSet(beatmapSet)}
        >
          {/* Background cover */}
          <span
            className={
              "absolute inset-0 -z-10 brightness-[0.3] transition-transform duration-300 group-focus-within:scale-105 group-hover:scale-105"
            }
          >
            <Image
              src={beatmapSet.covers.cover}
              alt="Beatmap Set Cover"
              fill
              priority
              className="object-cover"
              sizes="720px"
            />
          </span>

          <div className="flex w-full justify-end">
            <Button
              asChild
              variant={"secondary"}
              size={"icon"}
              className="h-8 w-8 bg-secondary/60 hover:bg-secondary"
              onClick={(e) => e.stopPropagation()}
              title="Go to osu! beatmap page"
            >
              <Link
                href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
                target="_blank"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Details */}
          <div className="mt-auto line-clamp-1 text-xl font-normal">
            {beatmapSet.title}
          </div>

          <div className="gap flex w-full items-end justify-between gap-8">
            <span className="line-clamp-1 text-base font-normal text-primary">
              by {beatmapSet.artist}
            </span>
            <span className=" text-sm text-muted-foreground">
              {secondsToMMSS(
                Math.max(
                  ...beatmapSet.beatmaps.map((beatmap) => beatmap.total_length),
                ),
              )}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="max-h-[500px] space-y-2 overflow-auto rounded-xl p-2">
        {beatmapSet.beatmaps
          .filter((beatmap) => beatmap.mode === "mania")
          .filter(
            (beatmap) => !mode.length || mode.includes(beatmap.cs.toString()),
          )
          .filter(
            (beatmap) =>
              beatmap.difficulty_rating >= min &&
              beatmap.difficulty_rating <= max,
          )
          .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
          .map((beatmap) => (
            <button
              key={beatmap.id}
              className="flex w-full items-center gap-3 rounded p-2 text-start transition hover:bg-white/5"
              onClick={() => onSelectBeatmap(beatmap.id)}
            >
              <ManiaIcon
                difficultyRating={beatmap.difficulty_rating}
                className="shrink-0"
              />

              <div>
                <p className="line-clamp-1">{beatmap.version}</p>
                <p className="text-muted-foreground">
                  {beatmap.difficulty_rating}★
                </p>
              </div>
            </button>
          ))}
      </PopoverContent>
    </Popover>
  );
};

export default BeatmapSet;
