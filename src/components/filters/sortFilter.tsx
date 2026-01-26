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
import { Link, useSearch } from "@tanstack/react-router";
import { Button } from "../ui/button";

const SortFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const category = parseCategoryParam(
    typeof search.category === "string" ? search.category : undefined,
  );
  const viewingCustomCategory = CUSTOM_CATEGORIES.includes(category);

  const sortCriteria = parseSortCriteriaParam(
    typeof search.sortCriteria === "string" ? search.sortCriteria : undefined,
  );
  const sortDirection = parseSortDirectionParam(
    typeof search.sortDirection === "string" ? search.sortDirection : undefined,
  );
  const query = parseQueryParam(
    typeof search.q === "string" ? search.q : undefined,
  );

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

            const shouldDelete =
              criteria === DEFAULT_SORT_CRITERIA &&
              newSortDirection === DEFAULT_SORT_DIRECTION;

            return (
              <Button key={criteria} asChild variant={"link"} className="p-0">
                <Link
                  to="/"
                  search={{
                    ...search,
                    sortCriteria: shouldDelete ? undefined : criteria,
                    sortDirection: shouldDelete ? undefined : newSortDirection,
                  }}
                  preloadDelay={0}
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
