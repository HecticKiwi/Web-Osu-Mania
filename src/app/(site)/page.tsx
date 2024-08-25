import BeatmapSetsInfiniteScroll from "@/components/beatmapSetsInfiniteScroll";
import SidebarContent from "@/components/sidebar";

export default async function Home() {
  return (
    <>
      <main className="flex justify-center">
        <div className="sticky top-[105.6px] h-[calc(100vh-105.6px)] w-[620px] shrink-0 p-8 pt-0">
          <SidebarContent />
        </div>

        <div className="w-full max-w-screen-xl p-8 pt-0">
          <BeatmapSetsInfiniteScroll />
        </div>
      </main>
    </>
  );
}
