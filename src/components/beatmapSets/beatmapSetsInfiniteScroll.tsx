"use client";

import { GetBeatmapsResponse } from "@/app/api/getBeatmaps/route";
import { getBeatmaps } from "@/lib/osuApi";
import { Category, parseCategoryParam } from "@/lib/searchParams/categoryParam";
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
import { Bookmark, HardDrive, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";
import BeatmapSet from "../beatmapSet/beatmapSet";
import TextLink from "../textLink";
import { Button } from "../ui/button";

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
    isError,
    error,
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
        category: category as Category,
        nsfw,
        genre,
        language,
        cursorString: pageParam,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage?.cursor_string,
    staleTime: Infinity,
    retry: 1,
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
        <p className="text-center text-muted-foreground">({error.message})</p>
        {error.message.startsWith("Code 200") && (
          <p className="mt-4 text-balance text-center text-orange-500">
            While I look into this issue, consider{" "}
            <Bookmark className="inline size-5" /> saving beatmaps or enabling
            IndexedDB caching in the settings the next time the beatmap listing
            is available. Either will allow you to play beatmaps from the{" "}
            <Bookmark className="inline size-5" /> Saved and{" "}
            <HardDrive className="inline size-5" /> Stored categories which do
            not use the osu! API.
          </p>
        )}
      </div>
    );
  }

  if (data.pages[0].beatmapsets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">No Beatmaps Found!</h1>
        <p className="text-lg text-muted-foreground">
          Please adjust or{" "}
          <TextLink href={"/"} prefetch={false}>
            reset
          </TextLink>{" "}
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
