import { rateLimit } from "@/lib/api/ratelimit";
import { createFileRoute } from "@tanstack/react-router";
import { corsHeaders } from "./-utils";

export const Route = createFileRoute("/api/downloadBeatmap")({
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

        const destinationUrl = requestUrl.searchParams.get("destinationUrl");

        if (!destinationUrl) {
          return Response.json(
            { error: 'Missing "destinationUrl" query parameter.' },
            { status: 400, headers: corsHeaders },
          );
        }

        try {
          const proxyResponse = await fetch(destinationUrl, {
            method: "GET",
          });

          if (!proxyResponse.ok) {
            return Response.json(
              {
                error: `Proxy fetch failed - ${proxyResponse.statusText}`,
              },
              { status: 500, headers: corsHeaders },
            );
          }

          return new Response(proxyResponse.body, {
            status: proxyResponse.status,
            headers: {
              ...proxyResponse.headers,
              ...corsHeaders,
            },
          });
        } catch (error: any) {
          return Response.json(
            {
              error: `Proxy fetch failed - ${error.message}`,
            },
            { status: 500, headers: corsHeaders },
          );
        }
      },
    },
  },
});
