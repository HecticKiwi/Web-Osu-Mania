"use client";

import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { getQueryParam } from "./searchFilter";

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
export const DEFAULT_SORT_CRITERIA: SortCriteria = "ranked";

export function getSortCriteriaParam(searchParams: ReadonlyURLSearchParams) {
  return (
    (searchParams.get("sortCriteria") as SortCriteria) ?? DEFAULT_SORT_CRITERIA
  );
}

export type SortDirection = "asc" | "desc";
export const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export function getSortDirectionParam(searchParams: ReadonlyURLSearchParams) {
  return (
    (searchParams.get("sortDirection") as SortDirection) ??
    DEFAULT_SORT_DIRECTION
  );
}

const SortFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  const sortCriteria = getSortCriteriaParam(searchParams);
  const sortDirection = getSortDirectionParam(searchParams);
  const query = getQueryParam(searchParams);

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">
          Sort by <span className="font-semibold">({sortDirection})</span>
        </span>

        <div className="flex gap-x-2">
          {[
            "title",
            "artist",
            "difficulty",
            "ranked",
            "rating",
            "plays",
            "favourites",
            ...(query ? ["relevance"] : []),
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
              <Button key={criteria} asChild variant={"link"} className="p-0">
                <Link
                  href={`/?${params.toString()}`}
                  scroll={false}
                  className={cn(
                    "h-8",
                    sortCriteria === criteria && "text-white",
                  )}
                >
                  {capitalizeFirstLetter(criteria)}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SortFilter;
