"use client";

import { searchBeatmaps } from "@/lib/osuApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Fragment, useEffect } from "react";
import BeatmapSet from "./beatmapSet";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export const CATEGORIES = [
  "any",
  "hasLeaderboard",
  "ranked",
  "qualified",
  "loved",
  "pending",
  "wip",
  "graveyard",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const SORT_CRITERIA = [
  "title",
  "artist",
  "difficulty",
  "ranked",
  "rating",
  "plays",
  "favourites",
  "relevance",
] as const;
export type SortCriteria = (typeof SORT_CRITERIA)[number];

export type SortDirection = "asc" | "desc";

export const DEFAULT_CATEGORY: Category = "hasLeaderboard";
export const DEFAULT_SORT_CRITERIA: SortCriteria = "ranked";
export const DEFAULT_SORT_DIRECTION: SortDirection = "desc";
export const DEFAULT_QUERY = undefined;
export const DEFAULT_MODE = [];
export const DEFAULT_STARS = "0-10";

const BeatmapSetsInfiniteScroll = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || DEFAULT_QUERY;
  const category: Category =
    (searchParams.get("category") as Category) ?? DEFAULT_CATEGORY;
  const sortCriteria: SortCriteria =
    (searchParams.get("sortCriteria") as SortCriteria) ?? DEFAULT_SORT_CRITERIA;
  const sortDirection: SortDirection =
    (searchParams.get("sortDirection") as SortDirection) ??
    DEFAULT_SORT_DIRECTION;
  const mode = searchParams.get("key")?.split(",") || DEFAULT_MODE;
  const stars = searchParams.get("stars") || DEFAULT_STARS;

  const [ref, entry] = useIntersectionObserver();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isPending,
    isFetchingNextPage,
    isError,
    status,
  } = useInfiniteQuery({
    queryKey: [{ q, sortCriteria, sortDirection, mode, stars, category }],
    queryFn: ({ pageParam }) =>
      searchBeatmaps({
        query: q,
        sortCriteria,
        sortDirection,
        cursorString: pageParam,
        mode,
        stars,
        category,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, pages) => lastPage.cursor_string,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [fetchNextPage, entry?.isIntersecting]);

  if (isPending) {
    return (
      <div className="my-8">
        <Loader className="mx-auto animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="my-8">
        <p className="text-center text-muted-foreground">
          Failed to fetch beatmaps. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6",
          className,
        )}
      >
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.beatmapsets.map((beatmapSet) => (
              <BeatmapSet key={beatmapSet.id} beatmapSet={beatmapSet} />
            ))}
          </Fragment>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          ref={ref}
          variant={"secondary"}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="w-full"
        >
          {isFetchingNextPage ? (
            <Loader className="animate-spin" />
          ) : hasNextPage ? (
            "Load more"
          ) : (
            "No more beatmaps."
          )}
        </Button>
      </div>
    </>
  );
};

export default BeatmapSetsInfiniteScroll;
