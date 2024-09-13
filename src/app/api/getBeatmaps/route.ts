import { getAccessToken, GetBeatmapsResponse } from "@/lib/osuApi";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
      "Cache-Control": "public, max-age=1800",
    },
  });
}
