import { GameOverlay } from "@/components/game/gameOverlay";
import Main from "@/components/main";
import UploadDialog from "@/components/settings/uploadDialog";
import SidebarContent from "@/components/sidebar";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Suspense } from "react";
import { z } from "zod";

const indexSearchSchema = z.object({
  q: z.string().optional(),
  keys: z.string().optional(),
  stars: z.string().optional(),
  category: z.string().optional(),
  nsfw: z.string().optional(),
  genre: z.string().optional(),
  language: z.string().optional(),
  sortCriteria: z.string().optional(),
  sortDirection: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: zodValidator(indexSearchSchema),
  head: () => ({
    links: [
      {
        rel: "canonical",
        href: "https://webosumania.com",
      },
    ],
  }),
});

function Home() {
  return (
    <main className="flex min-w-fit justify-center">
      <div className="sticky top-[105.6px] hidden h-[calc(100dvh-105.6px)] w-[620px] shrink-0 p-8 pt-0 lg:block">
        <Suspense>
          <SidebarContent />
        </Suspense>
      </div>

      <div className="w-full max-w-screen-xl px-2 py-4 pt-0 sm:px-4 lg:px-8 lg:pb-8">
        <Suspense>
          <Main />
        </Suspense>
      </div>

      <UploadDialog />
      <GameOverlay />
    </main>
  );
}
