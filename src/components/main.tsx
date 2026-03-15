import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import { Route } from "@/routes";
import { useGameStore } from "@/stores/gameStore";
import { useEffect } from "react";
import BeatmapSetsInfiniteScroll from "./beatmapSets/beatmapSetsInfiniteScroll";
import CollectionBeatmapSets from "./beatmapSets/collectionBeatmapSets";
import StoredBeatmapSets from "./beatmapSets/storedBeatmapSets";

const Main = () => {
  // const searchParams = useSearchParams();
  const search = Route.useSearch();
  const category = parseCategoryParam(search.category);
  const collection = search.collection;
  const beatmapId = useGameStore.use.beatmapId();
  const scrollPosition = useGameStore.use.scrollPosition();

  useEffect(() => {
    if (!beatmapId && scrollPosition !== null) {
      window.scrollTo({ top: scrollPosition });
    }
  }, [beatmapId, scrollPosition]);

  if (collection) {
    return (
      <div hidden={!!beatmapId}>
        <CollectionBeatmapSets className="mt-4" />
      </div>
    );
  }

  if (category === "Stored") {
    return (
      <div hidden={!!beatmapId}>
        <StoredBeatmapSets className="mt-4" />
      </div>
    );
  }

  return (
    <div hidden={!!beatmapId}>
      <BeatmapSetsInfiniteScroll />
    </div>
  );
};

export default Main;
