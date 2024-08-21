"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CATEGORIES,
  Category,
  DEFAULT_CATEGORY,
} from "../beatmapSetsInfiniteScroll";

const CategoryBar = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();

  const category: Category =
    (searchParams.get("category") as Category) ?? DEFAULT_CATEGORY;

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Categories</span>

        <div className="mt-2 flex">
          <Tabs key={category} value={category}>
            <TabsList>
              {CATEGORIES.map((category) => {
                const params = new URLSearchParams(searchParams);

                if (category === DEFAULT_CATEGORY) {
                  params.delete("category");
                } else {
                  params.set("category", category);
                }

                return (
                  <TabsTrigger
                    key={category}
                    value={category.toString()}
                    asChild
                  >
                    <Link href={`/?${params.toString()}`} scroll={false}>
                      {capitalizeFirstLetter(category)}
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

export default CategoryBar;
