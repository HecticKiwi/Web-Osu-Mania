import { Footer } from "@/components/footer";
import TextLink from "@/components/textLink";
import UpdateCard from "@/components/updates/updateCard";
import { createFileRoute } from "@tanstack/react-router";
import { Ellipsis, RefreshCw } from "lucide-react";

export type UpdateType = "addition" | "fix" | "improvement" | "announcement";

export interface UpdateEntry {
  date: string;
  items: {
    text: string;
    type: UpdateType;
  }[];
}

export const Route = createFileRoute("/updates")({
  loader: async () => {
    const res = await fetch(
      "https://gist.githubusercontent.com/HecticKiwi/fdc93e7b5043bf82f5607e0f70354b9a/raw",
    );

    const updates = (await res.json()) as UpdateEntry[];

    return updates;
  },
  headers: () => ({
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
  }),
  component: UpdatesPage,
  head: () => ({
    meta: [
      { title: "Updates - Web osu!mania" },
      { name: "description", content: "See what's new on Web osu!mania." },
      {
        name: "twitter:description",
        content: "See updates and announcements for Web osu!mania.",
      },
    ],
  }),
});

function UpdatesPage() {
  const updates = Route.useLoaderData();

  return (
    <div>
      {/* Hero */}
      <div className="border-border/50 relative border-b">
        {/* Polka bg with linear fade */}
        <div className="bg-polka absolute inset-0 -z-20"></div>
        <div className="bg-background absolute inset-0 -z-10 mask-[linear-gradient(to_top,transparent,black_35%)]"></div>

        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="text-primary size-5" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                Updates
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Changelog & Announcements
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed text-pretty md:text-lg">
              Stay up to date with all the latest changes and improvements to
              Web osu!mania. You can also watch for updates on the{" "}
              <TextLink to={"https://discord.gg/8zfxCdkfTx"} target="_blank">
                Discord Server
              </TextLink>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-5xl px-6 py-12 md:py-16">
        {updates.map((entry, index) => (
          <div
            key={index}
            className={
              index === updates.length - 1
                ? "[&>div>.absolute:last-child]:hidden"
                : ""
            }
          >
            <UpdateCard entry={entry} />
          </div>
        ))}

        <div className="flex items-center gap-6">
          <div className="border-border/40 bg-secondary text-muted-foreground relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border">
            <Ellipsis className="size-4" />
          </div>
          <p className="text-muted-foreground text-sm italic">
            Earlier updates aren't tracked here - check out the Discord for
            older updates.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
