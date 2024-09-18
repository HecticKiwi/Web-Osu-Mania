import { parse, serialize } from 'cookie';
import { GetBeatmapsResponse, OAuthTokenData } from '../../src/lib/osuApi';

export interface Env {
	OSU_API_CLIENT_SECRET: string;
	OSU_API_CLIENT_ID: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const requestUrl = new URL(request.url);
		const pathname = requestUrl.pathname;

		if (pathname === '/getBeatmaps') {
			return handleGetBeatmaps(request, env);
		}

		return new Response('Not found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;

async function handleGetBeatmaps(request: Request, env: Env): Promise<Response> {
	const cookie = parse(request.headers.get('Cookie') || '');
	const COOKIE_NAME = 'osu_api_access_token';
	let token = cookie[COOKIE_NAME];

	const responseHeaders: HeadersInit = {
		'Content-Type': 'application/json',
		'Cache-Control': 'public, max-age=3600',
		'Access-Control-Allow-Origin': '*',
	};

	if (!token) {
		const { token: newToken, expires } = await getAccessToken(env);

		token = newToken;

		responseHeaders['Set-Cookie'] = serialize(COOKIE_NAME, newToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			expires: expires,
		});
	}

	const requestUrl = new URL(request.url);
	const searchParams = new URLSearchParams(requestUrl.search);

	const apiUrl = `https://osu.ppy.sh/api/v2/beatmapsets/search?${searchParams.toString()}`;
	const apiResponse = await fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!apiResponse.ok) {
		return new Response(JSON.stringify({ error: 'API error' }), {
			status: 500,
			headers: responseHeaders,
		});
	}

	const data: GetBeatmapsResponse = await apiResponse.json();

	return new Response(JSON.stringify(data), {
		headers: responseHeaders,
	});
}

export async function getAccessToken(env: Env) {
	const response = await fetch('https://osu.ppy.sh/oauth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			client_id: env.OSU_API_CLIENT_ID,
			client_secret: env.OSU_API_CLIENT_SECRET,
			grant_type: 'client_credentials',
			scope: 'public',
		}),
	});

	if (!response.ok) {
		throw new Error();
	}

	const data: OAuthTokenData = await response.json();

	const expiryDate = new Date();
	expiryDate.setSeconds(expiryDate.getSeconds() + data.expires_in);

	return {
		token: data.access_token,
		expires: expiryDate,
	};
}
