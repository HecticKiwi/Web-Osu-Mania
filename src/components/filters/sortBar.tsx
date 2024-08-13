"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeFirstLetter } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_SORT_CRITERIA,
  DEFAULT_SORT_DIRECTION,
  SortCriteria,
  SortDirection,
} from "../beatmapSetsInfiniteScroll";

const SortBar = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  const sortCriteria: SortCriteria =
    (searchParams.get("sortCriteria") as SortCriteria) ?? DEFAULT_SORT_CRITERIA;
  const sortDirection: SortDirection =
    (searchParams.get("sortDirection") as SortDirection) ??
    DEFAULT_SORT_DIRECTION;

  return (
    <>
      <div className="">
        <span className="text-muted-foreground">
          Sort by <span className="font-semibold">({sortDirection})</span>
        </span>

        <div className="mt-2 flex">
          <Tabs key={sortCriteria} value={sortCriteria}>
            <TabsList>
              {[
                "title",
                "artist",
                "difficulty",
                "ranked",
                "rating",
                "plays",
                "favourites",
              ].map((criteria) => {
                const newSortDirection =
                  sortCriteria === criteria && sortDirection === "desc"
                    ? "asc"
                    : "desc";

                const params = new URLSearchParams(searchParams);
                params.set("sortCriteria", criteria);
                params.set("sortDirection", newSortDirection);

                if (
                  criteria === DEFAULT_SORT_CRITERIA &&
                  newSortDirection === DEFAULT_SORT_DIRECTION
                ) {
                  params.delete("sortCriteria");
                  params.delete("sortDirection");
                }

                return (
                  <TabsTrigger
                    key={criteria}
                    value={criteria.toString()}
                    asChild
                  >
                    <Link
                      href={`/?${params.toString()}`}
                      scroll={false}
                      className="gap-1"
                    >
                      {capitalizeFirstLetter(criteria)}
                    </Link>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SortBar;
