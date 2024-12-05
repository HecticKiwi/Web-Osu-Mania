import { BeatmapSet } from "@/lib/osuApi";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export type OAuthTokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

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

  if (!response.ok) {
    throw new Error(
      `GET getBeatmaps error: ${response.status} - ${response.statusText}`,
    );
  }

  const data: GetBeatmapsResponse = await response.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}

async function getAccessToken() {
  const TOKENS = getRequestContext().env.TOKENS;

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
