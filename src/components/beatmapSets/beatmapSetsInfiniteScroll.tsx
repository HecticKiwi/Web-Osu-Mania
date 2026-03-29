import { getBeatmapSets } from "@/lib/osuApi";
import type { Category } from "@/lib/searchParams/categoryParam";
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
import { Route } from "@/routes";
import type { GetBeatmapsResponse } from "@/routes/api/getBeatmaps";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Loader } from "lucide-react";
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
  const search = Route.useSearch();

  const query = parseQueryParam(search.q);
  const category = parseCategoryParam(search.category);
  const sortCriteria = parseSortCriteriaParam(search.sortCriteria);
  const sortDirection = parseSortDirectionParam(search.sortDirection);
  const keys = parseKeysParam(search.keys);
  const stars = parseStarsParam(search.stars);
  const nsfw = parseNsfwParam(search.nsfw);
  const genre = parseGenreParam(search.genre);
  const language = parseLanguageParam(search.language);

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
      getBeatmapSets({
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
    retry: 0,
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

  if (isError && !data) {
    return (
      <div className="my-8">
        <p className="text-muted-foreground text-center">
          Failed to fetch beatmaps.
        </p>
        <p className="text-muted-foreground text-center">({error.message})</p>
      </div>
    );
  }

  if (data.pages[0].beatmapsets.length === 0) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-semibold">No Beatmaps Found!</h1>
        <p className="text-muted-foreground text-lg">
          Please adjust or <TextLink to={"/"}>reset</TextLink> the filters.
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
        {isError && data ? (
          <div className="">
            <p className="text-muted-foreground">
              Failed to load more beatmaps.
            </p>
            <p className="text-muted-foreground">{error.message}</p>
            <Button
              variant={"secondary"}
              onClick={() => fetchNextPage()}
              className="mt-4 w-full"
            >
              Retry
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default BeatmapSetsInfiniteScroll;
