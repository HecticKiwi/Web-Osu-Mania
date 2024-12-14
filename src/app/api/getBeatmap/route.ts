import { BeatmapSet } from "@/lib/osuApi";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "../utils";

export const runtime = "edge";

export type OAuthTokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export type GetBeatmapsResponse = {
  beatmapsets: BeatmapSet[];
  search: {
    sort: string;
  };
  recommended_difficulty: null;
  error: null;
  total: number;
  cursor: null;
  cursor_string: string;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const beatmapSetId = requestUrl.searchParams.get("beatmapSetId");

  if (!beatmapSetId) {
    throw new Error("URL missing beatmapSetId");
  }

  const accessToken = await getAccessToken();

  const url = `https://osu.ppy.sh/api/v2/beatmapsets/${beatmapSetId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `GET getBeatmap error: ${response.status} - ${response.statusText}`,
    );
  }

  const data: BeatmapSet = await response.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
