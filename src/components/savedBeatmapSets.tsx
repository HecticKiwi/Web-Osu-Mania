"use client";

import { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { parseNsfwParam } from "@/lib/searchParams/nsfwParam";
import { parseQueryParam } from "@/lib/searchParams/queryParam";
import {
  parseSortCriteriaParam,
  parseSortDirectionParam,
} from "@/lib/searchParams/sortParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { caseInsensitiveIncludes, cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useSearchParams } from "next/navigation";
import BeatmapSet from "./beatmapSet/beatmapSet";
import { useSavedBeatmapSetsContext } from "./providers/savedBeatmapSetsProvider";
import { useSettingsContext } from "./providers/settingsProvider";

const SavedBeatmapSets = ({ className }: { className?: string }) => {
  const { settings } = useSettingsContext();
  const { savedBeatmapSets } = useSavedBeatmapSetsContext();
  const searchParams = useSearchParams();

  if (savedBeatmapSets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">
          You Haven't Saved any Beatmaps!
        </h1>
        <p className="text-lg text-muted-foreground">
          Save beatmaps by clicking the <Bookmark className="inline" /> icon.
        </p>
      </div>
    );
  }

  const query = parseQueryParam(searchParams.get("q"));
  // const category = parseCategoryParam(searchParams.get("category"));
  const sortCriteria = parseSortCriteriaParam(searchParams.get("sortCriteria"));
  const sortDirection = parseSortDirectionParam(
    searchParams.get("sortDirection"),
  );
  const keys = parseKeysParam(searchParams.get("keys"));
  const stars = parseStarsParam(searchParams.get("stars"));
  const nsfw = parseNsfwParam(searchParams.get("nsfw"));
  // const genre = parseGenreParam(searchParams.get("genre"));
  // const language = parseLanguageParam(searchParams.get("language"));

  const filteredSaves = savedBeatmapSets.filter((beatmapSet) => {
    if (query.trim()) {
      if (
        settings.preferMetadataInOriginalLanguage &&
        !caseInsensitiveIncludes(beatmapSet.title_unicode, query) &&
        !caseInsensitiveIncludes(beatmapSet.artist_unicode, query) &&
        !caseInsensitiveIncludes(beatmapSet.creator, query)
      ) {
        return false;
      }

      if (
        !settings.preferMetadataInOriginalLanguage &&
        !caseInsensitiveIncludes(beatmapSet.title, query) &&
        !caseInsensitiveIncludes(beatmapSet.artist, query) &&
        !caseInsensitiveIncludes(beatmapSet.creator, query)
      ) {
        return false;
      }
    }

    const maniaBeatmaps = beatmapSet.beatmaps.filter(
      (beatmap) => beatmap.mode === "mania",
    );

    if (
      keys.length > 0 &&
      !maniaBeatmaps.some((beatmap) => keys.includes(beatmap.cs.toString()))
    ) {
      return false;
    }

    if (
      !maniaBeatmaps.some(
        (beatmap) =>
          beatmap.difficulty_rating >= stars.min &&
          beatmap.difficulty_rating <= stars.max,
      )
    ) {
      return false;
    }

    if (!nsfw && beatmapSet.nsfw) {
      return false;
    }

    return true;
  });

  if (savedBeatmapSets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">No Saved Beatmaps Found!</h1>
        <p className="text-lg text-muted-foreground">
          Please adjust the filters.
        </p>
      </div>
    );
  }

  let sortedBeatmaps: BeatmapSetData[] = filteredSaves;

  if (sortCriteria === "title") {
    if (settings.preferMetadataInOriginalLanguage) {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.title_unicode.localeCompare(b.title_unicode),
      );
    } else {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }
  } else if (sortCriteria === "artist") {
    if (settings.preferMetadataInOriginalLanguage) {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.artist_unicode.localeCompare(b.artist_unicode),
      );
    } else {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.artist.localeCompare(b.artist),
      );
    }
  }

  if (sortDirection === "desc") {
    sortedBeatmaps = filteredSaves.reverse();
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6",
          className,
        )}
      >
        {sortedBeatmaps.map((beatmapSet) => (
          <BeatmapSet key={beatmapSet.id} beatmapSet={beatmapSet} />
        ))}
      </div>
    </>
  );
};

export default SavedBeatmapSets;
