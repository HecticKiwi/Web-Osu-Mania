"use client";

import { getBeatmaps, GetBeatmapsResponse } from "@/lib/osuApi";
import { parseCategoryParam } from "@/lib/searchParams/categoryParam";
import { parseGenreParam } from "@/lib/searchParams/genreParam";
import { parseKeysParam } from "@/lib/searchParams/keysParam";
import { parseLanguageParam } from "@/lib/searchParams/languageParam";
import { parseNsfwParam } from "@/lib/searchParams/nsfwParam";
import { parseQueryParam } from "@/lib/searchParams/queryParam";
import {
  parseSortCriteriaParam,
  parseSortDirectionParam,
} from "@/lib/searchParams/sortParam";
import { parseStarsParam } from "@/lib/searchParams/starsParam";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";
import BeatmapSet from "./beatmapSet";
import { Button } from "./ui/button";

const BeatmapSetsInfiniteScroll = ({
  initialData,
  className,
}: {
  initialData?: GetBeatmapsResponse;
  className?: string;
}) => {
  const searchParams = useSearchParams();

  const query = parseQueryParam(searchParams.get("q"));
  const category = parseCategoryParam(searchParams.get("category"));
  const sortCriteria = parseSortCriteriaParam(searchParams.get("sortCriteria"));
  const sortDirection = parseSortDirectionParam(
    searchParams.get("sortDirection"),
  );
  const keys = parseKeysParam(searchParams.get("keys"));
  const stars = parseStarsParam(searchParams.get("stars"));
  const nsfw = parseNsfwParam(searchParams.get("nsfw"));
  const genre = parseGenreParam(searchParams.get("genre"));
  const language = parseLanguageParam(searchParams.get("language"));

  const [ref, entry] = useIntersectionObserver();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery({
    initialData: initialData && {
      pages: [initialData],
      pageParams: [""],
    },
    queryKey: [
      {
        query,
        sortCriteria,
        sortDirection,
        keys,
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
        keys,
        stars,
        category,
        nsfw,
        genre,
        language,
        cursorString: pageParam,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage?.cursor_string,
    staleTime: Infinity,
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
            prefetch={false}
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
          "grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6",
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
