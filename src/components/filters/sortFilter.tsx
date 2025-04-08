"use client";

import {
  CUSTOM_CATEGORIES,
  parseCategoryParam,
} from "@/lib/searchParams/categoryParam";
import { parseQueryParam } from "@/lib/searchParams/queryParam";
import {
  DEFAULT_SORT_CRITERIA,
  DEFAULT_SORT_DIRECTION,
  parseSortCriteriaParam,
  parseSortDirectionParam,
} from "@/lib/searchParams/sortParam";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const SortFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const category = parseCategoryParam(searchParams.get("category"));
  const viewingCustomCategory = CUSTOM_CATEGORIES.includes(category);

  const sortCriteria = parseSortCriteriaParam(searchParams.get("sortCriteria"));
  const sortDirection = parseSortDirectionParam(
    searchParams.get("sortDirection"),
  );
  const query = parseQueryParam(searchParams.get("q"));

  const options = viewingCustomCategory
    ? ["Date Saved", "title", "artist"]
    : [
        "title",
        "artist",
        "difficulty",
        "ranked",
        "rating",
        "plays",
        "favourites",
        ...(query ? ["relevance"] : []),
      ];

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">
          Sort by <span className="font-semibold">({sortDirection})</span>
        </span>

        <div className="flex flex-wrap gap-x-2">
          {options.map((criteria) => {
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
                  prefetch={false}
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
