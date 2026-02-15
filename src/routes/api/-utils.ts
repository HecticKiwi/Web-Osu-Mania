import { BeatmapSet } from "@/lib/osuApi";
import { env } from "cloudflare:workers";

type OAuthTokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "https://hectickiwi.github.io",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

export async function getAccessToken() {
  const TOKENS = env.TOKENS;

  let accessToken = await TOKENS.get("osu_api_access_token");

  if (!accessToken) {
    const response: Response = await fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: env.OSU_API_CLIENT_ID,
        client_secret: env.OSU_API_CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "public",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `getAccessToken() error: ${response.status} - ${response.statusText}`,
      );
    }

    const data: OAuthTokenData = await response.json();

    accessToken = data.access_token;

    await TOKENS.put("osu_api_access_token", accessToken, {
      expirationTtl: data.expires_in,
    });
  }

  return accessToken;
}

/**
 * Removes unused properties from the osu API's BeatmapSet object
 */
export function trimBeatmapSet(beatmapSet: BeatmapSet): BeatmapSet {
  return {
    artist: beatmapSet.artist,
    artist_unicode: beatmapSet.artist_unicode,
    creator: beatmapSet.creator,
    id: beatmapSet.id,
    nsfw: beatmapSet.nsfw,
    offset: beatmapSet.offset,
    status: beatmapSet.status,
    title: beatmapSet.title,
    title_unicode: beatmapSet.title_unicode,
    beatmaps: beatmapSet.beatmaps.map((beatmap) => ({
      beatmapset_id: beatmap.beatmapset_id,
      difficulty_rating: beatmap.difficulty_rating,
      id: beatmap.id,
      mode: beatmap.mode,
      total_length: beatmap.total_length,
      user_id: beatmap.user_id,
      version: beatmap.version,
      cs: beatmap.cs,
      accuracy: beatmap.accuracy,
      drain: beatmap.drain,
      count_circles: beatmap.count_circles,
      count_sliders: beatmap.count_sliders,
    })),
  };
}
