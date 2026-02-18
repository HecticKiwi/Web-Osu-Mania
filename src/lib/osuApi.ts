import type { GetBeatmapsResponse } from "@/routes/api/getBeatmaps";
import queryString from "query-string";
import type { Category } from "./searchParams/categoryParam";
import { DEFAULT_CATEGORY } from "./searchParams/categoryParam";
import type { Genre } from "./searchParams/genreParam";
import { GENRE_ID_MAP } from "./searchParams/genreParam";
import type { Language } from "./searchParams/languageParam";
import { LANGUAGE_INDEXES } from "./searchParams/languageParam";
import type { SortCriteria, SortDirection } from "./searchParams/sortParam";
import {
  DEFAULT_SORT_CRITERIA,
  DEFAULT_SORT_DIRECTION,
} from "./searchParams/sortParam";
import type { Stars } from "./searchParams/starsParam";
import { BASE_PATH } from "./utils";

const RULESETS = ["fruits", "mania", "osu", "taiko"] as const;
export type Ruleset = (typeof RULESETS)[number];
// type RankStatus = "-2" | "-1" | "0" | "1" | "2" | "3" | "4;";

const STATUSES = [
  "ranked",
  "qualified",
  "loved",
  "pending",
  "graveyard",
  "wip",
] as const;
export type Status = (typeof STATUSES)[number];

// Commented properties are unused and removed before caching

export type Beatmap = {
  beatmapset_id: number;
  difficulty_rating: number;
  id: number;
  mode: Ruleset;
  // status: RankStatus;
  total_length: number;
  user_id: number;
  version: string;

  cs: number; // Key count
  accuracy: number; // OD
  drain: number; // HP

  count_circles: number; // Tap note count
  count_sliders: number; // Hold note count
};

// type Covers = {
// cover: string;
// "cover@2x": string;
// card: string;
// "card@2x": string;
// list: string;
// "list@2x": string;
// slimcover: string;
// "slimcover@2x": string;
// };

export type BeatmapSet = {
  artist: string;
  artist_unicode: string;
  // covers: Covers;
  creator: string;
  // favourite_count: number;
  id: number;
  nsfw: boolean;
  offset: number;
  // play_count: number;
  // preview_url: string;
  // source: string;
  status: Status;
  // spotlight: boolean;
  title: string;
  title_unicode: string;
  // user_id: number;
  // video: boolean;

  beatmaps: Beatmap[];
};

export async function getBeatmapSets({
  query,
  category,
  sortCriteria = DEFAULT_SORT_CRITERIA,
  sortDirection = DEFAULT_SORT_DIRECTION,
  cursorString,
  keys,
  stars,
  nsfw = true,
  genre,
  language,
}: {
  query: string;
  category: Category;
  sortCriteria: SortCriteria;
  sortDirection: SortDirection;
  cursorString?: string;
  keys: string[];
  stars: Stars;
  nsfw: boolean;
  genre: Genre;
  language: Language;
}) {
  const { min, max } = stars;

  const q = [
    stars.min !== null && `stars>=${min}`,
    stars.max !== null && `stars<=${max}`,
    keys && keys.map((key) => `key=${key}`).join(" "),
    query,
  ]
    .filter(Boolean)
    .join(" ");

  const url = queryString.stringifyUrl({
    url: `${BASE_PATH}/api/getBeatmaps`,
    query: {
      q: q || undefined,
      m: 3, // 3 = mania mode
      sort:
        sortCriteria !== DEFAULT_SORT_CRITERIA ||
        sortDirection !== DEFAULT_SORT_DIRECTION
          ? `${sortCriteria}_${sortDirection}`
          : undefined,
      cursor_string: cursorString || undefined,
      s: category !== DEFAULT_CATEGORY ? category.toLowerCase() : undefined,
      nsfw,
      g: GENRE_ID_MAP[genre],
      l: LANGUAGE_INDEXES.get(language),
    },
  });

  const res = await fetch(url);

  if (!res.ok) {
    let errorMessage = `Code ${res.status}`;

    try {
      const message = await res.text();
      errorMessage += `: ${message}`;
    } catch (error) {}

    throw new Error(errorMessage);
  }

  const data: GetBeatmapsResponse = await res.json();
  return data;
}

export async function getBeatmapSet(beatmapSetId: number) {
  const url = queryString.stringifyUrl({
    url: `${BASE_PATH}/api/getBeatmap`,
    query: { beatmapSetId },
  });

  const beatmapSetRes = await fetch(url);

  if (!beatmapSetRes.ok) {
    const message = await beatmapSetRes.text();

    throw new Error(message);
  }

  const beatmapSet: BeatmapSet = await beatmapSetRes.json();

  return beatmapSet;
}
