import { rateLimit } from "@/lib/api/ratelimit";
import type { BeatmapSet } from "@/lib/osuApi";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { corsHeaders, getAccessToken, trimBeatmapSet } from "./-utils";

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
        params.keys().forEach((key) => {
          if (!KEEP_KEYS.has(key)) {
            params.delete(key);
          }
        });

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
            statusErrorMessages[response.status] ??
            "An unknown error occurred.";

          return new Response(message, {
            status: response.status,
            statusText: message,
            ...corsHeaders,
          });
        }

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
