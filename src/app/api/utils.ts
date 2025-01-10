import { getRequestContext } from "@cloudflare/next-on-pages";

type OAuthTokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export async function getAccessToken() {
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
