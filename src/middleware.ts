import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessToken } from "./lib/osuApi";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("osu_api_access_token");
  const response = NextResponse.next();

  if (!accessToken) {
    await getAccessToken(response);
  }

  return response;
}
