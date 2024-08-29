"use client";

import { parseNsfwParam } from "@/lib/searchParams/nsfwParam";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const NsfwFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const nsfw = parseNsfwParam(searchParams.get("nsfw"));

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
              prefetch={false}
            >
              Hide
            </Link>
          </Button>
          <Button asChild variant={"link"} className="p-0">
            <Link
              href={`/?${nsfwUrl.toString()}`}
              scroll={false}
              className={cn("h-8", nsfw && "text-white")}
              prefetch={false}
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
