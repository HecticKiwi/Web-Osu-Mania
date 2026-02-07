import TextLink from "@/components/textLink";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export const Route = createFileRoute("/updates")({
  loader: async () => {
    const res = await fetch(
      "https://gist.githubusercontent.com/HecticKiwi/47d4d8058adf6e2609c19db15f93b61f/raw",
    );

    const content = await res.text();

    return content;
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  component: ChangelogPage,
});

function ChangelogPage() {
  const content = Route.useLoaderData();

  return (
    <main className="p-2 pb-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground">
          You can also watch for updates on the{" "}
          <TextLink to="https://discord.gg/8zfxCdkfTx" target="_blank">
            Discord server
          </TextLink>
        </p>

        <Card className="mt-4">
          <CardContent className="p-4 sm:p-6">
            <article className="prose prose-h2:text-white prose-li:text-muted-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:hover:underline prose-a:no-underline">
              <Markdown rehypePlugins={[rehypeRaw]}>{content}</Markdown>
            </article>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
