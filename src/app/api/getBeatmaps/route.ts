import { BeatmapSet } from "@/lib/osuApi";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "../utils";

export const runtime = "edge";

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

  // Params are forwarded to the osu API endpoint
  const params = new URLSearchParams(requestUrl.search);

  const accessToken = await getAccessToken();

  const url = `https://osu.ppy.sh/api/v2/beatmapsets/search?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: GetBeatmapsResponse = await response.json();

  if (!response.ok) {
    return NextResponse.json(null, {
      status: response.status,
      statusText: response.statusText || "Unknown API Error",
    });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
