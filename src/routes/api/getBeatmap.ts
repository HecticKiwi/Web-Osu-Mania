import { rateLimit } from "@/lib/api/ratelimit";
import { BeatmapSet } from "@/lib/osuApi";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { corsHeaders, getAccessToken, trimBeatmapSet } from "./-utils";

export const Route = createFileRoute("/api/getBeatmap")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!rateLimit(request)) {
          return new Response("Too many requests. Slow down!", {
            status: 429,
            headers: corsHeaders,
          });
        }

        const requestUrl = new URL(request.url);

        const beatmapSetId = requestUrl.searchParams.get("beatmapSetId");

        if (!beatmapSetId) {
          throw new Error("URL missing beatmapSetId");
        }

        const BEATMAP_SET_DATA = env.BEATMAP_SET_DATA;
        const cachedData = await BEATMAP_SET_DATA.get(beatmapSetId);

        if (cachedData) {
          return new Response(cachedData, {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=86400",
              ...corsHeaders,
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

        const trimmedData = trimBeatmapSet(data);

        await BEATMAP_SET_DATA.put(beatmapSetId, JSON.stringify(trimmedData), {
          expirationTtl: 86400,
        });

        return Response.json(trimmedData, {
          headers: {
            "Cache-Control": "public, max-age=3600",
            ...corsHeaders,
          },
        });
      },
    },
  },
});
