"use client";

import {
  DEFAULT_GENRE,
  GENRES,
  parseGenreParam,
} from "@/lib/searchParams/genreParam";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const GenreFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const genreParam = parseGenreParam(searchParams.get("genre"));

  return (
    <>
      <div className={cn(className)}>
        <span className="text-muted-foreground">Genre</span>

        <div className="flex flex-wrap gap-x-2">
          {GENRES.map((genre) => {
            const params = new URLSearchParams(searchParams);

            if (genre === DEFAULT_GENRE) {
              params.delete("genre");
            } else {
              params.set("genre", genre);
            }

            return (
              <Button key={genre} asChild variant={"link"} className="p-0">
                <Link
                  href={`/?${params.toString()}`}
                  scroll={false}
                  className={cn("h-8", genreParam === genre && "text-white")}
                  prefetch={false}
                >
                  {genre}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GenreFilter;
