import { GetBeatmapsResponse } from "@/app/api/getBeatmaps/route";
import queryString from "query-string";
import { Category, DEFAULT_CATEGORY } from "./searchParams/categoryParam";
import { Genre, GENRES } from "./searchParams/genreParam";
import { Language, LANGUAGE_INDEXES } from "./searchParams/languageParam";
import {
  DEFAULT_SORT_CRITERIA,
  DEFAULT_SORT_DIRECTION,
  SortCriteria,
  SortDirection,
} from "./searchParams/sortParam";
import { Stars } from "./searchParams/starsParam";

const RULESETS = ["fruits", "mania", "osu", "taiko"] as const;
export type Ruleset = (typeof RULESETS)[number];
type RankStatus = "-2" | "-1" | "0" | "1" | "2" | "3" | "4;";

type Beatmap = {
  beatmapset_id: number;
  difficulty_rating: number;
  id: number;
  mode: Ruleset;
  status: RankStatus;
  total_length: number;
  user_id: number;
  version: string;

  cs: number;
};

type Covers = {
  cover: string;
  "cover@2x": string;
  card: string;
  "card@2x": string;
  list: string;
  "list@2x": string;
  slimcover: string;
  "slimcover@2x": string;
};

export type BeatmapSet = {
  artist: string;
  artist_unicode: string;
  covers: Covers;
  creator: string;
  favourite_count: number;
  id: number;
  nsfw: boolean;
  offset: number;
  play_count: number;
  preview_url: string;
  source: string;
  status: string;
  spotlight: boolean;
  title: string;
  title_unicode: string;
  user_id: number;
  video: boolean;

  // Optional
  beatmaps: Beatmap[];
};

export async function getBeatmaps({
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
    query,
    keys && keys.map((key) => `key=${key}`).join(" "),
    stars && `stars>=${min} stars<=${max}`,
  ]
    .filter(Boolean)
    .join(" ");

  const url = queryString.stringifyUrl({
    url: `/api/getBeatmaps`,
    query: {
      q,
      m: 3, // 3 = mania mode
      sort: `${sortCriteria}_${sortDirection}`,
      cursor_string: cursorString,
      s: category !== DEFAULT_CATEGORY ? category.toLowerCase() : undefined,
      nsfw,
      g: GENRES.indexOf(genre) || undefined,
      l: LANGUAGE_INDEXES.get(language),
    },
  });

  const data: GetBeatmapsResponse = await fetch(url).then((res) => res.json());

  return data;
}
