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

const KEEP_KEYS = new Set([
  "q",
  "m",
  "sort",
  "cursor_string",
  "s",
  "nsfw",
  "g",
  "l",
]);

export const Route = createFileRoute("/api/getBeatmaps")({
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

        // Params are forwarded to the osu API endpoint
        const params = new URLSearchParams(requestUrl.search);
        const keysToDelete = Array.from(params.keys()).filter(
          (key) => !KEEP_KEYS.has(key),
        );
        keysToDelete.forEach((key) => params.delete(key));

        // Sort so the keys are in consistent order for caching
        params.sort();

        const cacheKey = params.toString();

        const BEATMAP_SETS = env.BEATMAP_SETS;
        const cachedData = await BEATMAP_SETS.get(cacheKey);

        if (cachedData) {
          return new Response(cachedData, {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=3600",
              ...corsHeaders,
            },
          });
        }

        const blockedUntil = env.OSU_API.get("blocked_until");
        if (blockedUntil && Date.now() / 1000 < Number(blockedUntil)) {
          const secondsLeft = Math.ceil(
            Number(blockedUntil) - Date.now() / 1000,
          );
          const message = getRateLimitMessage();

          console.log({ secondsLeft });

          return new Response(message, {
            status: 429,
            statusText: message,
            ...corsHeaders,
          });
        }

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
            429: getRateLimitMessage(Number(retryAfter)),
            500: "The osu! API ran into an error, try again later.",
            503: "The osu! API is currently unavailable, try again later.",
            504: "The request to the osu! API timed out.",
          };

          const message =
            statusErrorMessages[response.status] ??
            "An unknown error occurred.";

          if (response.status === 429) {
            // Block for 5 minutes as default
            const expiration = Math.ceil(
              Date.now() / 1000 + (Number(retryAfter) || 300),
            );

            console.log({ expiration });

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

        const data: GetBeatmapsResponse = await response.json();

        data.beatmapsets = data.beatmapsets.map((beatmapSet) =>
          trimBeatmapSet(beatmapSet),
        );

        await BEATMAP_SETS.put(cacheKey, JSON.stringify(data), {
          expirationTtl: 3600,
        });

        return Response.json(data, {
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
