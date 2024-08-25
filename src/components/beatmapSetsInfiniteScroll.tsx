"use client";

import { getBeatmaps } from "@/lib/osuApi";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";
import BeatmapSet from "./beatmapSet";
import { getCategoryParam } from "./filters/categoryFilter";
import { getStarsParam } from "./filters/difficultyFilter";
import { GENRES, getGenreParam } from "./filters/genreFilter";
import { getKeysParam } from "./filters/keysFilter";
import {
  DEFAULT_LANGUAGE,
  getLanguageParam,
  LANGUAGE_INDEXES,
} from "./filters/languageFilter";
import { getNsfwParam } from "./filters/nsfwFilter";
import { getQueryParam } from "./filters/searchFilter";
import {
  getSortCriteriaParam,
  getSortDirectionParam,
} from "./filters/sortFilter";
import { Button } from "./ui/button";

const BeatmapSetsInfiniteScroll = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  const query = getQueryParam(searchParams);
  const category = getCategoryParam(searchParams);
  const sortCriteria = getSortCriteriaParam(searchParams);
  const sortDirection = getSortDirectionParam(searchParams);
  const keys = getKeysParam(searchParams);
  const stars = getStarsParam(searchParams);
  const nsfw = getNsfwParam(searchParams);
  const genre = getGenreParam(searchParams);
  const language = getLanguageParam(searchParams);

  const [ref, entry] = useIntersectionObserver();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      {
        query,
        sortCriteria,
        sortDirection,
        mode: keys,
        stars,
        category,
        nsfw,
        genre,
        language,
      },
    ],
    queryFn: ({ pageParam }) =>
      getBeatmaps({
        query,
        sortCriteria,
        sortDirection,
        cursorString: pageParam,
        keys,
        stars,
        category,
        nsfw,
        genre: GENRES.indexOf(genre),
        language:
          LANGUAGE_INDEXES.get(language) ||
          LANGUAGE_INDEXES.get(DEFAULT_LANGUAGE)!,
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

  if (data.pages[0].beatmapsets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">No Beatmaps Found!</h1>
        <p className="text-lg text-muted-foreground">
          Please adjust or{" "}
          <Link
            href={"/"}
            className="text-primary hover:underline focus:underline"
          >
            reset
          </Link>{" "}
          the filters.
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
            "Load More"
          ) : (
            "No more beatmaps."
          )}
        </Button>
      </div>
    </>
  );
};

export default BeatmapSetsInfiniteScroll;
