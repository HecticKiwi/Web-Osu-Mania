import { rateLimit } from "@/lib/api/ratelimit";
import { BeatmapSet } from "@/lib/osuApi";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "../utils";

export async function GET(request: NextRequest) {
  if (!rateLimit(request)) {
    return new NextResponse("Too many requests. Slow down!", { status: 429 });
  }

  const requestUrl = new URL(request.url);

  const beatmapSetId = requestUrl.searchParams.get("beatmapSetId");

  if (!beatmapSetId) {
    throw new Error("URL missing beatmapSetId");
  }

  const BEATMAP_SET_DATA = getCloudflareContext().env.BEATMAP_SET_DATA;
  const cachedData = await BEATMAP_SET_DATA.get(beatmapSetId);

  if (cachedData) {
    return new NextResponse(cachedData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
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
    throw new Error(
      `GET getBeatmap error: ${response.status} - ${response.statusText}`,
    );
  }

  const data: BeatmapSet = await response.json();

  await BEATMAP_SET_DATA.put(beatmapSetId, JSON.stringify(data), {
    expirationTtl: 86400,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
