import BeatmapSetsInfiniteScroll from "@/components/beatmapSetsInfiniteScroll";
import MobileSidebar from "@/components/mobileSidebar";
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
      <main className="flex min-w-fit justify-center">
        <div className="sticky top-[105.6px] hidden h-[calc(100dvh-105.6px)] w-[620px] shrink-0 p-8 pt-0 lg:block">
          <Suspense>
            <SidebarContent />
          </Suspense>
        </div>

        {/* Duplicating UI like This is probably terrible practice */}
        <MobileSidebar />

        <div className="w-full max-w-screen-xl p-4 pt-0 lg:px-8 lg:pb-8">
          <Suspense>
            <BeatmapSetsInfiniteScroll />
          </Suspense>
        </div>
      </main>
    </>
  );
}
