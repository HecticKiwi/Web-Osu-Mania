import { rateLimit } from "@/lib/api/ratelimit";
import type { BeatmapSet } from "@/lib/osuApi";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import {
  corsHeaders,
  getAccessToken,
  getRateLimitMessage,
  trimBeatmapSet,
} from "./-utils";

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

        const blockedUntil = env.OSU_API.get("blocked_until");
        if (blockedUntil && Date.now() < Number(blockedUntil)) {
          const secondsLeft = Math.ceil(
            (Number(blockedUntil) - Date.now()) / 1000,
          );
          const message = getRateLimitMessage();

          console.log({ secondsLeft });

          return new Response(message, {
            status: 429,
            statusText: message,
            ...corsHeaders,
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
          const retryAfter = response.headers.get("X-Ratelimit-Remaining");

          const statusErrorMessages: Record<number, string> = {
            429: getRateLimitMessage(Number(retryAfter)),
            500: "The osu! API ran into an error, try again later.",
            503: "The osu! API is currently unavailable, try again later.",
            504: "The request to the osu! API timed out.",
          };

          const message =
            statusErrorMessages[response.status] ??
            "An unknown error occurred.";

          if (response.status === 429) {
            // Block for 2 minutes as default
            const expiration =
              Date.now() + (Number(retryAfter) * 1000 || 120000);

            await env.OSU_API.put("blocked_until", expiration.toString(), {
              expiration,
            });
          }

          return new Response(message, {
            status: response.status,
            statusText: message,
            ...corsHeaders,
          });
        }

        console.log({
          "X-RateLimit-Remaining":
            Number(response.headers.get("X-RateLimit-Remaining")) - 1140,
        });

        const data: BeatmapSet = await response.json();

        const trimmedData = trimBeatmapSet(data);

        await BEATMAP_SET_DATA.put(beatmapSetId, JSON.stringify(trimmedData), {
          expirationTtl: 86400,
        });

        return Response.json(trimmedData, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
            ...corsHeaders,
          },
        });
      },
    },
  },
});
