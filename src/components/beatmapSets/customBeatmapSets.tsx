import type { BeatmapSet as BeatmapSetData } from "@/lib/osuApi";
import { GENRE_ID_MAP, parseGenreParam } from "@/lib/searchParams/genreParam";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import {
  LANGUAGE_INDEXES,
  parseLanguageParam,
} from "@/lib/searchParams/languageParam";
import { parseNsfwParam } from "@/lib/searchParams/nsfwParam";
import { parseQueryParam } from "@/lib/searchParams/queryParam";
import {
  parseSortCriteriaParam,
  parseSortDirectionParam,
} from "@/lib/searchParams/sortParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { caseInsensitiveIncludes, cn } from "@/lib/utils";
import { Route } from "@/routes";
import type { ReactNode } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import BeatmapSet from "../beatmapSet/beatmapSet";

const CustomBeatmapSets = ({
  label,
  helpText,
  beatmapSets,
  className,
}: {
  label: ReactNode;
  helpText: ReactNode;
  beatmapSets: BeatmapSetData[];
  className?: string;
}) => {
  const preferMetadataInOriginalLanguage = useSettingsStore(
    (settings) => settings.preferMetadataInOriginalLanguage,
  );
  const search = Route.useSearch();

  if (beatmapSets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">{label}</h1>
        <p className="text-muted-foreground text-lg">{helpText}</p>
      </div>
    );
  }

  const query = parseQueryParam(search.q);
  const sortCriteria = parseSortCriteriaParam(search.sortCriteria);
  const sortDirection = parseSortDirectionParam(search.sortDirection);
  const keys = parseKeysParam(search.keys);
  const stars = parseStarsParam(search.stars);
  const nsfw = parseNsfwParam(search.nsfw);
  const genre = parseGenreParam(search.genre);
  const language = parseLanguageParam(search.language);

  const genreId = GENRE_ID_MAP[genre];
  const languageId = LANGUAGE_INDEXES.get(language);

  const filteredSaves = beatmapSets.filter((beatmapSet) => {
    if (query.trim()) {
      if (
        preferMetadataInOriginalLanguage &&
        !caseInsensitiveIncludes(beatmapSet.title_unicode, query) &&
        !caseInsensitiveIncludes(beatmapSet.artist_unicode, query) &&
        !caseInsensitiveIncludes(beatmapSet.creator, query)
      ) {
        return false;
      }

      if (
        !preferMetadataInOriginalLanguage &&
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
      !maniaBeatmaps.some((beatmap) => {
        if (stars.min !== null && beatmap.difficulty_rating < stars.min) {
          return false;
        }

        if (stars.max !== null && beatmap.difficulty_rating > stars.max) {
          return false;
        }

        return true;
      })
    ) {
      return false;
    }

    if (!nsfw && beatmapSet.nsfw) {
      return false;
    }

    if (genreId != null && beatmapSet.genre_id !== genreId) {
      return false;
    }

    if (languageId != null && beatmapSet.language_id !== languageId) {
      return false;
    }

    return true;
  });

  if (beatmapSets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">No {label} Beatmaps Found!</h1>
        <p className="text-muted-foreground text-lg">
          Please adjust the filters.
        </p>
      </div>
    );
  }

  let sortedBeatmaps: BeatmapSetData[] = filteredSaves;

  if (sortCriteria === "title") {
    if (preferMetadataInOriginalLanguage) {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.title_unicode.localeCompare(b.title_unicode),
      );
    } else {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }
  } else if (sortCriteria === "artist") {
    if (preferMetadataInOriginalLanguage) {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.artist_unicode.localeCompare(b.artist_unicode),
      );
    } else {
      sortedBeatmaps = filteredSaves.sort((a, b) =>
        a.artist.localeCompare(b.artist),
      );
    }
  } else if (sortCriteria === "plays") {
    sortedBeatmaps = filteredSaves.sort((a, b) => {
      if (a.play_count == null && b.play_count == null) {
        return 0;
      } else if (a.play_count == null) {
        return -1;
      } else if (b.play_count == null) {
        return 1;
      } else {
        return a.play_count - b.play_count;
      }
    });
  } else if (sortCriteria === "favourites") {
    sortedBeatmaps = filteredSaves.sort((a, b) => {
      if (a.favourite_count == null && b.favourite_count == null) {
        return 0;
      } else if (a.favourite_count == null) {
        return -1;
      } else if (b.favourite_count == null) {
        return 1;
      } else {
        return a.favourite_count - b.favourite_count;
      }
    });
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

export default CustomBeatmapSets;
