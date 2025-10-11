import { BeatmapSet } from "@/lib/osuApi";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type OAuthTokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export async function getAccessToken() {
  const TOKENS = getCloudflareContext().env.TOKENS;

  let accessToken = await TOKENS.get("osu_api_access_token");

  if (!accessToken) {
    const response: Response = await fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.OSU_API_CLIENT_ID,
        client_secret: process.env.OSU_API_CLIENT_SECRET,
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
    covers: {
      cover: beatmapSet.covers.cover,
    },
    creator: beatmapSet.creator,
    id: beatmapSet.id,
    nsfw: beatmapSet.nsfw,
    offset: beatmapSet.offset,
    preview_url: beatmapSet.preview_url,
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
    })),
  };
}
