import { BeatmapSet } from "@/lib/osuApi";
import { cookies } from "next/headers";
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

  const cookieStore = cookies();
  let token = cookieStore.get("osu_api_access_token")?.value;

  if (!token) {
    const { token: newToken, expires } = await getAccessToken();

    token = newToken;

    cookieStore.set("osu_api_access_token", newToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expires,
    });
  }

  const url = `https://osu.ppy.sh/api/v2/beatmapsets/search?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error();
  }

  const data: GetBeatmapsResponse = await response.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}

async function getAccessToken() {
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
      `getAccessToken error: ${response.status} - ${response.statusText}`,
    );
  }

  const data: OAuthTokenData = await response.json();

  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + data.expires_in);

  return {
    token: data.access_token,
    expires: expiryDate,
  };
}
