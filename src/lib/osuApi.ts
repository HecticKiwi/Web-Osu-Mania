"use server";

import {
  Category,
  DEFAULT_SORT_CRITERIA,
  DEFAULT_SORT_DIRECTION,
  SortCriteria,
  SortDirection,
} from "@/components/beatmapSetsInfiniteScroll";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import queryString from "query-string";

type OAuthTokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export type Ruleset = "fruits" | "mania" | "osu" | "taiko";
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

export async function getAccessToken(nextResponse: NextResponse) {
  const response = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.OSU_API_CLIENT_ID,
      client_secret: process.env.OSU_API_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    }),
  });

  if (!response.ok) {
    throw new Error();
  }

  const data: OAuthTokenData = await response.json();

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 1);

  nextResponse.cookies.set("osu_api_access_token", data.access_token, {
    expires: expiryDate,
  });
}

type SetBeatmapsResponse = {
  beatmapsets: BeatmapSet[];
  search: {
    sort: string;
  };
  recommended_difficulty: null;
  error: null;
  total: number;
  cursor: null;
  cursor_string: null;
};

export async function searchBeatmaps({
  query,
  category,
  sortCriteria = DEFAULT_SORT_CRITERIA,
  sortDirection = DEFAULT_SORT_DIRECTION,
  cursorString,
  mode,
  stars = "0-10",
}: {
  query?: string;
  category?: Category;
  sortCriteria?: SortCriteria;
  sortDirection?: SortDirection;
  cursorString?: string;
  mode?: string[];
  stars?: string;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("osu_api_access_token")?.value;

  if (!token) {
    throw new Error("No token?");
  }

  const [min, max] = stars.split("-");
  const q = [
    query,
    mode && mode.map((key) => `key=${key}`).join(" "),
    stars && `stars>=${min} stars<=${max}`,
  ]
    .filter(Boolean)
    .join(" ");

  const url = queryString.stringifyUrl({
    url: "https://osu.ppy.sh/api/v2/beatmapsets/search",
    query: {
      q,
      m: 3, // 3 = mania mode
      sort: `${sortCriteria}_${sortDirection}`,
      cursor_string: cursorString,
      s: category !== "hasLeaderboard" ? category : undefined,
    },
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error();
  }

  const data: SetBeatmapsResponse = await response.json();

  return data;
}

export async function getBeatmap() {}
