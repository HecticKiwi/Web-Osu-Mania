"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

export const DEFAULT_NSFW = true;

export function getNsfwParam(searchParams: ReadonlyURLSearchParams) {
  const nsfwParam = searchParams.get("nsfw");
  return nsfwParam ? nsfwParam === "true" : DEFAULT_NSFW;
}

const NsfwFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const nsfw = getNsfwParam(searchParams);

  const nsfwUrl = new URLSearchParams(searchParams);
  nsfwUrl.delete("nsfw");

  const noNsfwUrl = new URLSearchParams(searchParams);
  noNsfwUrl.set("nsfw", "false");

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Explicit Content</span>

        <div className="flex flex-wrap gap-x-2">
          <Button asChild variant={"link"} className="p-0">
            <Link
              href={`/?${noNsfwUrl.toString()}`}
              scroll={false}
              className={cn("h-8", !nsfw && "text-white")}
            >
              Hide
            </Link>
          </Button>
          <Button asChild variant={"link"} className="p-0">
            <Link
              href={`/?${nsfwUrl.toString()}`}
              scroll={false}
              className={cn("h-8", nsfw && "text-white")}
            >
              Show
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NsfwFilter;
