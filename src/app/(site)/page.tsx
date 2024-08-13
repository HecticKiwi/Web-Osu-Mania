import BeatmapSetsInfiniteScroll from "@/components/beatmapSetsInfiniteScroll";
import DifficultySlider from "@/components/filters/difficultySlider";
import KeysBar from "@/components/filters/keysBar";
import SortBar from "@/components/filters/sortBar";
import FullscreenButton from "@/components/fullScreenButton";
import ManiaIcon from "@/components/maniaIcon";
import Search from "@/components/search";
import Settings from "@/components/settings/settings";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="flex h-screen flex-col">
        <header className="pt-6">
          <div className="flex items-center gap-5">
            <span className="grow border-t border-border "></span>
            <Link href={"/"}>
              <div className="flex items-center gap-2">
                <ManiaIcon difficultyRating={4} />
                <span className="text-xl font-semibold">Web Osu! Mania</span>
              </div>
            </Link>
            <span className="grow border-t border-border"></span>
          </div>
        </header>

        <main className="sticky top-0 flex grow justify-center">
          <div className="sticky top-0 w-fit self-start p-8">
            <div className="mb-6 flex items-center gap-5">
              <span className="grow border-t border-border "></span>
              <h2 className="text-2xl font-bold text-muted-foreground">
                Filters
              </h2>
              <span className="grow border-t border-border"></span>
            </div>

            <div className="space-y-4">
              <Search className="grow" />
              <SortBar />
              <KeysBar />
              <DifficultySlider />
              <Settings className="ml-auto" />
            </div>
          </div>

          <div className=" w-full max-w-screen-xl p-8 pt-0">
            <div className="sticky top-0 z-10 bg-background pb-6 pt-8">
              <div className="flex items-center gap-5">
                <span className="grow border-t border-border"></span>
                <h2 className="text-2xl font-bold text-muted-foreground">
                  Beatmaps
                </h2>
                <span className="grow border-t border-border"></span>
              </div>
            </div>

            <BeatmapSetsInfiniteScroll />
          </div>
        </main>
      </div>
    </>
  );
}
