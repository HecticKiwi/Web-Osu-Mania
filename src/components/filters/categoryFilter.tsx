"use client";

import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

export const CATEGORIES = [
  "any",
  "hasLeaderboard",
  "ranked",
  "qualified",
  "loved",
  "pending",
  "wip",
  "graveyard",
] as const;
export type Category = (typeof CATEGORIES)[number];
export const DEFAULT_CATEGORY: Category = "hasLeaderboard";

export function getCategoryParam(searchParams: ReadonlyURLSearchParams) {
  return (searchParams.get("category") as Category) ?? DEFAULT_CATEGORY;
}

const CategoryFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const categoryParam = getCategoryParam(searchParams);

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

            return (
              <Button key={category} asChild variant={"link"} className="p-0">
                <Link
                  href={`/?${params.toString()}`}
                  scroll={false}
                  className={cn(
                    "h-8",
                    categoryParam === category && "text-white",
                  )}
                >
                  {capitalizeFirstLetter(category)}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
