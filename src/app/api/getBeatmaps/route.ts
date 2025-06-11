import { BeatmapSet } from "@/lib/osuApi";
import { getCloudflareContext } from "@opennextjs/cloudflare";
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

  const BEATMAP_SETS = getCloudflareContext().env.BEATMAP_SETS;
  const cachedData = await BEATMAP_SETS.get(requestUrl.search);

  if (cachedData) {
    const data = JSON.parse(cachedData);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Params are forwarded to the osu API endpoint
  const params = new URLSearchParams(requestUrl.search);

  // Sort so the keys are in consistent order for caching
  params.sort();

  const url = `https://osu.ppy.sh/api/v2/beatmapsets/search?${params.toString()}`;

  const accessToken = await getAccessToken();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const retryAfter = response.headers.get("Retry-After");

    const statusErrorMessages: Record<number, string> = {
      429: `The site is being rate-limited by the osu! API, please try again ${retryAfter ? `after ${retryAfter} seconds` : "later"}.`,
      500: "The osu! API ran into an error, try again later.",
      503: "The osu! API is currently unavailable, try again later.",
      504: "The request to the osu! API timed out.",
    };

    const message =
      statusErrorMessages[response.status] ?? "An unknown error occurred.";

    return NextResponse.json(
      {
        message,
      },
      {
        status: response.status,
        statusText: message,
      },
    );
  }

  const data: GetBeatmapsResponse = await response.json();

  await BEATMAP_SETS.put(requestUrl.search, JSON.stringify(data), {
    expirationTtl: 3600,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
