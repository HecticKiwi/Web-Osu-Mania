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
import ManiaIcon from "./maniaIcon";
import { useAudioContext } from "./providers/audioPreviewProvider";
import { useGameContext } from "./providers/gameOverlayProvider";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";

const BeatmapSet = ({ beatmapSet }: { beatmapSet: BeatmapSetData }) => {
  const { play, stop } = useAudioContext();
  const { startGame } = useGameContext();

  const searchParams = useSearchParams();

  const { min, max } = parseStarsParam(searchParams.get("stars"));

  const keys = parseKeysParam(searchParams.get("keys"));

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      play(beatmapSet.id);
    } else {
      stop();
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="group relative flex h-[150px] flex-col overflow-hidden rounded-xl border p-4 text-start transition-colors duration-300 focus-within:border-primary hover:border-primary">
          {/* Background cover */}
          <span
            className={
              "absolute inset-0 -z-10 brightness-[0.3] transition duration-300 group-focus-within:brightness-[0.5] group-hover:brightness-[0.5]"
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

          <Button
            asChild
            variant={"secondary"}
            size={"icon"}
            className="h-8 w-8 self-end bg-secondary/60 focus-within:bg-secondary hover:bg-secondary"
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

          {/* Details */}
          <div className="mt-auto line-clamp-1 text-xl">{beatmapSet.title}</div>
          <div className="flex w-full items-end justify-between gap-8">
            <span className="line-clamp-1 text-primary">
              by {beatmapSet.artist}
            </span>
            <span className="text-sm text-muted-foreground">
              {secondsToMMSS(
                Math.max(
                  ...beatmapSet.beatmaps.map((beatmap) => beatmap.total_length),
                ),
              )}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex max-h-[500px] flex-col gap-2 overflow-hidden rounded-xl p-0">
        <div className="flex flex-col gap-2 overflow-auto p-2 scrollbar scrollbar-track-card">
          {beatmapSet.beatmaps
            .filter((beatmap) => beatmap.mode === "mania")
            .filter(
              // For mania, CS is the keycount (e.g. CS: 4 means 4K)
              (beatmap) => !keys.length || keys.includes(beatmap.cs.toString()),
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
                className="flex items-center gap-3 rounded p-2 text-start transition hover:bg-white/5"
                onClick={() => startGame(beatmapSet.id, beatmap.id)}
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BeatmapSet;
