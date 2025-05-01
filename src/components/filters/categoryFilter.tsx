"use client";

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
import { Bookmark, HardDrive } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSettingsStore } from "../../stores/settingsStore";
import { Button } from "../ui/button";

const CategoryFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const categoryParam = parseCategoryParam(searchParams.get("category"));
  const storeDownloadedBeatmaps = useSettingsStore(
    (settings) => settings.storeDownloadedBeatmaps,
  );

  const savedParams = new URLSearchParams(searchParams);
  savedParams.set("category", "Saved");
  savedParams.set("sortCriteria", "Date Saved");
  savedParams.set("sortDirection", "desc");

  const storedParams = new URLSearchParams(searchParams);
  storedParams.set("category", "Stored");
  storedParams.set("sortCriteria", "Date Saved");
  storedParams.set("sortDirection", "desc");

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Categories</span>

        <div className="flex flex-wrap gap-x-2">
          {CATEGORIES.map((category) => {
            const params = new URLSearchParams(searchParams);

            if (category === DEFAULT_CATEGORY) {
              params.delete("category");
            } else {
              params.set("category", category);
            }

            if (CUSTOM_CATEGORIES.includes(categoryParam)) {
              params.set("sortCriteria", DEFAULT_SORT_CRITERIA);
              params.set("sortDirection", DEFAULT_SORT_DIRECTION);
            }

            return (
              <Button key={category} asChild variant={"link"} className="p-0">
                <Link
                  href={`/?${params.toString()}`}
                  scroll={false}
                  className={cn(
                    "h-8",
                    categoryParam === category && "text-white",
                  )}
                  prefetch={false}
                >
                  {category}
                </Link>
              </Button>
            );
          })}
          <Button asChild variant={"link"} className="p-0">
            <Link
              href={`/?${savedParams.toString()}`}
              scroll={false}
              className={cn(
                "h-8 gap-1",
                categoryParam === "Saved" && "text-white",
              )}
              prefetch={false}
            >
              <Bookmark
                className="size-5"
                fill={
                  categoryParam === "Saved"
                    ? "white"
                    : "hsl(var(--hue),80%,69%)"
                }
              />
              <span>Saved</span>
            </Link>
          </Button>
          {storeDownloadedBeatmaps && (
            <Button asChild variant={"link"} className="p-0">
              <Link
                href={`/?${storedParams.toString()}`}
                scroll={false}
                className={cn(
                  "h-8 gap-1",
                  categoryParam === "Stored" && "text-white",
                )}
                prefetch={false}
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
