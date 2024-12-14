import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const destinationUrl = requestUrl.searchParams.get("destinationUrl");

  if (!destinationUrl) {
    return NextResponse.json(
      { error: 'Missing "destinationUrl" query parameter.' },
      { status: 400 },
    );
  }

  try {
    const proxyResponse = await fetch(destinationUrl, {
      method: "GET",
    });

    if (!proxyResponse.ok) {
      return NextResponse.json(
        {
          error: `Proxy fetch failed - ${proxyResponse.statusText}`,
        },
        { status: 500 },
      );
    }

    return new NextResponse(proxyResponse.body, {
      status: proxyResponse.status,
      headers: proxyResponse.headers,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: `Proxy fetch failed - ${error.message}`,
      },
      { status: 500 },
    );
  }
}
