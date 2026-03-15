import {
  CATEGORIES,
  CUSTOM_CATEGORIES,
  DEFAULT_CATEGORY,
  parseCategoryParam,
} from "@/lib/searchParams/categoryParam";
import {
  DEFAULT_SORT_CRITERIA,
  DEFAULT_SORT_DIRECTION,
} from "@/lib/searchParams/sortParam";
import { cn } from "@/lib/utils";
import { Link, useSearch } from "@tanstack/react-router";
import { HardDrive } from "lucide-react";
import { useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/button";

const CategoryFilter = ({ className }: { className?: string }) => {
  const search = useSearch({ from: "/" });
  const categoryParam = parseCategoryParam(
    typeof search.category === "string" ? search.category : undefined,
  );
  const storeDownloadedBeatmaps = useSettingsStore(
    (settings) => settings.storeDownloadedBeatmaps,
  );

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Categories</span>

        <div className="flex flex-wrap gap-x-2">
          {CATEGORIES.map((category) => {
            const newSearch = {
              ...search,
              category: category === DEFAULT_CATEGORY ? undefined : category,
              ...(CUSTOM_CATEGORIES.includes(categoryParam) && {
                sortCriteria: DEFAULT_SORT_CRITERIA,
                sortDirection: DEFAULT_SORT_DIRECTION,
              }),
            };

            return (
              <Button
                key={category}
                asChild
                variant={"link"}
                className={cn(
                  "h-8 p-0",
                  categoryParam === category && "text-white",
                )}
              >
                <Link to="/" search={newSearch} preloadDelay={0}>
                  {category}
                </Link>
              </Button>
            );
          })}
          {storeDownloadedBeatmaps && (
            <Button
              asChild
              variant={"link"}
              className={cn(
                "h-8 gap-1 p-0",
                categoryParam === "Stored" && "text-white",
              )}
            >
              <Link
                to="/"
                search={{
                  ...search,
                  category: "Stored",
                  sortCriteria: "Date Saved",
                  sortDirection: "desc",
                  collection: undefined,
                }}
                preloadDelay={0}
              >
                <HardDrive className="size-5" />
                <span>Stored</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
