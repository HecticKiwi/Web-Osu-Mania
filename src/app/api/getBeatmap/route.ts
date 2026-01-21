import { rateLimit } from "@/lib/api/ratelimit";
import { BeatmapSet } from "@/lib/osuApi";
import { getCache } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, trimBeatmapSet } from "../utils";

export async function GET(request: NextRequest) {
  if (!rateLimit(request)) {
    return new NextResponse("Too many requests. Slow down!", { status: 429 });
  }

  const requestUrl = new URL(request.url);
  const beatmapSetId = requestUrl.searchParams.get("beatmapSetId");

  if (!beatmapSetId) {
    return new NextResponse("URL missing beatmapSetId", { status: 400 });
  }

  const cache = await getCache("BEATMAP_SET_DATA");
  const ttlSeconds = 86400; // 24h

  // --- Cache read ---
  const cachedData = await cache.get(beatmapSetId);
  if (cachedData) {
    return new NextResponse(cachedData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${ttlSeconds}`,
      },
    });
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
    return new NextResponse(
      `GET getBeatmap error: ${response.status} - ${response.statusText}`,
      { status: response.status },
    );
  }

  const data: BeatmapSet = await response.json();
  const trimmedData = trimBeatmapSet(data);
  const body = JSON.stringify(trimmedData);

  // --- Cache write ---
  await cache.put(beatmapSetId, body, ttlSeconds);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
