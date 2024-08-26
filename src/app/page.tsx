import BeatmapSetsInfiniteScroll from "@/components/beatmapSetsInfiniteScroll";
import SidebarContent from "@/components/sidebar";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    sortCriteria?: string;
    sortDirection?: string;
    keys?: string;
    stars?: string;
    nsfw?: string;
    genre?: string;
    language?: string;
  };
}) {
  return (
    <>
      <main className="flex justify-center">
        <div className="sticky top-[105.6px] h-[calc(100vh-105.6px)] w-[620px] shrink-0 p-8 pt-0">
          <Suspense>
            <SidebarContent />
          </Suspense>
        </div>

        <div className="w-full max-w-screen-xl p-8 pt-0">
          <Suspense>
            <BeatmapSetsInfiniteScroll />
          </Suspense>
        </div>
      </main>
    </>
  );
}
