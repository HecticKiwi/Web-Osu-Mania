import type { BeatmapSet } from "@/lib/osuApi";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { Route } from "@/routes";

export const useFilteredBeatmaps = (beatmapSet: BeatmapSet) => {
  const search = Route.useSearch();
  const { min, max } = parseStarsParam(search.stars);
  const keys = parseKeysParam(search.keys);

  const maniaBeatmaps = beatmapSet.beatmaps.filter(
    (beatmap) => beatmap.mode === "mania",
  );

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

  return filteredBeatmaps.sort(
    (a, b) => a.difficulty_rating - b.difficulty_rating,
  );
};
