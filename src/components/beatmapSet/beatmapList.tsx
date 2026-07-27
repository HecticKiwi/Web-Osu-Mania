import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BeatmapSet } from "@/lib/osuApi";
import { DEFAULT_GENRE, GENRE_ID_MAP } from "@/lib/searchParams/genreParam";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_INDEXES,
} from "@/lib/searchParams/languageParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { Route } from "@/routes";
import { Heart, Languages, Play, Tag, UserStar } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";
import { useHighScoresStore } from "../../stores/highScoresStore";
import ManiaIcon from "../maniaIcon";
import TextLink from "../textLink";
import DifficultyBars from "./difficultyBars";
import HighScoreEntry from "./highScoreEntry";

const BeatmapList = ({
  beatmapSet,
  stopPreview,
}: {
  beatmapSet: BeatmapSet;
  stopPreview: () => void;
}) => {
  const setBeatmapSet = useGameStore.use.setBeatmapSet();
  const startGame = useGameStore.use.startGame();
  const highScores = useHighScoresStore.use.highScores();
  const search = Route.useSearch();

  const { min, max } = parseStarsParam(search.stars);
  const keys = parseKeysParam(search.keys);

  const maniaBeatmaps = beatmapSet.beatmaps.filter(
    (beatmap) => beatmap.mode === "mania",
  );

  if (maniaBeatmaps.length === 0) {
    return (
      <div className="flex max-h-125 flex-col gap-2 overflow-hidden rounded-xl">
        <div className="scrollbar scrollbar-track-card flex flex-col gap-2 overflow-auto p-2">
          <p className="text-muted-foreground p-4 text-center text-balance">
            This beatmap set doesn't have any osu!mania beatmaps.
          </p>
        </div>
      </div>
    );
  }

  const filteredBeatmaps = maniaBeatmaps
    .filter(
      // For mania, CS is the keycount (e.g. CS: 4 means 4K)
      (beatmap) => !keys.length || keys.includes(beatmap.cs.toString()),
    )
    .filter((beatmap) => {
      if (min !== null && beatmap.difficulty_rating < min) {
        return false;
      }

      if (max !== null && beatmap.difficulty_rating > max) {
        return false;
      }

      return true;
    });

  const genre =
    Object.entries(GENRE_ID_MAP).find(
      ([_, value]) => value === beatmapSet.genre_id,
    )?.[0] || DEFAULT_GENRE;

  const language =
    LANGUAGE_INDEXES.entries().find(
      ([_, value]) => value === beatmapSet.language_id,
    )?.[0] || DEFAULT_LANGUAGE;

  return (
    <div className="flex max-h-125 flex-col overflow-hidden rounded-xl">
      {beatmapSet.play_count != null && (
        <div className="bg-background p-2 text-sm">
          <div className="flex justify-center gap-4 font-mono">
            <div className="flex items-center gap-1">
              <Play className="size-4" />
              <span className="text-muted-foreground">
                {beatmapSet.play_count.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Heart className="size-4" />
              <span className="text-muted-foreground">
                {beatmapSet.favourite_count.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <UserStar className="size-4" />
              <span className="text-muted-foreground">
                {beatmapSet.rating.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-1 text-xs">
            <span className="bg-primary/25 inline-flex items-center gap-1 rounded-full px-3 py-0.5">
              <Tag className="size-3" /> {genre}
            </span>
            <span className="bg-primary/25 inline-flex items-center gap-1 rounded-full px-3 py-0.5">
              <Languages className="size-3" /> {language}
            </span>
          </div>
        </div>
      )}

      <div className="scrollbar scrollbar-track-card flex flex-col gap-2 overflow-auto p-2">
        {filteredBeatmaps.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-balance">
            No beatmaps found matching your filters. Please adjust or{" "}
            <TextLink to={"/"}>reset</TextLink> your filters.
          </p>
        )}
        {filteredBeatmaps.length > 0 &&
          filteredBeatmaps
            .sort((a, b) => a.difficulty_rating - b.difficulty_rating)
            .map((beatmap) => {
              const beatmapScores =
                beatmapSet.status === "local"
                  ? []
                  : (highScores[beatmapSet.id]?.[beatmap.id] ?? []);

              return (
                <div key={beatmap.id}>
                  <div
                    className="cursor-pointer rounded bg-slate-500/5 p-2 text-start transition hover:bg-white/5"
                    onClick={() => {
                      stopPreview();
                      setBeatmapSet(beatmapSet);
                      startGame(beatmap.id);
                    }}
                  >
                    <div className="flex gap-3">
                      <ManiaIcon
                        difficultyRating={beatmap.difficulty_rating}
                        className="shrink-0"
                      />

                      <div className="grow overflow-hidden">
                        <button
                          className="max-w-full truncate text-start"
                          title={beatmap.version}
                        >
                          {beatmap.version}
                        </button>

                        <div className="flex items-center font-mono">
                          <span className="text-muted-foreground text-sm">
                            {beatmap.difficulty_rating.toFixed(2)}★
                          </span>
                        </div>
                      </div>
                    </div>

                    <DifficultyBars
                      taps={beatmap.count_circles}
                      holds={beatmap.count_sliders}
                      od={beatmap.accuracy}
                      hp={beatmap.drain}
                    />
                  </div>

                  {beatmapScores.length > 0 && (
                    <Accordion type="single" collapsible className="mt-0.5">
                      <AccordionItem value="scores" className="border-none">
                        <AccordionTrigger className="text-muted-foreground p-0 px-2 text-sm">
                          {beatmapScores.length} High Score
                          {beatmapScores.length === 1 ? "" : "s"}
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="">
                            {beatmapScores?.map((score, i) => (
                              <HighScoreEntry
                                key={i}
                                position={i + 1}
                                highScore={score}
                                beatmapSet={beatmapSet}
                                beatmap={beatmap}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default BeatmapList;
