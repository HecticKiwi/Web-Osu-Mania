"use client";

import {
  CATEGORIES,
  DEFAULT_CATEGORY,
  parseCategoryParam,
} from "@/lib/searchParams/categoryParam";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const CategoryFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const categoryParam = parseCategoryParam(searchParams.get("category"));

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
                  {category}
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
